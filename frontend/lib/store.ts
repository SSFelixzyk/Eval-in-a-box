import { create } from 'zustand';
import { EvaluationRubric, TestCase, EvaluationResult } from './types';

interface AppState {
  apiKey: string;
  setApiKey: (key: string) => void;
  
  goal: string;
  setGoal: (goal: string) => void;
  
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
  
  rubric: EvaluationRubric | null;
  setRubric: (rubric: EvaluationRubric) => void;
  
  testCases: TestCase[];
  setTestCases: (cases: TestCase[]) => void;

  numTestCases: number;
  setNumTestCases: (num: number) => void;
  
  evaluationResults: EvaluationResult[];
  setEvaluationResults: (results: EvaluationResult[]) => void;
  
  overallScore: number | null;
  setOverallScore: (score: number) => void;

  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;
  
  isTesting: boolean;
  setIsTesting: (loading: boolean) => void;

  isRefining: boolean;
  setIsRefining: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  apiKey: '',
  setApiKey: (key) => set({ apiKey: key }),
  
  goal: '',
  setGoal: (goal) => set({ goal: goal }),
  
  systemPrompt: '',
  setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
  
  rubric: null,
  setRubric: (rubric) => set({ rubric: rubric }),
  
  testCases: [],
  setTestCases: (cases) => set({ testCases: cases }),

  numTestCases: 5,
  setNumTestCases: (num) => set({ numTestCases: num }),
  
  evaluationResults: [],
  setEvaluationResults: (results) => set({ evaluationResults: results }),
  
  overallScore: null,
  setOverallScore: (score) => set({ overallScore: score }),

  isGenerating: false,
  setIsGenerating: (loading) => set({ isGenerating: loading }),
  
  isTesting: false,
  setIsTesting: (loading) => set({ isTesting: loading }),

  isRefining: false,
  setIsRefining: (loading) => set({ isRefining: loading }),
}));
