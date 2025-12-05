import React from 'react';
import { Grade } from '../types';
import { Card } from './UI';
import { History, Activity } from 'lucide-react';

export const RecentGrades: React.FC<{ grades: Grade[] }> = ({ grades }) => {
  const recent = [...grades].reverse().slice(0, 5);

  return (
    <Card title="Recent Logs" className="h-full">
      {recent.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-zinc-800 gap-2 min-h-[150px] animate-pulse">
           <Activity size={32} className="opacity-20" />
           <span className="font-mono text-[10px] uppercase tracking-widest">No Activity</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {recent.map((g, i) => (
            <div 
              key={g.id} 
              className="group flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-900 hover:border-red-900/50 hover:bg-zinc-900 hover:scale-[1.02] hover:shadow-lg transition-all duration-200 cursor-default transform-gpu"
              style={{ animationDelay: `${i * 50}ms` }}
            >
               <div className="flex flex-col">
                 <span className="font-bold text-zinc-300 tracking-tight group-hover:text-white transition-colors">{g.courseName}</span>
                 <span className="text-[10px] text-zinc-600 uppercase font-mono tracking-widest group-hover:text-red-500 transition-colors">{g.type}</span>
               </div>
               <div className={`font-mono font-bold text-lg group-hover:scale-110 transition-transform ${g.score >= 90 ? 'text-white' : g.score >= 70 ? 'text-zinc-400' : 'text-red-600'}`}>
                 {g.score}%
               </div>
            </div>
          ))}
          {grades.length > 5 && (
            <div className="text-center mt-2 text-[10px] text-zinc-700 font-mono uppercase hover:text-red-500 cursor-pointer transition-colors hover:scale-105">
              + {grades.length - 5} archived
            </div>
          )}
        </div>
      )}
    </Card>
  );
};