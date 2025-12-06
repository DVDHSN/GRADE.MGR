import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell, ReferenceLine } from 'recharts';
import { Grade, GradingScale, ExamType, getSubjectCode } from '../types';

// BRUTAL PALETTE
// High contrast, neon, primary
export const COLORS: Record<string, string> = {
  [ExamType.MIDTERM]: '#ef4444', // Bright Red
  [ExamType.FINAL]: '#ccff00',   // Neon Lime
  [ExamType.QUIZ]: '#06b6d4',    // Cyan
  [ExamType.ASSIGNMENT]: '#d946ef', // Magenta
  [ExamType.PROJECT]: '#f59e0b', // Amber
};

export const GRADE_COLORS: Record<string, string> = {
  'A': '#ccff00', // Lime
  'B': '#06b6d4', // Cyan
  'C': '#f59e0b', // Amber
  'D': '#ef4444', // Red
  'F': '#3f3f46', // Zinc-700
};

// --- HELPER COMPONENTS ---

const BrutalTooltip = ({ active, payload, label, unit = '' }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border-2 border-white shadow-[6px_6px_0px_0px_#000] p-3 min-w-[160px] z-50">
        <div className="border-b-2 border-zinc-800 pb-2 mb-2 flex justify-between items-center">
          <p className="text-white text-xs font-bold uppercase font-mono">
            [{label || 'DATA'}]
          </p>
          <div className="w-2 h-2 bg-red-500 animate-pulse"></div>
        </div>
        <div className="flex flex-col gap-2">
          {payload.map((entry: any, index: number) => {
            const isTrend = entry.payload.details; 
            const name = isTrend ? entry.name : entry.name;
            const value = entry.value;
            const color = entry.color || entry.stroke || entry.fill;

            return (
              <div key={index} className="flex justify-between items-center gap-4 font-mono">
                <span className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
                   <div className="w-3 h-3 border border-zinc-600" style={{ backgroundColor: color }}></div>
                   {name}
                </span>
                <span className="text-sm font-black text-white tabular-nums">
                  {value}{unit}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

const BrutalLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 border-t-2 border-zinc-900 pt-4">
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center gap-2 cursor-default hover:bg-white hover:text-black px-2 py-1 transition-colors">
          <div 
            className="w-3 h-3 border border-current" 
            style={{ backgroundColor: entry.color }} 
          />
          <span className="text-[10px] uppercase font-bold font-mono tracking-widest">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// --- CHARTS ---

const getLetter = (score: number, scale: GradingScale): string => {
  if (score >= scale.A) return 'A';
  if (score >= scale.B) return 'B';
  if (score >= scale.C) return 'C';
  if (score >= scale.D) return 'D';
  return 'F';
};

export const GradePieChart: React.FC<{ grades: Grade[]; scale: GradingScale }> = ({ grades, scale }) => {
  const gradeCounts = grades.reduce((acc, curr) => {
    const letter = getLetter(curr.score, scale);
    acc[letter] = (acc[letter] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const order = ['A', 'B', 'C', 'D', 'F'];
  const data = order
    .filter(key => gradeCounts[key])
    .map(name => ({ name, value: gradeCounts[name] }));

  if (data.length === 0) return <div className="h-64 flex items-center justify-center text-zinc-700 font-mono text-xs border-2 border-dashed border-zinc-900">NO_DATA_FOUND</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell 
                key={`cell-${index}`} 
                fill={GRADE_COLORS[entry.name] || '#333'} 
                className="outline-none stroke-black stroke-2" 
            />
          ))}
        </Pie>
        <Tooltip content={<BrutalTooltip />} />
        <Legend content={<BrutalLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const GradeHistogram: React.FC<{ grades: Grade[]; scale: GradingScale }> = ({ grades, scale }) => {
  const dataMap: Record<string, Record<string, number>> = { 'A': {}, 'B': {}, 'C': {}, 'D': {}, 'F': {} };

  grades.forEach(g => {
    const letter = getLetter(g.score, scale);
    if (!dataMap[letter]) dataMap[letter] = {};
    if (!dataMap[letter][g.type]) dataMap[letter][g.type] = 0;
    dataMap[letter][g.type]++;
  });

  const data = Object.keys(dataMap).map(letter => ({ name: letter, ...dataMap[letter] }));
  const activeTypes = Array.from(new Set(grades.map(g => g.type))) as ExamType[];

  if (grades.length === 0) return <div className="h-64 flex items-center justify-center text-zinc-700 font-mono text-xs border-2 border-dashed border-zinc-900">NO_DATA_FOUND</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
        <CartesianGrid stroke="#222" vertical={false} strokeDasharray="0 0" />
        <XAxis 
            dataKey="name" 
            stroke="#555" 
            tick={{ fill: '#fff', fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace' }} 
            axisLine={{ stroke: '#fff', strokeWidth: 2 }} 
            tickLine={false} 
            dy={10}
        />
        <YAxis 
            stroke="#555" 
            tick={{ fill: '#777', fontSize: 10, fontFamily: 'monospace' }} 
            axisLine={false} 
            tickLine={false}
            allowDecimals={false}
        />
        <Tooltip content={<BrutalTooltip />} cursor={{ fill: '#333', opacity: 0.5 }} />
        <Legend content={<BrutalLegend />} />
        {activeTypes.map(type => (
            <Bar 
                key={type} 
                dataKey={type} 
                fill={COLORS[type] || '#fff'} 
                stackId="a"
                barSize={50}
                animationDuration={1000}
                stroke="#000"
                strokeWidth={2}
            />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SubjectRadar: React.FC<{ grades: Grade[] }> = ({ grades }) => {
  const subjectStats = grades.reduce((acc: Record<string, Record<string, { total: number, count: number }>>, curr) => {
    if (!acc[curr.courseName]) acc[curr.courseName] = {};
    if (!acc[curr.courseName][curr.type]) acc[curr.courseName][curr.type] = { total: 0, count: 0 };
    acc[curr.courseName][curr.type].total += curr.score;
    acc[curr.courseName][curr.type].count += 1;
    return acc;
  }, {});

  const data = Object.entries(subjectStats).map(([subject, types]) => {
    const repGrade = grades.find(g => g.courseName === subject);
    const item: any = { subject: getSubjectCode(subject, repGrade?.customCode), fullSubject: subject, fullMark: 100 };
    Object.entries(types).forEach(([type, stats]) => {
        item[type] = Math.round(stats.total / stats.count);
    });
    return item;
  });

  if (data.length < 3) return <div className="h-64 flex items-center justify-center text-zinc-600 font-mono text-xs uppercase border-2 border-dashed border-zinc-900">Need 3+ Subjects</div>;

  const showMidterm = grades.some(g => g.type === ExamType.MIDTERM);
  const showFinal = grades.some(g => g.type === ExamType.FINAL);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#333" strokeWidth={2} />
        <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#fff', fontSize: 10, fontWeight: 'bold', fontFamily: 'monospace' }} 
        />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Tooltip content={<BrutalTooltip unit="%" />} />
        <Legend content={<BrutalLegend />} />
        
        {showMidterm && (
            <Radar 
                name="Midterm" 
                dataKey={ExamType.MIDTERM} 
                stroke={COLORS[ExamType.MIDTERM]} 
                strokeWidth={2} 
                fill={COLORS[ExamType.MIDTERM]} 
                fillOpacity={0.4} 
            />
        )}
        {showFinal && (
            <Radar 
                name="Final" 
                dataKey={ExamType.FINAL} 
                stroke={COLORS[ExamType.FINAL]} 
                strokeWidth={2} 
                fill={COLORS[ExamType.FINAL]} 
                fillOpacity={0.4} 
            />
        )}
      </RadarChart>
    </ResponsiveContainer>
  );
};

export const YearComparison: React.FC<{ grades: Grade[] }> = ({ grades }) => {
  const yearData = grades.reduce((acc: Record<string, Record<string, { total: number, count: number }>>, curr) => {
    const yearKey = curr.year || 'Unknown';
    if (!acc[yearKey]) acc[yearKey] = {};
    if (!acc[yearKey][curr.type]) acc[yearKey][curr.type] = { total: 0, count: 0 };
    acc[yearKey][curr.type].total += curr.score;
    acc[yearKey][curr.type].count += 1;
    return acc;
  }, {});

  const data = Object.entries(yearData).map(([year, types]) => {
    const item: any = { name: year };
    Object.entries(types).forEach(([type, stats]) => {
        item[type] = Math.round(stats.total / stats.count);
    });
    return item;
  }).sort((a, b) => a.name.localeCompare(b.name));

  const activeTypes = Array.from(new Set(grades.map(g => g.type))) as ExamType[];

  if (grades.length === 0) return <div className="h-64 flex items-center justify-center text-zinc-700 font-mono text-xs border-2 border-dashed border-zinc-900">NO_DATA_FOUND</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
        <CartesianGrid stroke="#222" vertical={false} strokeDasharray="0 0" />
        <XAxis 
            dataKey="name" 
            stroke="#555" 
            tick={{ fill: '#fff', fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace' }} 
            axisLine={{ stroke: '#fff', strokeWidth: 2 }}
            tickLine={false} 
            dy={10}
        />
        <YAxis 
            stroke="#555" 
            tick={{ fill: '#777', fontSize: 10, fontFamily: 'monospace' }} 
            axisLine={false} 
            tickLine={false} 
            domain={[0, 100]}
        />
        <Tooltip content={<BrutalTooltip unit="%" />} cursor={{ fill: '#333', opacity: 0.5 }} />
        <Legend content={<BrutalLegend />} />
        {activeTypes.map(type => (
            <Bar 
                key={type} 
                dataKey={type} 
                fill={COLORS[type] || '#fff'} 
                barSize={40}
                animationDuration={1000}
                stroke="#000"
                strokeWidth={2}
            />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

const TrendTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const details = payload[0].payload.details as Grade;
    return (
      <div className="bg-black border-2 border-white p-4 shadow-[6px_6px_0px_0px_#fff] min-w-[180px] z-50">
        <div className="mb-2 border-b-2 border-white pb-2">
            <h4 className="text-white font-bold text-sm leading-tight font-mono">{details.courseName}</h4>
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{new Date(details.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center justify-between">
           <span className="text-xs font-mono uppercase flex items-center gap-2" style={{ color: COLORS[details.type] }}>
             [{details.type}]
           </span>
           <span className="text-xl font-black text-white font-mono">{details.score}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export const TrendLine: React.FC<{ grades: Grade[] }> = ({ grades }) => {
    const sorted = [...grades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Map data for timeline
    const data = sorted.map((g, i) => ({
        index: i + 1,
        date: new Date(g.date).toLocaleDateString(),
        [g.type]: g.score,
        details: g 
    }));

    const activeTypes = Array.from(new Set(grades.map(g => g.type))) as ExamType[];

    if (grades.length === 0) return <div className="h-full flex items-center justify-center text-zinc-700 font-mono text-xs border-2 border-dashed border-zinc-900">NO_DATA_FOUND</div>;

    return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="#222" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="index" hide />
        <YAxis domain={[0, 100]} hide />
        <Tooltip content={<TrendTooltip />} />
        
        {activeTypes.map(type => (
            <Line 
                key={type}
                connectNulls
                type="linear" 
                dataKey={type} 
                stroke={COLORS[type] || '#fff'} 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#000', stroke: COLORS[type] || '#fff', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#fff', stroke: COLORS[type], strokeWidth: 0 }}
                animationDuration={1500}
            />
        ))}
      </LineChart>
    </ResponsiveContainer>
    );
};