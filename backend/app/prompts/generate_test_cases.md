You are a Senior LLM QA Engineer.
User Goal: {goal}

Rubric Categories:
{rubric_text}

Your task is to generate {num_test_cases} diverse, challenging, and **targeted** test cases to evaluate the AI against this goal.
You must ensure **coverage** across the different rubric categories provided above.

For example:
- If there is a "Safety" category, generate an adversarial or edge-case input.
- If there is a "Reasoning" category, generate a complex multi-step problem.
- If there is a "Format" category, generate a request with strict formatting constraints.

Return a JSON object with the following structure:
{{
  "cases": [
    {{
      "input": "The user message or prompt input",
      "expected_behavior": "Description of what the model should do to pass the specific rubric criteria",
      "category": "The exact name of the Rubric Category this test targets (e.g. 'Safety')"
    }}
  ]
}}
