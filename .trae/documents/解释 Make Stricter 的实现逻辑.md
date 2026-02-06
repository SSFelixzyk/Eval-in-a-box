当前的 `make_rubric_stricter` 功能只修改 **Rubric (评分标准)**，而不修改 **Judge Prompt (判分指令)**。

### 现状分析
1.  **Rubric (评分标准)**：通过 `make_rubric_stricter.md` 提示词，让 LLM 将具体的评分条目（Criteria）改得更严格、更详细。
2.  **Judge (判分逻辑)**：使用 `judge_response_batch.md`，这是一个通用的判分 Prompt，它会读取 Rubric 中的标准，并指示 LLM "Be strict and objective"。

### 你的问题：make it stricter 是修改 rubric 还是修改 judge？
**目前的实现是：只修改 Rubric。**
即：把“及格线”从 60 分提高到 90 分，但“阅卷老师”（Judge Prompt）还是同一个。

### 建议的改进方案 (Plan)
为了达到真正的 "Stricter" 效果，仅仅修改 Rubric 可能还不够，因为如果“阅卷老师”本身比较宽松，即使标准写得再严，它也可能放水。
因此，我建议 **同时修改 Judge Prompt**，或者在 Judge 过程中注入 "Strict Mode" 的指令。

但是，考虑到架构的简洁性，目前最直接有效的方法是**增强 Judge Prompt 的严格程度**，或者在 `make_rubric_stricter` 生成的新 Rubric 中，**显式地加入对判分者的指令**（例如在 description 中加入 "Must reject if..."）。

**针对当前用户意图的执行计划：**
用户在询问 "现在是修改 rubric 还是修改 judge"，这可能是一个确认，也可能是一个隐性的需求（希望两者都改）。

我建议我们保持 `make_rubric_stricter` **只修改 Rubric 数据结构** 的逻辑不变，因为这是最可控的。
但是，我们可以优化 `judge_response_batch.md`，让它在读取 Rubric 时，能够更敏锐地捕捉到 Rubric 中的严格要求。

**结论**：目前是修改 Rubric。
**是否需要修改 Judge？**：暂时不需要动态修改 Judge Prompt 文件，因为 Judge Prompt 已经是通用的 "Be strict"。我们可以通过让 Rubric 的描述（Description）更加 "防御性"（defensive）来实现严格判分，例如明确写出 "Fail if any trace of X is found"，这样通用的 Judge 就会执行严格判分。

**本次任务**：我将向用户澄清目前的逻辑是修改 Rubric，并解释为什么这样做有效。如果用户希望修改 Judge 逻辑，我可以进一步实施。

(Self-correction: The user is asking a question to understand the system. I should answer clearly and verify if the current implementation aligns with their expectation of "stricter".)

**回答用户**：
目前的逻辑是 **只修改 Rubric (评分标准)**。
具体的实现方式是让 LLM 重写 `criteria` 的描述，使其包含更多的边界条件检查、更具体的格式要求和更低的容错率。
Judge (判分器) 作为一个通用的执行者，会根据新的、更严格的标准进行打分。

如果用户希望 "Judge" 本身的行为模式也发生改变（例如变为“大家来找茬”模式），我们可以在 Judge Prompt 中引入一个 `strict_mode` 参数。但目前看来，修改 Rubric 是最直接的手段。