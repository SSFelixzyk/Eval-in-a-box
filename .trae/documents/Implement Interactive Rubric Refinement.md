# Interactive Refinement Implementation Plan

To implement the "Interactive Refinement" feature, allowing users to tweak the rubric (e.g., "Make it stricter"), we will introduce a conversational refinement loop.

## 1. Backend Changes

*   **New API Endpoint**: `/api/refine/rubric`
    *   **Method**: `POST`
    *   **Input**: `current_rubric` (JSON), `instruction` (string, e.g., "Make it stricter", "Add a criterion for politeness"), `goal` (string).
    *   **Output**: `EvaluationRubric` (Updated JSON).
    *   **Logic**:
        1.  Load a new prompt template `refine_rubric.md`.
        2.  Call LLM with the current rubric + user instruction.
        3.  Return the updated structured rubric.

*   **New Prompt Template**: `backend/app/prompts/refine_rubric.md`
    *   This will replace the hardcoded "Make rubric stricter" logic with a generic "Refine based on instruction" logic.
    *   *Template Sketch*:
        ```markdown
        You are an expert QA engineer.
        User Goal: {goal}
        
        Current Rubric:
        {current_rubric}
        
        User Instruction for Refinement:
        "{instruction}"
        
        Please update the rubric to follow the user's instruction. Modify, add, or remove criteria as needed.
        Return the updated rubric JSON.
        ```

## 2. Frontend Changes

*   **Store Update (`store.ts`)**:
    *   Add `isRefining` state to track loading status during refinement.
*   **UI Update (`AssetsDisplay.tsx`)**:
    *   In the **Rubric Tab**, add a "Refinement Bar" at the bottom.
    *   **Components**:
        *   `Input`: Text field for user instruction (placeholder: "e.g., Make it stricter, Add safety check...").
        *   `Button`: "Refine Rubric" (triggers the API call).
    *   **Quick Actions**: Add a preset button/chip for "Make it stricter" since it's a common use case.

## 3. Integration Flow

1.  User views the generated Rubric.
2.  User types "Make it stricter" or clicks a shortcut button.
3.  Frontend calls `/api/refine/rubric`.
4.  Backend LLM processes the request and returns the new Rubric.
5.  Frontend updates the `rubric` state.
6.  (Optional) User can immediately run tests again with the new rubric to see the difference (already supported by existing TestRunner).

## 4. Verification

*   Verify that the rubric actually changes according to instructions.
*   Verify that the JSON structure remains valid after refinement.
