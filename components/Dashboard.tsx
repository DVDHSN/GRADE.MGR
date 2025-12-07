import React from 'react';
import { Grade, AppSettings } from '../types';
import { Card } from './UI';
import { TrendLine } from './Charts';
import { RecentGrades } from './RecentGrades';
import { Target, TrendingUp, AlertTriangle, CheckCircle, Activity, Box, Zap, AlertOctagon, Cpu, ArrowUpRight } from 'lucide-react';

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
  const MetricCard = ({ label, value, icon: Icon, color, subtext, hoverColor, accentColor }: any) => (
    <div className={`bg-[#18181b] border-4 border-zinc-800 p-6 relative group hover:border-white transition-all duration-200 hover:-translate-y-2 hover:-translate-x-1 ${hoverColor} overflow-hidden`}>
        {/* Animated Background Blob */}
        <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${accentColor}`}></div>
        
        <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-12 group-hover:scale-125 text-zinc-500 group-hover:text-white">
            <Icon size={48} strokeWidth={1.5} />
        </div>
        
        <div className="flex flex-col h-full justify-between relative z-10 gap-6">
            <span className="text-xs font-black uppercase tracking-widest text-zinc-500 font-mono block w-max group-hover:text-black group-hover:bg-white px-2 py-1 transition-all duration-200 border border-transparent group-hover:border-black">
                {label}
            </span>
            <div>
                 <span className={`text-6xl font-black tracking-tighter ${color} font-mono block leading-[0.8]`}>{value}</span>
                 {subtext && (
                    <div className="flex items-center gap-2 mt-2">
                        <div className="h-px bg-zinc-700 w-4 group-hover:w-8 transition-all"></div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold group-hover:text-zinc-300 transition-colors">{subtext}</span>
                    </div>
                 )}
            </div>
        </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500">
      
      {/* Brutal Header Block */}
      <div className="flex flex-col gap-0">
          <div className="border-b-4 border-white pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 relative overflow-hidden bg-black p-6 shadow-[8px_8px_0px_0px_#27272a]">
             {/* Background Pattern */}
             <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%,transparent)] bg-[size:20px_20px]"></div>
             
             <div className="flex flex-col relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest animate-pulse">Live Feed</div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">System Overview V6.2</span>
                </div>
                <h1 className="text-7xl md:text-8xl font-black uppercase tracking-tighter text-white leading-none hover-glitch cursor-default mix-blend-difference">
                    STATUS
                </h1>
             </div>
             
             <div className="hidden md:block text-right relative z-10">
                 <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Session ID</div>
                 <div className="font-mono text-2xl text-white group cursor-pointer bg-zinc-900 border-2 border-zinc-700 px-3 py-1 hover:bg-lime-400 hover:text-black hover:border-black transition-colors shadow-[4px_4px_0px_0px_#000]" title="Copy ID">
                    {crypto.randomUUID().slice(0,8).toUpperCase()}
                 </div>
             </div>
          </div>
          
          {/* Marquee Bar */}
          <div className="bg-lime-400 text-black border-x-4 border-b-4 border-white overflow-hidden py-2 whitespace-nowrap flex select-none relative">
             <div className="animate-marquee inline-block font-mono font-bold uppercase tracking-widest text-sm">
                SYSTEM ONLINE // PERFORMANCE METRICS UPDATED // TRACKING {grades.length} ENTRIES // AVERAGE SCORE: {averageScore}% // TARGET GOAL: {settings.targetScore}% // REMEMBER: CONSISTENCY IS KEY // DO NOT FORGET TO BACKUP DATA // 
             </div>
             <div className="animate-marquee inline-block font-mono font-bold uppercase tracking-widest text-sm" aria-hidden="true">
                SYSTEM ONLINE // PERFORMANCE METRICS UPDATED // TRACKING {grades.length} ENTRIES // AVERAGE SCORE: {averageScore}% // TARGET GOAL: {settings.targetScore}% // REMEMBER: CONSISTENCY IS KEY // DO NOT FORGET TO BACKUP DATA // 
             </div>
          </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
            label="AVG. PERFORMANCE" 
            value={`${averageScore}%`} 
            icon={Activity} 
            color="text-white"
            accentColor="bg-white"
            subtext={isPassing ? "CONDITION: STABLE" : "CONDITION: CRITICAL"}
            hoverColor="hover:shadow-[12px_12px_0px_0px_#fff]"
        />
        <MetricCard 
            label="DATA POINTS" 
            value={grades.length} 
            icon={Box} 
            color="text-zinc-400 group-hover:text-black"
            accentColor="bg-lime-400"
            subtext="TOTAL ENTRIES"
            hoverColor="hover:shadow-[12px_12px_0px_0px_#ccff00] hover:bg-zinc-900"
        />
        <MetricCard 
            label="PEAK SCORE" 
            value={`${highestScore}%`} 
            icon={Zap} 
            color="text-lime-400 group-hover:text-lime-600"
            accentColor="bg-lime-500"
            subtext="HIGHEST RECORDED"
            hoverColor="hover:shadow-[12px_12px_0px_0px_#ccff00]"
        />
        <MetricCard 
            label="TARGET OBJ." 
            value={`${settings.targetScore}%`} 
            icon={Target} 
            color="text-red-500 group-hover:text-red-600"
            accentColor="bg-red-500"
            subtext="GOAL THRESHOLD"
            hoverColor="hover:shadow-[12px_12px_0px_0px_#ef4444]"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         <div className="lg:col-span-2 flex flex-col gap-8">
            <Card title="PERFORMANCE_TRENDS // VISUALIZER" className="h-[450px]">
                <TrendLine grades={grades} />
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Risk Box */}
                 <div className="bg-[#18181b] border-4 border-red-900/50 p-0 relative overflow-hidden group hover:border-red-500 transition-colors duration-300 shadow-[8px_8px_0px_0px_rgba(127,29,29,0.2)] hover:shadow-[10px_10px_0px_0px_#ef4444]">
                    <div className="bg-red-900/10 p-4 border-b-4 border-red-900/50 flex justify-between items-center group-hover:bg-red-600 group-hover:border-red-600 transition-colors duration-300">
                        <span className="text-sm font-black uppercase text-red-500 font-mono animate-pulse group-hover:text-white flex items-center gap-2">
                             <AlertOctagon size={16} /> AT RISK SUBJECTS
                        </span>
                        <div className="w-2 h-2 bg-red-500 rounded-full group-hover:bg-white"></div>
                    </div>
                    <div className="p-6">
                        {atRiskSubjects.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {atRiskSubjects.map((g: any, i) => (
                                    <div key={i} className="flex justify-between items-center border-b-2 border-dashed border-red-900/30 pb-2 font-mono text-sm group-hover:border-red-500/30 transition-colors">
                                        <span className="text-zinc-300 font-bold group-hover:text-white uppercase">{g.courseName}</span>
                                        <span className="text-red-500 bg-red-950/50 px-3 py-1 font-bold group-hover:bg-red-500 group-hover:text-white transition-colors">{g.score}%</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-zinc-800 group-hover:border-red-500/20 transition-colors">
                                <CheckCircle size={32} className="text-zinc-800 mb-2 group-hover:text-red-500" />
                                <span className="text-zinc-600 text-xs font-mono uppercase tracking-widest">
                                    NO SYSTEMS FAILING
                                </span>
                            </div>
                        )}
                    </div>
                 </div>

                 {/* Status Box */}
                 <div className={`bg-[#18181b] border-4 p-8 flex flex-col justify-center items-center text-center group transition-all duration-300 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#000] ${isPassing ? 'border-lime-900/50 hover:border-lime-500 hover:shadow-lime-900/20' : 'border-red-900/50 hover:border-red-500 hover:shadow-red-900/20'}`}>
                     <span className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6 border-2 px-3 py-1 border-zinc-800 group-hover:border-current transition-colors">ACADEMIC STANDING</span>
                     <div className="flex flex-col items-center gap-4 transform group-hover:scale-105 transition-transform duration-300">
                        {isPassing ? (
                            <div className="relative">
                                <Cpu size={64} className="text-lime-500" strokeWidth={1} />
                                <div className="absolute inset-0 bg-lime-400 blur-xl opacity-20"></div>
                            </div>
                        ) : (
                            <div className="relative">
                                <AlertTriangle size={64} className="text-red-500" strokeWidth={1} />
                                <div className="absolute inset-0 bg-red-500 blur-xl opacity-20"></div>
                            </div>
                        )}
                        <span className={`text-4xl lg:text-5xl font-black uppercase tracking-tighter ${isPassing ? 'text-white' : 'text-red-500'}`}>
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