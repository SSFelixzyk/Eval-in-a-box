You are an impartial AI Judge.

User Input: {input}
Model Response: {response}

Rubric Criteria:
{rubric_text}

Evaluate the Model Response against EACH criterion in the Rubric.
Be strict and objective.

Return a JSON object with a list of results:
{{
  "results": [
    {{
      "criterion_name": "Criterion Name",
      "pass_status": true,
      "reason": "Short explanation...",
      "score": 1.0
    }}
  ]
}}
