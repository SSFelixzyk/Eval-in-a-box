# Failure Case Log

## Case 1: JSONDecodeError in Generate Assets
**Symptom**: User sees "Error generating assets" after a long wait. Backend logs show `json.decoder.JSONDecodeError: Expecting ',' delimiter`.
**Location**: `backend/app/services/llm.py` in `generate_rubric_service`.
**Cause**: The LLM returned malformed JSON or the response was truncated, causing `json.loads` to fail. The current `clean_json_string` helper might not be robust enough for all DeepSeek outputs.
**Solution**: 
1. Improve `clean_json_string` to handle more edge cases.
2. Add logging of the raw response when parsing fails to aid debugging.
3. Consider using a JSON repair library or retry logic (future).
