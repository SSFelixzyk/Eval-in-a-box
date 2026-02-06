"use client";
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from "recharts";
import { useMemo, useState } from 'react';

export function TestRunner() {
  const { systemPrompt, testCases, rubric, apiKey, isTesting, setIsTesting, setEvaluationResults, setOverallScore, evaluationResults, overallScore } = useAppStore();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleRunTests = async () => {
    if (!systemPrompt || !rubric || !apiKey) return;
    setIsTesting(true);
    setSelectedCategory(null);
    try {
      const res = await fetch('http://localhost:8000/api/test/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          system_prompt: systemPrompt,
          test_cases: testCases,
          rubric: rubric,
          api_key: apiKey
        })
      });
      if (!res.ok) throw new Error("Failed to run tests");
      const data = await res.json();
      setEvaluationResults(data.results);
      setOverallScore(data.overall_score);
    } catch (e) {
      console.error(e);
      alert("Error running tests");
    } finally {
      setIsTesting(false);
    }
  };

  const chartData = useMemo(() => {
    if (!evaluationResults.length || !rubric) return [];

    // Map criteria to categories
    const criterionToCategory: Record<string, string> = {};
    rubric.categories.forEach(cat => {
        cat.criteria.forEach(c => {
            criterionToCategory[c.name] = cat.name;
        });
    });

    if (selectedCategory) {
        // Detailed View: Show pass rate for each criterion in the selected category
        const category = rubric.categories.find(c => c.name === selectedCategory);
        if (!category) return [];

        const stats: Record<string, { total: number; passed: number }> = {};
        category.criteria.forEach(c => {
            stats[c.name] = { total: 0, passed: 0 };
        });

        evaluationResults.forEach(res => {
            res.judge_results.forEach(j => {
                if (stats[j.criterion_name]) {
                    stats[j.criterion_name].total += 1;
                    if (j.pass_status) {
                        stats[j.criterion_name].passed += 1;
                    }
                }
            });
        });

        return Object.keys(stats).map(key => ({
            subject: key,
            passRate: stats[key].total > 0 ? Math.round((stats[key].passed / stats[key].total) * 100) : 0,
            fullMark: 100,
        }));

    } else {
        // Global View: Show pass rate per Category
        const stats: Record<string, { total: number; passed: number }> = {};
        
        // Initialize with categories
        rubric.categories.forEach(cat => {
          stats[cat.name] = { total: 0, passed: 0 };
        });

        // Aggregate
        evaluationResults.forEach(res => {
          res.judge_results.forEach(j => {
            const catName = criterionToCategory[j.criterion_name];
            if (catName && stats[catName]) {
              stats[catName].total += 1;
              if (j.pass_status) {
                stats[catName].passed += 1;
              }
            }
          });
        });

        return Object.keys(stats).map(key => ({
          subject: key,
          passRate: stats[key].total > 0 ? Math.round((stats[key].passed / stats[key].total) * 100) : 0,
          fullMark: 100,
        }));
    }
  }, [evaluationResults, rubric, selectedCategory]);

  const filteredResults = useMemo(() => {
    if (!selectedCategory) return evaluationResults;
    // We can filter to show only test cases relevant to this category?
    // Or we can just show the score for this category in the test case card?
    // For now, let's keep all test cases but maybe highlight the relevant criteria?
    // Actually user requirement: "某个大类的分数和题目" -> maybe filter test cases that have criteria in this category?
    // But usually all test cases are evaluated against all criteria.
    // Let's assume we want to show all test cases, but the "Score" badge on the test case card 
    // should reflect the score for the selected category if one is selected.
    return evaluationResults;
  }, [evaluationResults, selectedCategory]);

  const getScoreForTestCase = (res: any) => {
    if (!selectedCategory || !rubric) return { score: res.total_score, max: res.max_score };

    // Calculate score only for the selected category
    const category = rubric.categories.find(c => c.name === selectedCategory);
    if (!category) return { score: 0, max: 0 };

    const criteriaNames = new Set(category.criteria.map(c => c.name));
    
    let score = 0;
    let max = 0;

    res.judge_results.forEach((j: any) => {
        if (criteriaNames.has(j.criterion_name)) {
            score += j.score;
        }
    });
    
    // Calculate max score for this category
    max = category.criteria.reduce((sum, c) => sum + c.weight, 0);

    return { score, max };
  };

  if (!systemPrompt) return (
    <div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
      Run tests to see results here
    </div>
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-col gap-2 pb-2 shrink-0">
        <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Results</CardTitle>
            <div className="flex items-center gap-4">
            {overallScore !== null && (
                <Badge variant={overallScore > 70 ? "default" : "destructive"} className="text-sm">
                Score: {overallScore.toFixed(1)}
                </Badge>
            )}
            <Button onClick={handleRunTests} disabled={isTesting} size="sm">
                {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Run Tests
            </Button>
            </div>
        </div>
        {evaluationResults.length > 0 && rubric && (
            <div className="flex gap-2 overflow-x-auto pb-1">
                <Button 
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setSelectedCategory(null)}
                >
                    Overall
                </Button>
                {rubric.categories.map((cat, i) => (
                    <Button
                        key={i}
                        variant={selectedCategory === cat.name ? "default" : "outline"}
                        size="sm"
                        className="h-7 text-xs whitespace-nowrap"
                        onClick={() => setSelectedCategory(cat.name)}
                    >
                        {cat.name}
                    </Button>
                ))}
            </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col overflow-hidden p-0 min-h-0">
        {evaluationResults.length > 0 && (
          <div className="h-[200px] w-full shrink-0 border-b bg-slate-50/50 p-2 relative">
             <div className="absolute top-2 left-2 z-10">
                <span className="text-xs font-bold text-gray-500 uppercase">
                    {selectedCategory ? `${selectedCategory} Breakdown` : "Overall Dimensions"}
                </span>
             </div>
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <RechartsTooltip />
                  <Radar
                    name="Pass Rate (%)"
                    dataKey="passRate"
                    stroke="#2563eb"
                    fill="#3b82f6"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
          </div>
        )}

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4 space-y-4">
            {evaluationResults.map((res, i) => {
               const { score, max } = getScoreForTestCase(res);
               return (
              <div key={i} className="border rounded-lg p-3 bg-white shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-sm">Test Case {i + 1}</h4>
                  <Badge variant="outline" className="text-xs">
                    {score.toFixed(1)} / {max.toFixed(1)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 gap-2 mb-3">
                  <div className="bg-gray-50 p-2 rounded text-xs">
                    <span className="font-semibold text-gray-500 block mb-1">Input:</span>
                    {res.test_case_input}
                  </div>
                  <div className="bg-blue-50 p-2 rounded text-xs">
                    <span className="font-semibold text-blue-500 block mb-1">Response:</span>
                    {res.model_response}
                  </div>
                </div>

                {/* Compact Rubric Results - Filter if category selected */}
                <div className="flex flex-wrap gap-2 mb-2">
                   {res.judge_results.filter(j => {
                        if (!selectedCategory || !rubric) return true;
                        // Find category for this criterion
                        for (const cat of rubric.categories) {
                            if (cat.name === selectedCategory) {
                                return cat.criteria.some(c => c.name === j.criterion_name);
                            }
                        }
                        return false;
                   }).map((judge, j) => (
                      <div key={j} className="flex items-center gap-1 text-xs border rounded px-1.5 py-0.5" title={`${judge.criterion_name}: ${judge.reason}`}>
                        {judge.pass_status ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500" />
                        )}
                        <span className="truncate max-w-[60px]">{judge.criterion_name}</span>
                      </div>
                   ))}
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="details" className="border-0">
                    <AccordionTrigger className="py-1 text-xs text-gray-400 hover:text-gray-600 hover:no-underline">
                      Show Explanation
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {res.judge_results.filter(j => {
                             if (!selectedCategory || !rubric) return true;
                             // Find category for this criterion
                             for (const cat of rubric.categories) {
                                 if (cat.name === selectedCategory) {
                                     return cat.criteria.some(c => c.name === j.criterion_name);
                                 }
                             }
                             return false;
                        }).map((judge, j) => (
                          <div key={j} className="text-xs flex gap-2">
                             {judge.pass_status ? (
                              <CheckCircle className="h-3 w-3 text-green-500 shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <span className="font-medium">{judge.criterion_name}: </span>
                              <span className="text-gray-600">{judge.reason}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )})}
            
            {evaluationResults.length === 0 && !isTesting && (
              <div className="text-center text-gray-400 text-sm py-10">
                No results yet. Click "Run Tests" to evaluate.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
