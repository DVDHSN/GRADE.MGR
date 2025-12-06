import React from 'react';
import { Grade, ExamType } from '../types';
import { Card } from './UI';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface ComparisonProps {
  grades: Grade[];
}

export const ComparisonView: React.FC<ComparisonProps> = ({ grades }) => {
  const courses = Array.from(new Set(grades.map(g => g.courseName)));
  
  const comparisonData = courses.map(course => {
    const courseGrades = grades.filter(g => g.courseName === course);
    const midterm = courseGrades.find(g => g.type === ExamType.MIDTERM);
    const final = courseGrades.find(g => g.type === ExamType.FINAL);
    
    if (!midterm || !final) return null;

    const diff = final.score - midterm.score;
    return {
      course,
      midterm: midterm.score,
      final: final.score,
      diff
    };
  }).filter(Boolean) as { course: string; midterm: number; final: number; diff: number }[];

  if (comparisonData.length === 0) {
    return (
      <Card title="Midterm vs Final" className="h-full min-h-[200px] flex items-center justify-center">
        <p className="text-zinc-600 font-mono text-xs uppercase text-center tracking-wider">
          Insufficient Data<br/>For Comparison
        </p>
      </Card>
    );
  }

  return (
    <Card title="Midterm vs Final" className="h-full">
      <div className="flex flex-col gap-3">
        {comparisonData.map((data) => (
          <div key={data.course} className="group flex items-center justify-between bg-zinc-900/20 p-4 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 hover:-translate-y-0.5 hover:shadow-lg relative transition-all duration-300 transform-gpu z-0 hover:z-10 rounded-sm">
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-zinc-300 group-hover:text-white transition-colors">{data.course}</span>
              <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest group-hover:text-zinc-500 transition-colors">Score Delta</span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center opacity-60 group-hover:opacity-100 transition-all duration-300">
                <span className="text-[10px] text-zinc-500 font-mono mb-1">MID</span>
                <span className="font-mono text-lg text-zinc-400">{data.midterm}</span>
              </div>
              
              <div className="flex flex-col items-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-[10px] text-zinc-500 font-mono mb-1">FIN</span>
                <span className="font-mono text-lg text-white font-bold">{data.final}</span>
              </div>

              <div className={`flex items-center justify-center w-10 h-10 border transition-all duration-300 rounded-sm group-hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] ${
                data.diff > 0 ? 'border-zinc-800 text-emerald-500 group-hover:border-emerald-500/50 group-hover:bg-emerald-950/20' : 
                data.diff < 0 ? 'border-zinc-800 text-red-500 group-hover:border-red-500/50 group-hover:bg-red-950/20' : 
                'border-zinc-800 text-zinc-500 group-hover:border-zinc-500 group-hover:text-zinc-300'
              }`}>
                {data.diff > 0 ? <ArrowUpRight size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /> : 
                 data.diff < 0 ? <ArrowDownRight size={20} className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" /> : 
                 <Minus size={20} />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};