### 1. 数据模型升级 (Data Model)
**目标**：构建支持多维评估的数据底层。

*   **后端 (`backend/app/models/schemas.py`)**:
    *   新增 `RubricCategory`：代表评估维度（如 Safety, Reasoning）。
    *   更新 `EvaluationRubric`：包含 `categories: List[RubricCategory]`。
*   **前端 (`frontend/lib/types.ts`)**:
    *   同步更新接口定义。

### 2. 专家级 Prompt 工程 (Expert Prompt Engineering)
**目标**：让生成的内容符合算法工程师的专业标准。

*   **`backend/app/prompts/generate_rubric.md`**:
    *   **Persona**: 设定为高级大模型测试工程师。
    *   **指令**：明确要求按**能力维度**（Dimensions）进行分类（如 Instruction Following, Factuality, Safety 等）。
    *   **标准**：要求 Criteria 必须是客观、可验证的 (Objective & Verifiable)。
*   **`backend/app/prompts/generate_test_cases.md`**:
    *   **策略升级**：要求生成的测试用例必须**覆盖 Rubric 的各个维度**。
    *   **指令**：例如“针对 Safety 维度生成攻击性输入”，“针对 Formatting 维度生成复杂格式要求”。
*   **`backend/app/prompts/refine_rubric.md`**:
    *   适配新的层级结构。

### 3. 业务逻辑适配 (Service Logic)
**目标**：后端逻辑支持维度遍历和定向生成。

*   **`backend/app/services/llm.py`**:
    *   `generate_test_cases_service`: 将 Rubric 的分类信息（Categories）格式化后喂给 LLM，确保生成的 Case 具有针对性。
    *   `judge_criterion`: 适配层级结构，遍历 `Category -> Criteria` 进行打分。

### 4. 专业化结果展示 (Frontend Visualization)
**目标**：提供通过率概览和维度分析。

*   **`frontend/app/components/AssetsDisplay.tsx`**:
    *   **Rubric 展示**：使用卡片/折叠面板按维度分组展示，清晰呈现评估体系。
*   **`frontend/app/components/TestRunner.tsx`**:
    *   **雷达图优化**：基于 `Category` 维度绘制雷达图，直观展示模型的能力画像（能力偏科情况）。
    *   **结果列表**：在测试结果中，按维度聚合展示具体的 Pass/Fail 详情。

### 5. 验证 (Verification)
*   生成一套针对“代码助手”的 Rubric，检查是否包含 Correctness, Efficiency, Style 等工程维度。
*   生成测试用例，检查是否包含针对这些维度的 Edge Cases。
*   运行测试，验证雷达图是否能正确反映各维度的得分。