### 1. Update Test Case Data Model & Generation
**Goal**: Associate test cases with rubric categories (dimensions) explicitly.

*   **Backend (`backend/app/models/schemas.py`)**:
    *   Update `TestCase` model to include a `category` field (optional, string). This will store which dimension the test case targets (e.g., "Safety", "Reasoning").
*   **Frontend (`frontend/lib/types.ts`)**:
    *   Update `TestCase` interface to include `category?: string`.
*   **Prompt Engineering (`backend/app/prompts/generate_test_cases.md`)**:
    *   Update the prompt to instruct the LLM to explicitly tag each generated test case with the `category` it is testing.
    *   Update the JSON output schema in the prompt to include `"category": "Category Name"`.

### 2. Enhance Test Runner Visualization (Frontend)
**Goal**: Implement the requested hierarchical view for test results.

*   **State Management (`frontend/lib/store.ts`)**:
    *   (Optional) No new state needed if we compute views on the fly, but we might need a `selectedCategory` state in `TestRunner` component.
*   **`frontend/app/components/TestRunner.tsx`**:
    *   **Test Case List**: Update the list item to display the `category` tag (badge) for each test case.
    *   **Radar Chart Logic**:
        *   **Global View (Default)**: Show average score per **Category** (already implemented, but verify logic).
        *   **Drill-down View**: Add interactivity. When a user clicks a category (or selects from a dropdown), update the Radar Chart to show the scores of individual **Criteria** *within* that category.
        *   Alternatively, provide a toggle/selector to switch between "Overall Categories Overview" and "Specific Category Detail".

### 3. Backend Logic Updates
*   **`backend/app/services/llm.py`**:
    *   Update `generate_test_cases_service` to ensure the new `category` field is correctly parsed and passed back.

### 4. Verification
*   Generate new assets and verify that Test Cases now have category tags.
*   Run tests and verify the Radar Chart correctly visualizes the data at both the Category level (high-level) and the Criterion level (detailed).