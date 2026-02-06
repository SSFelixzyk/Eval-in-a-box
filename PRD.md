# PRD：Eval-in-a-Box

## 1. 产品概述（Overview）

### 1.1 产品名称

**Eval-in-a-Box**

### 1.2 产品定位

一个 **Evaluation-first 的 Prompt 评估与对比工具**，用于：

* 将自然语言目标转化为评估体系
* 在**固定评估标准下**
* **对多个 Prompt 的优化效果进行可解释对比**

---

## 2. 背景与问题（Background & Problem）

Prompt 迭代常见误区：

* 改 Prompt ≠ 真正变好
* 不同 Prompt 没有可比性
* Prompt 变化与评估标准混在一起

**核心问题：**

> 没有固定 Evaluation，Prompt 优化没有“坐标系”。

## 3. 产品目标与非目标（Goals & Non-Goals）

### 3.1 产品目标（MVP）

在**单一 session**内，用户可以：

1. 输入自然语言目标
2. 生成：
   * 初始 System Prompt（Baseline）
   * Evaluation Rubric
   * Test Cases
3. **创建多个 Prompt Variant**
4. 在 **同一 Rubric + Test Set** 下：
   * 运行测试
   * 对比不同 Prompt 的得分
5. 清楚回答：
   > “这个 Prompt 为什么比那个好？”
---

## 4. 目标用户（Target User）

* 正在迭代 Prompt 的开发者 / 研究者
* 需要 **可解释对比** 而非“感觉更好”的用户

---

## 5. 核心使用场景（Primary Use Case）

用户目标：

```text
“I want a chatbot that sounds like a pirate and sells insurance.”
```

用户行为：

* 生成 baseline Prompt, Evaluation Rubric, Test Cases
* 手动修改 Prompt（Prompt v2 / v3）
* 在同一 Evaluation 下测试
* 观察得分变化

---

## 6. 用户流程（User Flow）

### Step 1：模型与 API Key 配置（可选）

用户输入自己的 API Key

用户选择模型服务厂商与模型名称

配置仅在当前 session 有效

### Step 2：输入自然语言目标

用户输入 1–3 句话的自然语言目标

### Step 3：生成评估系统

用户点击 Generate

系统生成并展示三类只读资产：

System Prompt

Evaluation Rubric

Test Cases

### Step 4：评估标准迭代（可选）

用户点击 Make rubric stricter

系统：

严格化 Evaluation Rubric

同步升级 Test Cases

System Prompt 保持不变

### Step 5：开始测试

用户点击 Start Testing

系统执行测试并计算分数


### Step 6：Prompt 编辑与管理（新增）

* 用户可以：

  * 编辑 Prompt 文本
  * 保存为新的 **Prompt Variant**
* Prompt Variant 至少包括：

  * Prompt v0（系统生成）
  * Prompt v1 / v2（用户编辑）

---

### Step 7：运行测试（Prompt-level）

* 用户选择一个 Prompt Variant
* 点击 **Run Test**
* 系统对该 Prompt 执行测试并评分

---

### Step 8：Prompt 对比

* 系统展示：

  * 每个 Prompt 的 Overall Score
  * 每条 Test Case 的 Pass / Fail
  * Rubric-level 差异

---

## 7. 功能需求（Functional Requirements）

---

### FR-1：自然语言目标输入

输入类型：多行文本
校验规则：
非空
≤ 500 字符
不提供模板或示例

### FR-2：System Prompt 生成
这个部分需要调用 大模型的 API 生成 System Prompt，初步开发使用 deepseek 的 api
需要传输给大模型的有用户输入的自然语言目标，以及一个固定的模板字符串，模板字符串中包含了 System Prompt 的生成规则。

大模型这时候会返回 System Prompt 字符串
我们需要接受这个字符串，并展示给用户

### FR-3：Evaluation Rubric 生成
这个部分需要调用 大模型的 API 生成 Evaluation Rubric
需要传输给大模型的有用户输入的自然语言目标，以及一个固定的模板字符串，模板字符串中包含了 Evaluation Rubric 的生成规则。

大模型这时候会返回 Evaluation Rubric Json 输出
我们需要接受这个 Json 输出，并展示给用户

### FR-4：Test Cases 生成
这个部分需要调用 大模型的 API 生成 Test Cases
需要传输给大模型的有用户输入的自然语言目标，Evaluation Rubric，以及一个固定的模板字符串，模板字符串中包含了 Test Cases 的生成规则。

大模型这时候会返回 Test Cases Json 输出
我们需要接受这个 Json 输出，并展示给用户

### FR-5：Rubric 严格化（Make rubric stricter）
这个部分需要调用 大模型的 API 严格化 Evaluation Rubric
需要传输给大模型的有用户输入的自然语言目标，Evaluation Rubric，以及一个固定的模板字符串，模板字符串中包含了 Rubric 严格化的生成规则。

大模型这时候会返回 Evaluation Rubric Json 输出
我们需要接受这个 Json 输出，并展示给用户

### FR-6：运行测试（Prompt-level）
这个部分需要调用 大模型的 API 运行测试
需要传输给大模型的有：System Prompt，Test Cases，以及一个固定的模板字符串，模板字符串中包含了运行测试的生成规则。
大模型这时候会返回 Answer 文本输出
我们需要接受这个字符串，并展示给用户

需要遍历 test cases，对每个 test case 调用大模型 API 生成 Response，
并将 Response 与 Test Case 一起展示给用户。

### FR-7：LLM-as-a-Judge
这个部分需要调用 大模型的 API 运行测试
需要传输给大模型的有：Evlauation Rubric，Test Cases，上一步 生成的 Response，以及一个固定的模板字符串，模板字符串中包含了 Judge 运行的生成规则。

大模型这时候会返回 Judge 的 Json 输出
我们需要接受这个 Json 输出，并展示给用户

需要遍历 test cases 和 responses 对子，对每个对子 调用大模型 API 生成 Judge Json 输出，
并将 Judge Json 输出与 (Test Case，Response) 一起展示给用户。

### FR-8：分数计算
上一步的 Judge 输出 中，每个 criterion 的 pass 字段为 true 则该 criterion 得分 1，为 false 则该 criterion 得分 0。
我们将所有 criterion 的得分相加，得到该条测试的得分。
最后，我们对所有测试的得分取平均值，得到该 System Prompt 在 当前 evaluation rubric 下的 Overall Score。

我们需要展示 Overall Score 给用户

## 10. 成功标准（Success Criteria）

MVP 成功当且仅当：

用户能完成完整闭环：
Goal → Prompt → Rubric → Test → Score

用户能解释：

这个分数是如何由 rubric 推导出来的

Demo 过程中无黑箱步骤

