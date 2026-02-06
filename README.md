# Eval-in-a-Box 📦

**Stop guessing. Start measuring.**  
Transform vague ideas into rigorous evaluation systems for your LLM applications.

## 💡 What is Eval-in-a-Box?

**Eval-in-a-Box** is an evaluation-first prompt engineering tool designed to solve the "vibes-based" optimization problem. Instead of tweaking prompts until they "feel better," this tool helps you establish a fixed coordinate system for quality before you even write your first line of production code.

It automatically generates a complete evaluation suite—System Prompt, Evaluation Rubric, and Test Cases—from a single natural language goal, allowing you to iterate on your prompts with scientific precision.

## 🚀 Key Features

- **🎯 Automated Asset Generation**: Instantly generate a baseline System Prompt, detailed Evaluation Rubric, and diverse Test Cases from a simple description (e.g., "I want a chatbot that sounds like a pirate").
- **📏 Rubric Refinement**: Iteratively improve your evaluation standards. Make rubrics stricter or adjust specific criteria using natural language instructions.
- **🤖 LLM-as-a-Judge**: Run automated tests where an LLM acts as an impartial judge, scoring your prompt's outputs against your defined rubric.
- **📊 Quantitative & Qualitative Insights**: Get an overall pass/fail score along with detailed reasoning for *why* a specific output met or missed the mark.
- **⚡ Rapid Iteration Cycle**: Quickly modify your system prompt and re-run tests against the same fixed rubric to measure actual improvement.

## 🛠️ Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **AI Engine**: OpenAI SDK (Compatible with DeepSeek V3, OpenAI GPT-4o, etc.)
- **Validation**: Pydantic

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, TypeScript)
- **UI Library**: Tailwind CSS, Shadcn/UI
- **State Management**: Zustand
- **Visualization**: Recharts

## 🏁 Getting Started

### Prerequisites
- Node.js & npm
- Python 3.10+
- An API Key (OpenAI or DeepSeek)

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# (Create a .env file based on your provider)
export OPENAI_API_KEY="your_key_here" 
# or for DeepSeek
export DEEPSEEK_API_KEY="your_key_here"

# Run the server
uvicorn main:app --reload
```

The backend API will be available at `http://localhost:8000`.

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open `http://localhost:3000` in your browser to start using Eval-in-a-Box.

## 📝 Usage Workflow

1.  **Define Goal**: Enter a high-level goal (e.g., "Summarize legal documents for 5-year-olds").
2.  **Generate Assets**: Click "Generate" to create your System Prompt, Rubric, and Test Cases.
3.  **Run Tests**: Execute the test cases. The system will use the generated prompt to answer and the rubric to evaluate.
4.  **Analyze & Refine**: Check the scores. If the prompt fails, edit the prompt or refine the rubric, then run the tests again.

## 📄 License

[MIT](LICENSE)
