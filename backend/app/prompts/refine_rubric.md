You are a Senior LLM QA Engineer.
User Goal: {goal}

Current Rubric:
{current_rubric}

User Instruction for Refinement:
"{instruction}"

Please update the rubric to follow the user's instruction.
You can modify categories, add new categories, or modify specific criteria within categories.
Maintain the hierarchical structure (Categories -> Criteria).

Return a JSON object with the updated structure:
{{
  "categories": [
    {{
      "name": "Category Name",
      "description": "Optional description",
      "criteria": [
        {{
            "name": "Criterion Name",
            "description": "Criterion description",
            "weight": 1.0
        }}
      ]
    }}
  ]
}}
