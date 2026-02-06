from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

class GenerateRequest(BaseModel):
    goal: str = Field(..., max_length=500)
    api_key: str
    model: str = "deepseek-chat"
    num_test_cases: int = Field(5, ge=1, le=10)

class RubricCriterion(BaseModel):
    name: str
    description: str
    weight: float = 1.0

class RubricCategory(BaseModel):
    name: str
    description: Optional[str] = None
    criteria: List[RubricCriterion]

class EvaluationRubric(BaseModel):
    categories: List[RubricCategory]

class TestCase(BaseModel):
    id: Optional[str] = None
    input: str
    expected_behavior: Optional[str] = None
    category: Optional[str] = None

class TestCases(BaseModel):
    cases: List[TestCase]

class SystemPromptResponse(BaseModel):
    system_prompt: str

class GenerateAssetsResponse(BaseModel):
    system_prompt: str
    rubric: EvaluationRubric
    test_cases: List[TestCase]

class RunTestRequest(BaseModel):
    system_prompt: str
    test_cases: List[TestCase]
    rubric: EvaluationRubric
    api_key: str
    model: str = "deepseek-chat"

class JudgeRequest(BaseModel):
    rubric: EvaluationRubric
    test_case: TestCase
    response: str
    api_key: str

class JudgeResult(BaseModel):
    criterion_name: str
    pass_status: bool
    reason: str
    score: float

class EvaluationResult(BaseModel):
    test_case_input: str
    model_response: str
    judge_results: List[JudgeResult]
    total_score: float
    max_score: float

class StrictRubricRequest(BaseModel):
    rubric: EvaluationRubric
    goal: str
    api_key: str

class RefineRubricRequest(BaseModel):
    rubric: EvaluationRubric
    goal: str
    instruction: str
    api_key: str
