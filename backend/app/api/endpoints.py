from fastapi import APIRouter, HTTPException
from ..models.schemas import *
from ..services.llm import *
import asyncio

router = APIRouter()

@router.post("/generate/assets", response_model=GenerateAssetsResponse)
async def generate_assets(request: GenerateRequest):
    try:
        # Run prompt and rubric gen in parallel
        system_prompt_task = generate_system_prompt_service(request.goal, request.api_key)
        rubric_task = generate_rubric_service(request.goal, request.api_key)
        
        system_prompt, rubric = await asyncio.gather(system_prompt_task, rubric_task)
        
        # Test cases depend on Rubric
        test_cases_obj = await generate_test_cases_service(request.goal, rubric, request.api_key, request.num_test_cases)
        
        return GenerateAssetsResponse(
            system_prompt=system_prompt,
            rubric=rubric,
            test_cases=test_cases_obj.cases
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate/rubric/strict", response_model=EvaluationRubric)
async def strict_rubric(request: StrictRubricRequest):
    try:
        return await make_rubric_stricter_service(request.goal, request.rubric, request.api_key)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refine/rubric", response_model=EvaluationRubric)
async def refine_rubric_endpoint(request: RefineRubricRequest):
    try:
        return await refine_rubric_service(request.goal, request.rubric, request.instruction, request.api_key)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

class RunTestResponse(BaseModel):
    results: List[EvaluationResult]
    overall_score: float

@router.post("/test/run", response_model=RunTestResponse)
async def run_tests(request: RunTestRequest):
    try:
        # Run all test cases in parallel
        tasks = [
            run_single_test(request.system_prompt, tc, request.rubric, request.api_key)
            for tc in request.test_cases
        ]
        results = await asyncio.gather(*tasks)
        
        total_score_sum = sum(r.total_score for r in results)
        total_max_sum = sum(r.max_score for r in results)
        
        overall_score = (total_score_sum / total_max_sum * 100) if total_max_sum > 0 else 0
        
        return RunTestResponse(
            results=results,
            overall_score=overall_score
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
