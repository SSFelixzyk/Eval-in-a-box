export interface RubricCriterion {
  name: string;
  description: string;
  weight: number;
}

export interface RubricCategory {
  name: string;
  description?: string;
  criteria: RubricCriterion[];
}

export interface EvaluationRubric {
  categories: RubricCategory[];
}

export interface TestCase {
  id?: string;
  input: string;
  expected_behavior?: string;
  category?: string;
}

export interface JudgeResult {
  criterion_name: string;
  pass_status: boolean;
  reason: string;
  score: number;
}

export interface EvaluationResult {
  test_case_input: string;
  model_response: string;
  judge_results: JudgeResult[];
  total_score: number;
  max_score: number;
}

export interface GenerateAssetsResponse {
  system_prompt: string;
  rubric: EvaluationRubric;
  test_cases: TestCase[];
}

export interface RunTestResponse {
  results: EvaluationResult[];
  overall_score: number;
}
