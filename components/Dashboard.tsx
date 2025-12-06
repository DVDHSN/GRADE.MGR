import React from 'react';
import { Grade, AppSettings } from '../types';
import { Card } from './UI';
import { TrendLine } from './Charts';
import { RecentGrades } from './RecentGrades';
import { Target, TrendingUp, AlertTriangle, CheckCircle, Activity, Box, Zap, AlertOctagon } from 'lucide-react';

interface DashboardProps {
  grades: Grade[];
  settings: AppSettings;
  onUpdateGrade?: (grade: Grade) => void;
  onDeleteGrade?: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ grades, settings, onUpdateGrade, onDeleteGrade }) => {
  const totalScore = grades.reduce((acc, g) => acc + g.score, 0);
  const averageScore = grades.length > 0 ? Math.round(totalScore / grades.length) : 0;
  
  const isPassing = averageScore >= settings.gradingScale.D;
  const highestScore = grades.length > 0 ? Math.max(...grades.map(g => g.score)) : 0;
  
  // Brutal Insights
  const subjects = Array.from(new Set(grades.map(g => g.courseName))) as string[];
  const dangerThreshold = settings.gradingScale.D + 5;
  const atRiskSubjects = subjects.map(sub => {
    const subGrades = grades.filter(g => g.courseName === sub).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (subGrades.length === 0) return null;
    const last = subGrades[subGrades.length - 1];
    if (last.score < dangerThreshold) return last;
    return null;
  }).filter(Boolean);

  // Brutalist Metric Block with Hover Pop
  const MetricCard = ({ label, value, icon: Icon, color, subtext, hoverColor }: any) => (
    <div className={`bg-black border-2 border-zinc-800 p-4 relative group hover:border-white transition-all duration-200 hover:-translate-y-2 hover:-translate-x-1 ${hoverColor}`}>
        <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
            <Icon size={40} strokeWidth={1} />
        </div>
        <div className="flex flex-col h-full justify-between relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-mono mb-4 block border-b-2 border-zinc-900 pb-2 w-max group-hover:border-black group-hover:text-black group-hover:bg-white px-1 transition-colors duration-200">
                {label}
            </span>
            <div>
                 <span className={`text-5xl font-black tracking-tighter ${color} font-mono block`}>{value}</span>
                 {subtext && <span className="text-[10px] font-mono text-zinc-600 uppercase mt-1 block group-hover:text-zinc-400 transition-colors">{subtext}</span>}
            </div>
        </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="border-b-4 border-white pb-4 mb-4 flex justify-between items-end">
         <div className="flex flex-col">
            <h1 className="text-6xl font-black uppercase tracking-tighter text-white leading-none hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-white hover:to-zinc-500 transition-all duration-500 cursor-default">STATUS</h1>
            <span className="text-xs font-mono text-lime-400 bg-zinc-900 w-max px-2 py-1 mt-2 hover:bg-lime-400 hover:text-black transition-colors cursor-help">SYSTEM_OVERVIEW_V6.1</span>
         </div>
         <div className="hidden md:block text-right">
             <div className="text-[10px] font-mono text-zinc-500">SESSION ID</div>
             <div className="font-mono text-xl text-white group cursor-pointer" title="Copy ID">
                <span className="group-hover:text-lime-400 transition-colors">{crypto.randomUUID().slice(0,8).toUpperCase()}</span>
             </div>
         </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
            label="AVG. PERFORMANCE" 
            value={`${averageScore}%`} 
            icon={Activity} 
            color="text-white"
            subtext={isPassing ? "CONDITION: STABLE" : "CONDITION: CRITICAL"}
            hoverColor="hover:shadow-[8px_8px_0px_0px_#fff]"
        />
        <MetricCard 
            label="DATA POINTS" 
            value={grades.length} 
            icon={Box} 
            color="text-zinc-400 group-hover:text-black"
            subtext="TOTAL ENTRIES"
            hoverColor="hover:shadow-[8px_8px_0px_0px_#ccff00] hover:bg-zinc-900"
        />
        <MetricCard 
            label="PEAK SCORE" 
            value={`${highestScore}%`} 
            icon={Zap} 
            color="text-lime-400 group-hover:text-lime-600"
            subtext="HIGHEST RECORDED"
            hoverColor="hover:shadow-[8px_8px_0px_0px_#ccff00]"
        />
        <MetricCard 
            label="TARGET OBJ." 
            value={`${settings.targetScore}%`} 
            icon={Target} 
            color="text-red-500 group-hover:text-red-600"
            subtext="GOAL THRESHOLD"
            hoverColor="hover:shadow-[8px_8px_0px_0px_#ef4444]"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         <div className="lg:col-span-2 flex flex-col gap-8">
            <Card title="PERFORMANCE_TRENDS // VISUALIZER" className="h-[400px]">
                <TrendLine grades={grades} />
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Risk Box */}
                 <div className="bg-black border-2 border-red-900/50 p-0 relative overflow-hidden group hover:border-red-500 transition-colors duration-300">
                    <div className="bg-red-900/20 p-3 border-b-2 border-red-900/50 flex justify-between items-center group-hover:bg-red-900/40 transition-colors">
                        <span className="text-xs font-bold uppercase text-red-500 font-mono animate-pulse group-hover:text-white">⚠️ AT RISK SUBJECTS</span>
                        <AlertOctagon size={14} className="text-red-500 group-hover:text-white" />
                    </div>
                    <div className="p-4">
                        {atRiskSubjects.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                {atRiskSubjects.map((g: any, i) => (
                                    <div key={i} className="flex justify-between items-center border-b border-red-900/30 pb-2 font-mono text-sm group-hover:border-red-500/30 transition-colors">
                                        <span className="text-white font-bold">{g.courseName}</span>
                                        <span className="text-red-500 bg-red-950/30 px-2 group-hover:bg-red-500 group-hover:text-white transition-colors">{g.score}%</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-zinc-600 text-xs font-mono uppercase py-8 text-center border-2 border-dashed border-zinc-900 group-hover:border-red-900/50 transition-colors">
                                NO SYSTEMS FAILING
                            </div>
                        )}
                    </div>
                 </div>

                 {/* Status Box */}
                 <div className={`bg-black border-2 p-6 flex flex-col justify-center items-center text-center group transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000] ${isPassing ? 'border-lime-900/50 hover:border-lime-500 hover:shadow-lime-900/20' : 'border-red-900/50 hover:border-red-500 hover:shadow-red-900/20'}`}>
                     <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 border px-2 border-zinc-800 group-hover:border-current transition-colors">ACADEMIC STANDING</span>
                     <div className="flex flex-col items-center gap-2 transform group-hover:scale-110 transition-transform duration-300">
                        {isPassing ? <CheckCircle size={48} className="text-lime-500" /> : <AlertTriangle size={48} className="text-red-500" />}
                        <span className={`text-4xl font-black uppercase tracking-tighter ${isPassing ? 'text-white' : 'text-red-500'}`}>
                            {isPassing ? 'OPTIMAL' : 'FAILURE'}
                        </span>
                     </div>
                 </div>
            </div>
         </div>

         <div className="lg:col-span-1">
            <RecentGrades 
              grades={grades} 
              onUpdate={onUpdateGrade}
              onDelete={onDeleteGrade}
            />
         </div>
      </div>
    </div>
  );
};