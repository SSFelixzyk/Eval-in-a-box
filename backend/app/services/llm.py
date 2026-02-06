import sys
import os
from langchain_deepseek import ChatDeepSeek
from langchain_core.prompts import ChatPromptTemplate
from typing import List, Optional
from ..models.schemas import *

def get_chat_model(api_key: str, model: str = "deepseek-chat"):
    return ChatDeepSeek(
        model=model,
        api_key=api_key,
        temperature=0.7,
    )

def load_prompt(filename: str) -> str:
    # Assuming prompts are in backend/app/prompts/
    base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    path = os.path.join(base_path, "prompts", filename)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

async def generate_system_prompt_service(goal: str, api_key: str) -> str:
    llm = get_chat_model(api_key)
    prompt_text = load_prompt("generate_system_prompt.md")
    prompt = ChatPromptTemplate.from_template(prompt_text)
    chain = prompt | llm
    response = await chain.ainvoke({"goal": goal})
    return response.content.strip()

async def generate_rubric_service(goal: str, api_key: str) -> EvaluationRubric:
    llm = get_chat_model(api_key)
    structured_llm = llm.with_structured_output(EvaluationRubric)
    prompt_text = load_prompt("generate_rubric.md")
    prompt = ChatPromptTemplate.from_template(prompt_text)
    chain = prompt | structured_llm
    
    try:
        result = await chain.ainvoke({"goal": goal})
        print(f"DEBUG: generate_rubric_service result: {result}", file=sys.stderr)
        if result is None:
            raise ValueError("LLM returned None for rubric generation")
        return result
    except Exception as e:
        print(f"Error in generate_rubric_service: {e}", file=sys.stderr)
        raise

async def generate_test_cases_service(goal: str, rubric: EvaluationRubric, api_key: str, num_test_cases: int = 5) -> TestCases:
    if rubric is None:
        raise ValueError("Rubric cannot be None in generate_test_cases_service")
        
    llm = get_chat_model(api_key)
    structured_llm = llm.with_structured_output(TestCases)
    
    rubric_lines = []
    if rubric.categories:
        for cat in rubric.categories:
            rubric_lines.append(f"## {cat.name}")
            for c in cat.criteria:
                rubric_lines.append(f"- {c.name}: {c.description}")
    else:
        print("WARNING: Rubric has no categories!", file=sys.stderr)
            
    rubric_text = "\n".join(rubric_lines)
    prompt_text = load_prompt("generate_test_cases.md")
    prompt = ChatPromptTemplate.from_template(prompt_text)
    chain = prompt | structured_llm
    
    try:
        return await chain.ainvoke({"goal": goal, "rubric_text": rubric_text, "num_test_cases": num_test_cases})
    except Exception as e:
        print(f"Error in generate_test_cases_service: {e}", file=sys.stderr)
        raise

async def make_rubric_stricter_service(goal: str, rubric: EvaluationRubric, api_key: str) -> EvaluationRubric:
    llm = get_chat_model(api_key)
    structured_llm = llm.with_structured_output(EvaluationRubric)
    rubric_text = rubric.model_dump_json(indent=2)
    prompt_text = load_prompt("make_rubric_stricter.md")
    prompt = ChatPromptTemplate.from_template(prompt_text)
    chain = prompt | structured_llm
    
    try:
        result = await chain.ainvoke({"goal": goal, "current_rubric": rubric_text})
        if result is None:
             raise ValueError("LLM returned None for strict rubric generation")
        return result
    except Exception as e:
        print(f"Error in make_rubric_stricter_service: {e}", file=sys.stderr)
        raise

async def refine_rubric_service(goal: str, rubric: EvaluationRubric, instruction: str, api_key: str) -> EvaluationRubric:
    llm = get_chat_model(api_key)
    structured_llm = llm.with_structured_output(EvaluationRubric)
    rubric_text = rubric.model_dump_json(indent=2)
    prompt_text = load_prompt("refine_rubric.md")
    prompt = ChatPromptTemplate.from_template(prompt_text)
    chain = prompt | structured_llm
    
    try:
        result = await chain.ainvoke({"goal": goal, "current_rubric": rubric_text, "instruction": instruction})
        if result is None:
             raise ValueError("LLM returned None for refine rubric generation")
        return result
    except Exception as e:
        print(f"Error in refine_rubric_service: {e}", file=sys.stderr)
        raise

class BatchJudgeResult(BaseModel):
    criterion_name: str
    pass_status: bool
    reason: str
    score: float

class BatchJudgeOutput(BaseModel):
    results: List[BatchJudgeResult]

async def run_single_test(system_prompt: str, test_case: TestCase, rubric: EvaluationRubric, api_key: str) -> EvaluationResult:
    llm = get_chat_model(api_key)
    
    # 1. Get Model Response
    messages = [
        ("system", system_prompt),
        ("human", test_case.input)
    ]
    response = await llm.ainvoke(messages)
    model_response = response.content
    
    # 2. Batch Judge Response
    judge_llm = get_chat_model(api_key).with_structured_output(BatchJudgeOutput)
    judge_prompt_template = load_prompt("judge_response_batch.md")
    
    rubric_lines = []
    for cat in rubric.categories:
        rubric_lines.append(f"## {cat.name}")
        for c in cat.criteria:
            rubric_lines.append(f"- {c.name}: {c.description}")
            
    rubric_text = "\n".join(rubric_lines)
    
    prompt_text = judge_prompt_template.format(
        input=test_case.input,
        response=model_response,
        rubric_text=rubric_text
    )
    
    judge_results = []
    
    try:
        batch_result = await judge_llm.ainvoke([("human", prompt_text)])
        
        # Map back to original criterion weights
        all_criteria = [c for cat in rubric.categories for c in cat.criteria]
        criterion_map = {c.name: c for c in all_criteria}
        
        for res in batch_result.results:
            original_criterion = criterion_map.get(res.criterion_name)
            weight = original_criterion.weight if original_criterion else 1.0
            
            judge_results.append(JudgeResult(
                criterion_name=res.criterion_name,
                pass_status=res.pass_status,
                reason=res.reason,
                score=res.score * weight
            ))
            
        # Handle case where LLM might miss some criteria or hallucinate names
        # Ensure we have a result for every criterion in the rubric
        judged_names = set(r.criterion_name for r in judge_results)
        for c in all_criteria:
            if c.name not in judged_names:
                judge_results.append(JudgeResult(
                    criterion_name=c.name,
                    pass_status=False,
                    reason="Judge failed to evaluate this criterion.",
                    score=0.0
                ))
                
    except Exception as e:
        print(f"Batch Judge Error: {e}", file=sys.stderr)
        # Fallback: mark all as failed
        all_criteria = [c for cat in rubric.categories for c in cat.criteria]
        for c in all_criteria:
            judge_results.append(JudgeResult(
                criterion_name=c.name,
                pass_status=False,
                reason=f"Error in batch judgment: {str(e)}",
                score=0.0
            ))

    total_score = sum(r.score for r in judge_results)
    all_criteria = [c for cat in rubric.categories for c in cat.criteria]
    max_score = sum(c.weight for c in all_criteria)
    
    return EvaluationResult(
        test_case_input=test_case.input,
        model_response=model_response,
        judge_results=judge_results,
        total_score=total_score,
        max_score=max_score
    )
