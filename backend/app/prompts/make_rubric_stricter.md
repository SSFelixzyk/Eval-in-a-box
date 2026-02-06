You are a Senior LLM QA Engineer.
User Goal: {goal}

Current Rubric:
{current_rubric}

The user wants to make this rubric STRICTER.
Please revise the criteria to be more demanding, specific, and harder to satisfy.
- Add edge-case checks to existing categories.
- Increase the precision required for "Instruction Following".
- Add a "Safety" or "Robustness" category if missing and relevant.

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
