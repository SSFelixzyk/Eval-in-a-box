"use client";
import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { MOCK_RUBRIC, MOCK_SYSTEM_PROMPT, MOCK_TEST_CASES } from '@/lib/mock_data';

export function ConfigForm() {
  const { apiKey, setApiKey, goal, setGoal, isGenerating, setIsGenerating, setSystemPrompt, setRubric, setTestCases, rubric, isRefining, setIsRefining, numTestCases, setNumTestCases } = useAppStore();
  const [refinementInput, setRefinementInput] = useState("");

  const handleGenerate = async () => {
    if (!apiKey || !goal) return;
    setIsGenerating(true);
    try {
      const res = await fetch('http://localhost:8000/api/generate/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, api_key: apiKey, num_test_cases: numTestCases })
      });
      if (!res.ok) throw new Error("Failed to generate assets");
      const data = await res.json();
      setSystemPrompt(data.system_prompt);
      setRubric(data.rubric);
      setTestCases(data.test_cases);
    } catch (e) {
      console.error(e);
      alert("Error generating assets. Please check API Key and Backend.");
    } finally {
      setIsGenerating(false);
    }
  };

  const loadMockData = () => {
    setSystemPrompt(MOCK_SYSTEM_PROMPT);
    setRubric(MOCK_RUBRIC);
    setTestCases(MOCK_TEST_CASES);
    if (!goal) setGoal("Create a helpful programming assistant (Mock)");
  };

  const handleRefine = async (instruction: string) => {
    if (!rubric || !apiKey || !goal) return;
    
    setIsRefining(true);
    try {
      const res = await fetch('http://localhost:8000/api/refine/rubric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          rubric: rubric,
          goal: goal,
          instruction: instruction,
          api_key: apiKey
        })
      });
      if (!res.ok) throw new Error("Failed to refine rubric");
      const newRubric = await res.json();
      setRubric(newRubric);
      setRefinementInput(""); 
    } catch (e) {
      console.error(e);
      alert("Error refining rubric");
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Configuration & Goal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">API Key (DeepSeek/OpenAI)</label>
          <Input 
            type="password" 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)} 
            placeholder="sk-..." 
          />
        </div>
        <div>
          <label className="text-sm font-medium">Goal</label>
          <Textarea 
            value={goal} 
            onChange={(e) => setGoal(e.target.value)} 
            placeholder="e.g. I want a chatbot that sounds like a pirate and sells insurance."
            rows={4}
          />
        </div>
        
        <div className="space-y-2">
            <div className="flex justify-between">
                <label className="text-sm font-medium">Test Cases: {numTestCases}</label>
            </div>
            <Slider
                value={[numTestCases]}
                min={1}
                max={10}
                step={1}
                onValueChange={(vals) => setNumTestCases(vals[0])}
            />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleGenerate} disabled={isGenerating || !apiKey || !goal} className="flex-1">
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Assets
          </Button>
          <Button variant="outline" onClick={loadMockData} className="px-3" title="Load Mock Data">
            Mock
          </Button>
        </div>

        {/* Refinement Section - Moved from AssetsDisplay */}
        {rubric && (
          <div className="pt-4 mt-4 border-t">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-xs font-semibold text-gray-700">Refine Rubric</span>
            </div>
            <div className="flex gap-2 mb-2">
              <Input 
                placeholder="e.g. Make it stricter..." 
                className="h-8 text-xs"
                value={refinementInput}
                onChange={(e) => setRefinementInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRefine(refinementInput)}
              />
              <Button 
                size="sm" 
                className="h-8 px-3" 
                onClick={() => handleRefine(refinementInput)}
                disabled={isRefining || !refinementInput}
              >
                {isRefining ? <Loader2 className="h-3 w-3 animate-spin" /> : "Refine"}
              </Button>
            </div>
             <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-6 text-[10px] px-2 text-gray-500"
                  onClick={() => handleRefine("Make it stricter")}
                  disabled={isRefining}
                >
                  Make Stricter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-6 text-[10px] px-2 text-gray-500"
                  onClick={() => handleRefine("Simplify criteria")}
                  disabled={isRefining}
                >
                  Simplify
                </Button>
              </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
