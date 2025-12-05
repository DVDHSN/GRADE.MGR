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
        <p className="text-zinc-700 font-mono text-xs uppercase text-center tracking-wider">
          Insufficient Data<br/>For Comparison
        </p>
      </Card>
    );
  }

  return (
    <Card title="Midterm vs Final" className="h-full">
      <div className="flex flex-col gap-3">
        {comparisonData.map((data) => (
          <div key={data.course} className="group flex items-center justify-between bg-zinc-900/40 p-3 border border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900 hover:scale-[1.01] hover:shadow-lg relative transition-all duration-300 transform-gpu z-0 hover:z-10">
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight group-hover:text-red-500 transition-colors">{data.course}</span>
              <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">Score Delta</span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-zinc-500 font-mono">MID</span>
                <span className="font-mono text-lg text-zinc-300">{data.midterm}</span>
              </div>
              
              <div className="flex flex-col items-center group-hover:scale-110 transition-transform">
                <span className="text-[10px] text-zinc-500 font-mono">FIN</span>
                <span className="font-mono text-lg text-white font-bold">{data.final}</span>
              </div>

              <div className={`flex items-center justify-center w-10 h-10 border transition-all duration-500 ${
                data.diff > 0 ? 'border-zinc-800 text-emerald-500 group-hover:border-emerald-900 group-hover:bg-emerald-950/30' : 
                data.diff < 0 ? 'border-zinc-800 text-red-500 group-hover:border-red-900 group-hover:bg-red-950/30' : 
                'border-zinc-800 text-zinc-500'
              }`}>
                {data.diff > 0 ? <ArrowUpRight size={20} /> : 
                 data.diff < 0 ? <ArrowDownRight size={20} /> : 
                 <Minus size={20} />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};