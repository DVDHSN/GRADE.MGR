import React from 'react';
import { Grade, AppSettings, getSubjectCode } from '../types';
import { Card } from './UI';
import { TrendLine } from './Charts';
import { RecentGrades } from './RecentGrades';
import { Target, TrendingUp, AlertTriangle, CheckCircle, Flame, AlertOctagon } from 'lucide-react';

interface DashboardProps {
  grades: Grade[];
  settings: AppSettings;
}

export const Dashboard: React.FC<DashboardProps> = ({ grades, settings }) => {
  const totalScore = grades.reduce((acc, g) => acc + g.score, 0);
  const averageScore = grades.length > 0 ? Math.round(totalScore / grades.length) : 0;
  
  // Pass/Fail based on Avg vs D
  const isPassing = averageScore >= settings.gradingScale.D;
  const progressToGoal = Math.min(100, Math.max(0, (averageScore / settings.targetScore) * 100));

  // --- Insights Logic ---
  
  // 1. Improvements: Check subjects where most recent grade > previous grade
  const subjects = Array.from(new Set(grades.map(g => g.courseName))) as string[];
  let improvedCount = 0;
  let improvedSubjects: string[] = [];

  subjects.forEach(sub => {
    const subGrades = grades.filter(g => g.courseName === sub).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (subGrades.length >= 2) {
      const last = subGrades[subGrades.length - 1];
      const prev = subGrades[subGrades.length - 2];
      if (last.score > prev.score) {
        improvedCount++;
        improvedSubjects.push(getSubjectCode(sub, last.customCode));
      }
    }
  });

  // 2. Danger Zone: Subjects with latest grade < (D + 5)
  const dangerThreshold = settings.gradingScale.D + 5;
  const failThreshold = settings.gradingScale.D;
  
  const atRiskSubjects = subjects.map(sub => {
    const subGrades = grades.filter(g => g.courseName === sub).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (subGrades.length === 0) return null;
    const last = subGrades[subGrades.length - 1];
    
    if (last.score < dangerThreshold) {
      return { 
        code: getSubjectCode(sub, last.customCode), 
        score: last.score,
        isFailing: last.score < failThreshold 
      };
    }
    return null;
  }).filter(Boolean) as { code: string; score: number; isFailing: boolean }[];


  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Goal Tracker */}
        <Card className="relative overflow-hidden group">
            <div className="flex justify-between items-start z-10 relative">
                <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest group-hover:text-zinc-300 transition-colors">Target Goal</span>
                <Target size={16} className="text-red-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-end gap-2 mt-2 z-10 relative">
                <span className="text-4xl font-black text-white">{averageScore}%</span>
                <span className="text-zinc-500 font-mono text-sm mb-1">/ {settings.targetScore}%</span>
            </div>
            <div className="w-full bg-zinc-900 h-2 mt-4 z-10 relative overflow-hidden rounded-full">
                <div 
                    className={`h-full transition-all duration-1000 ${averageScore >= settings.targetScore ? 'bg-emerald-500' : 'bg-red-600'}`} 
                    style={{ width: `${progressToGoal}%`}}
                />
            </div>
        </Card>

        {/* Pass/Fail Indicator */}
        <Card className={`flex flex-col justify-center items-center group transition-colors duration-500 ${isPassing ? 'hover:bg-emerald-950/20 hover:border-emerald-900/50' : 'hover:bg-red-950/20 hover:border-red-900/50'}`}>
             <div className="flex flex-col items-center gap-2 group-hover:-translate-y-1 transition-transform duration-300">
                {isPassing ? <CheckCircle size={32} className="text-emerald-500" /> : <AlertTriangle size={32} className="text-red-500" />}
                <span className={`text-4xl font-black uppercase tracking-tighter ${isPassing ? 'text-emerald-500' : 'text-red-600'}`}>
                    {isPassing ? 'PASSING' : 'FAILING'}
                </span>
                <span className="text-zinc-600 font-mono text-[10px] uppercase">
                    Threshold: {settings.gradingScale.D}%
                </span>
             </div>
        </Card>

        {/* Quick Trend */}
        <Card className="relative group">
            <div className="flex justify-between items-start mb-2">
                 <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest group-hover:text-zinc-300 transition-colors">Velocity & Trend</span>
                 <TrendingUp size={16} className="text-zinc-500 group-hover:text-red-500 transition-colors group-hover:scale-110" />
            </div>
            <TrendLine grades={grades} />
        </Card>
      </div>

      {/* Smart Alerts & Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Motivational Insights" className="border-l-4 border-l-emerald-600">
              {improvedCount > 0 ? (
                  <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-950/30 rounded-full border border-emerald-900/50">
                          <Flame className="text-emerald-500" size={24} />
                      </div>
                      <div>
                          <h4 className="text-lg font-bold text-white mb-1">On Fire!</h4>
                          <p className="text-zinc-400 text-sm">
                              You improved in <strong className="text-white">{improvedCount}</strong> subjects since your last entry.
                              {improvedSubjects.length > 0 && (
                                  <span className="block mt-2 text-xs font-mono text-emerald-500 uppercase">
                                      {improvedSubjects.slice(0, 3).join(', ')}{improvedSubjects.length > 3 ? '...' : ''}
                                  </span>
                              )}
                          </p>
                      </div>
                  </div>
              ) : (
                  <div className="flex items-center gap-4 opacity-50">
                      <TrendingUp size={24} />
                      <p className="text-zinc-500 text-sm">Keep pushing! Consistent effort leads to results.</p>
                  </div>
              )}
          </Card>

          <Card title="Risk Radar" className={`border-l-4 ${atRiskSubjects.length > 0 ? 'border-l-red-600' : 'border-l-zinc-800'}`}>
              {atRiskSubjects.length > 0 ? (
                  <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 mb-2">
                          <AlertOctagon className="text-red-500" size={20} />
                          <span className="text-white font-bold text-sm">Attention Required</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                          {atRiskSubjects.map((sub, i) => (
                              <div key={i} className={`px-3 py-1 rounded border text-xs font-mono font-bold flex items-center gap-2 ${sub.isFailing ? 'bg-red-950/50 border-red-900 text-red-500' : 'bg-orange-950/30 border-orange-900/50 text-orange-400'}`}>
                                  {sub.code}
                                  <span className="opacity-80">| {sub.score}%</span>
                              </div>
                          ))}
                      </div>
                  </div>
              ) : (
                  <div className="flex items-center gap-4">
                      <CheckCircle className="text-emerald-500" size={24} />
                      <p className="text-zinc-400 text-sm">All subjects are performing within safe thresholds.</p>
                  </div>
              )}
          </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
         <div className="lg:col-span-2">
            <RecentGrades grades={grades} />
         </div>
         <div className="lg:col-span-1 flex flex-col gap-6">
            <Card title="Status" className="flex-1 flex items-center justify-center bg-red-950/10 border-red-900/20 hover:bg-red-950/20 hover:border-red-900/40">
                 <div className="text-center group-hover:scale-110 transition-transform duration-500">
                    <p className="text-zinc-500 font-mono text-xs mb-2">CURRENT STANDING</p>
                    <h1 className="text-8xl font-black text-red-600 leading-none drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                        {averageScore >= settings.gradingScale.A ? 'A' :
                         averageScore >= settings.gradingScale.B ? 'B' :
                         averageScore >= settings.gradingScale.C ? 'C' :
                         averageScore >= settings.gradingScale.D ? 'D' : 'F'}
                    </h1>
                 </div>
            </Card>
         </div>
      </div>
    </div>
  );
};