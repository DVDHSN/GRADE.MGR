import React from 'react';
import { Grade, AppSettings, ExamType, getSubjectCode } from '../types';
import { Card } from './UI';
import { GradeHistogram, SubjectRadar, YearComparison, GradePieChart, COLORS, SubjectTrendChart } from './Charts';

interface AnalyticsProps {
  grades: Grade[];
  settings: AppSettings;
}

export const Analytics: React.FC<AnalyticsProps> = ({ grades, settings }) => {
    // Determine Strongest/Weakest based on overall average
    const subjectStats = grades.reduce((acc, curr) => {
        if (!acc[curr.courseName]) acc[curr.courseName] = { total: 0, count: 0 };
        acc[curr.courseName].total += curr.score;
        acc[curr.courseName].count += 1;
        return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const rankedSubjects = Object.entries(subjectStats)
        .map(([name, stats]: [string, { total: number; count: number }]) => ({ name, avg: Math.round(stats.total / stats.count) }))
        .sort((a, b) => b.avg - a.avg);

    const strongest = rankedSubjects.slice(0, 3);
    const weakest = rankedSubjects.slice(-3).reverse();

    // Prepare detailed subject breakdown (separated by type)
    const subjectDetails = Object.keys(subjectStats).sort().map(subject => {
        const subjectGrades = grades.filter(g => g.courseName === subject);
        const types = Array.from(new Set(subjectGrades.map(g => g.type))) as ExamType[];
        const customCode = subjectGrades[0]?.customCode; // Retrieve custom code if available

        const typeStats = types.map(type => {
            const specificGrades = subjectGrades.filter(g => g.type === type);
            const avg = Math.round(specificGrades.reduce((a, b) => a + b.score, 0) / specificGrades.length);
            return { type, avg };
        });
        return { subject, typeStats, customCode };
    });

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Top Level Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Grade Frequency">
            <GradeHistogram grades={grades} scale={settings.gradingScale} />
        </Card>
        <Card title="Subject Band Distribution">
            <div className="relative h-full min-h-[300px]">
                <GradePieChart grades={grades} scale={settings.gradingScale} />
                <div className="absolute bottom-2 right-2 text-[10px] text-zinc-500 font-mono text-right">
                    Breakdown of total<br/>entries by grade
                </div>
            </div>
        </Card>
      </div>

      {/* Progression & Comparison */}
      <Card title="Subject Performance History" className="col-span-full">
         <div className="mb-4 text-xs text-zinc-500 font-mono">
            Tracking score progression per subject over time. Use the slider below to zoom.
         </div>
         <SubjectTrendChart grades={grades} />
      </Card>

      <div className="grid grid-cols-1 gap-6">
         <Card title="Academic Form Comparison">
            <div className="mb-4 text-xs text-zinc-500 font-mono">
                Compare your academic performance across different Forms (e.g., Form 4 vs Form 5).
            </div>
            <YearComparison grades={grades} />
         </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card title="Skill Radar (Mid vs Final)" className="md:col-span-2">
            <SubjectRadar grades={grades} />
         </Card>
         
         <Card title="Performance Extremes">
            <div className="flex flex-col gap-6 h-full justify-center">
                <div>
                    <h4 className="text-[10px] font-mono uppercase text-emerald-500 mb-2 tracking-widest border-b border-zinc-800 pb-1">Dominating</h4>
                    {strongest.length > 0 ? strongest.map((s, i) => {
                        const repGrade = grades.find(g => g.courseName === s.name);
                        return (
                        <div key={s.name} className="flex justify-between items-center py-2 px-2 hover:bg-emerald-950/20 transition-all duration-300 group cursor-default hover:translate-x-1 border-b border-transparent hover:border-emerald-900/30 border-l-2 border-l-transparent hover:border-l-emerald-500">
                            <span className="font-bold text-zinc-300 text-sm group-hover:text-white transition-colors">
                              {getSubjectCode(s.name, repGrade?.customCode)} 
                              <span className="text-[10px] text-zinc-600 font-normal ml-2 hidden lg:inline group-hover:text-emerald-500/70">{s.name.slice(0,12)}...</span>
                            </span>
                            <span className="font-mono text-emerald-500 font-bold group-hover:scale-110 transition-transform">{s.avg}%</span>
                        </div>
                    )}) : <span className="text-zinc-700 text-xs mt-2 block">N/A</span>}
                </div>
                <div>
                    <h4 className="text-[10px] font-mono uppercase text-red-500 mb-2 tracking-widest border-b border-zinc-800 pb-1">Critical Focus</h4>
                    {weakest.length > 0 ? weakest.map((s, i) => {
                        const repGrade = grades.find(g => g.courseName === s.name);
                        return (
                        <div key={s.name} className="flex justify-between items-center py-2 px-2 hover:bg-red-950/20 transition-all duration-300 group cursor-default hover:translate-x-1 border-b border-transparent hover:border-red-900/30 border-l-2 border-l-transparent hover:border-l-red-500">
                            <span className="font-bold text-zinc-300 text-sm group-hover:text-white transition-colors">
                              {getSubjectCode(s.name, repGrade?.customCode)}
                              <span className="text-[10px] text-zinc-600 font-normal ml-2 hidden lg:inline group-hover:text-red-500/70">{s.name.slice(0,12)}...</span>
                            </span>
                            <span className="font-mono text-red-500 font-bold group-hover:scale-110 transition-transform">{s.avg}%</span>
                        </div>
                    )}) : <span className="text-zinc-700 text-xs mt-2 block">N/A</span>}
                </div>
            </div>
         </Card>
      </div>

      {/* Detailed Subject Breakdown */}
      <Card title="Detailed Subject Breakdown">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectDetails.map(({ subject, typeStats, customCode }) => (
                <div key={subject} className="bg-black border-2 border-zinc-800 p-5 hover:border-white transition-all duration-200 group hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_#222]">
                    <div className="flex justify-between items-baseline mb-3 border-b-2 border-zinc-800 pb-2 group-hover:border-white transition-colors">
                        <div className="flex items-center gap-2">
                           <span className="text-2xl font-black text-white group-hover:text-lime-400 transition-colors">{getSubjectCode(subject, customCode)}</span>
                           <span className="text-[10px] text-zinc-500 font-mono uppercase truncate max-w-[120px] group-hover:text-black group-hover:bg-white px-1 transition-colors">{subject}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {typeStats.map(stat => (
                            <div key={stat.type} className="flex justify-between items-center text-xs">
                                <span className="uppercase font-mono text-zinc-500 flex items-center gap-2">
                                    <span className="w-2 h-2 border border-zinc-600" style={{ backgroundColor: COLORS[stat.type] }}></span>
                                    {stat.type}
                                </span>
                                <span className="font-mono font-bold text-zinc-300 group-hover:text-white transition-colors">{stat.avg}%</span>
                            </div>
                        ))}
                         {typeStats.length === 0 && <span className="text-zinc-700 text-xs">No grades recorded</span>}
                    </div>
                </div>
            ))}
            {subjectDetails.length === 0 && (
                <div className="col-span-full py-8 text-center text-zinc-600 font-mono text-xs uppercase tracking-widest border-2 border-dashed border-zinc-900">
                    No subject data available
                </div>
            )}
        </div>
      </Card>
    </div>
  );
};