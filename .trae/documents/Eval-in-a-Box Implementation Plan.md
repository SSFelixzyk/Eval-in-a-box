# Project Implementation Plan: Eval-in-a-Box

Based on the PRD, here is the proposed plan to build the "Eval-in-a-Box" MVP. I have selected a modern tech stack to ensure the application is responsive, maintainable, and capable of handling concurrent LLM requests.

## 1. Technology Stack Selection
*   **Frontend**: **Next.js (React)** with **Tailwind CSS** and **shadcn/ui**.
    *   *Why*: Excellent for building interactive dashboards (like the comparison view), managing complex state (rubrics, test cases), and modern UI components.
*   **Backend**: **FastAPI (Python)**.
    *   *Why*: Python is the native language of AI engineering. FastAPI supports asynchronous operations (crucial for parallel LLM calls) and Pydantic for strict data validation (FR-3, FR-4).
*   **LLM Integration**: **DeepSeek API** (via OpenAI SDK or direct HTTP).

## 2. Optimization & Refinement Proposals
*   **Parallel Execution**: Running tests sequentially is too slow. We will implement **async parallel processing** in the backend to run multiple test cases simultaneously.
*   **Structured Data Enforcement**: We will use Pydantic models to strictly define the schema for `EvaluationRubric` and `TestCases` to prevent the UI from breaking due to malformed LLM JSON.
*   **Session Management**: As per the PRD (Single Session), we will keep state primarily in the **Frontend Store (Zustand/Context)**. The backend will be stateless to keep the architecture simple and scalable for the MVP.
*   **Comparison UX**: We will implement a side-by-side or tabular view to clearly show the "Winner" based on the Rubric scores, highlighting *why* one prompt performed better.

## 3. Implementation Phases

### Phase 1: Project Initialization
1.  Set up a monorepo structure: `/frontend` (Next.js) and `/backend` (FastAPI).
2.  Configure `uv` or `poetry` for Python dependency management.
3.  Configure `npm`/`pnpm` for Frontend.
4.  Create basic Pydantic models for `Rubric`, `TestCase`, `PromptVariant`, and `EvaluationResult`.

### Phase 2: Core Backend Logic (The "Brain")
1.  Implement **LLM Client Wrapper**: A unified service to call DeepSeek API.
2.  Implement **Generators**:
    *   `Goal -> System Prompt`
    *   `Goal -> Evaluation Rubric` (JSON)
    *   `Goal + Rubric -> Test Cases` (JSON)
3.  Implement **Evaluator (The "Judge")**:
    *   `System Prompt + Test Case -> Response`
    *   `Response + Rubric -> Score + Reasoning`
4.  Implement **Strictness Modifier**: Logic to rewrite the rubric to be stricter.

### Phase 3: Frontend Development (The "Interface")
1.  **Configuration & Input**: Page for API Key entry and Goal input.
2.  **Asset Dashboard**: View to display and edit the generated System Prompt, Rubric, and Test Cases.
3.  **Testing Arena**:
    *   Button to "Run Tests".
    *   Progress indicator (since evaluation takes time).
    *   Results display (Pass/Fail, Reason).
4.  **Prompt Playground**: Ability to clone the System Prompt, edit it, and save as a Variant.
5.  **Comparison View**: A matrix view comparing different Prompt Variants against the same Test Cases.

### Phase 4: Integration & Polish
1.  Connect Frontend to Backend endpoints.
2.  Add error handling (e.g., API timeouts, malformed JSON retry).
3.  Verify the "Success Criteria" (Goal -> Score loop).
