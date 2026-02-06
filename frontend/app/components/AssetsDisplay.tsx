"use client";
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function AssetsDisplay() {
  const { systemPrompt, setSystemPrompt, rubric, testCases } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of rubric when it updates to ensure refinement bar is visible or close to it
  useEffect(() => {
    if (scrollRef.current) {
        // Optional: We can scroll to bottom if we want to emphasize the new content or the bar
        // scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [rubric]);

  if (!systemPrompt) return (
    <div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
      Generated assets will appear here
    </div>
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Generated Assets</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden pt-0 h-full">
        <Tabs defaultValue="prompt" className="flex-1 flex flex-col h-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
            <TabsTrigger value="rubric">Rubric</TabsTrigger>
            <TabsTrigger value="tests">Test Cases</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prompt" className="flex-1 mt-2 h-0">
            <Textarea 
              value={systemPrompt} 
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="h-full font-mono resize-none"
            />
          </TabsContent>
          
          <TabsContent value="rubric" className="flex-1 mt-2 min-h-0 overflow-hidden flex flex-col">
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 h-full rounded-md border p-4 mb-2">
                <div ref={scrollRef} />
                {rubric?.categories.map((cat, catIndex) => (
                  <div key={catIndex} className="mb-6 last:mb-0">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b bg-gray-50/50 p-2 rounded-t">
                        <h3 className="font-bold text-sm text-gray-800 uppercase tracking-wide">{cat.name}</h3>
                        {cat.description && (
                            <span className="text-xs text-gray-500 italic truncate max-w-[300px]" title={cat.description}> - {cat.description}</span>
                        )}
                    </div>
                    <div className="pl-2">
                        {cat.criteria.map((c, i) => (
                            <div key={i} className="mb-4 last:mb-0">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-sm flex items-center gap-2">
                                {c.name}
                                <TooltipProvider>
                                    <Tooltip>
                                    <TooltipTrigger>
                                        <HelpCircle className="h-3 w-3 text-gray-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[300px]">
                                        <p>{c.description}</p>
                                    </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                </h4>
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-mono">
                                weight: {c.weight}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600">{c.description}</p>
                            </div>
                        ))}
                    </div>
                  </div>
                ))}
                </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="tests" className="flex-1 mt-2 h-0 overflow-hidden">
             <ScrollArea className="h-full rounded-md border p-4">
              {testCases.map((tc, i) => (
                <div key={i} className="mb-4 p-3 bg-gray-50 rounded border text-sm last:mb-0">
                  <div className="flex justify-between items-start mb-1">
                      <div className="font-semibold text-xs text-gray-500 uppercase">Test Case {i+1}</div>
                      {tc.category && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium border border-blue-200">
                              {tc.category}
                          </span>
                      )}
                  </div>
                  <p className="mb-2 whitespace-pre-wrap">{tc.input}</p>
                  {tc.expected_behavior && (
                    <div className="mt-2 pl-2 border-l-2 border-gray-300">
                      <p className="text-xs text-gray-500 font-medium">Expected Behavior:</p>
                      <p className="text-xs text-gray-600">{tc.expected_behavior}</p>
                    </div>
                  )}
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
