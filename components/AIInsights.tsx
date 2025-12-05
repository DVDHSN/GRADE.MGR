import React, { useState } from 'react';
import { Grade } from '../types';
import { generateAcademicInsights } from '../services/geminiService';
import { Button, Card } from './UI';
import { BrainCircuit, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const AIInsights: React.FC<{ grades: Grade[] }> = ({ grades }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (grades.length === 0) return;
    setLoading(true);
    const result = await generateAcademicInsights(grades);
    setInsight(result);
    setLoading(false);
  };

  return (
    <Card title="Gemini AI Analysis" className="col-span-1 md:col-span-2 lg:col-span-1 border-emerald-900 bg-emerald-950/10">
      <div className="flex flex-col gap-4 h-full">
        {!insight && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <BrainCircuit size={48} className="text-emerald-500 mb-4 opacity-50" />
            <p className="text-zinc-400 text-sm font-mono mb-6">
              Let Google Gemini analyze your grades to find patterns and suggest improvements.
            </p>
            <Button onClick={handleAnalyze} disabled={grades.length === 0 || loading} className="w-full">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : 'GENERATE REPORT'}
            </Button>
          </div>
        )}

        {insight && (
          <div className="flex flex-col h-full animate-in fade-in duration-500">
             <div className="prose prose-invert prose-sm prose-p:font-mono prose-headings:font-bold prose-headings:text-emerald-400 max-w-none overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                <ReactMarkdown>{insight}</ReactMarkdown>
             </div>
             <Button variant="outline" onClick={() => setInsight('')} className="mt-4 text-xs py-2">
               Clear Report
             </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
