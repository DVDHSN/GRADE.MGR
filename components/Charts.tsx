import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell, ReferenceLine } from 'recharts';
import { Grade, GradingScale, ExamType, getSubjectCode } from '../types';

// BRUTAL PALETTE
export const COLORS: Record<string, string> = {
  [ExamType.MIDTERM]: '#ef4444', // Red
  [ExamType.FINAL]: '#ccff00',   // Lime
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

// --- CUSTOM SHAPES ---

const SquareDot = (props: any) => {
    const { cx, cy, stroke, strokeWidth, payload } = props;
    return (
        <rect 
            x={cx - 3} 
            y={cy - 3} 
            width={6} 
            height={6} 
            fill="#050505" 
            stroke={stroke} 
            strokeWidth={strokeWidth} 
        />
    );
};

const ActiveSquareDot = (props: any) => {
    const { cx, cy, stroke, strokeWidth } = props;
    return (
        <g>
            <rect 
                x={cx - 5} 
                y={cy - 5} 
                width={10} 
                height={10} 
                fill={stroke} 
                stroke="#fff" 
                strokeWidth={2} 
            />
            <rect 
                x={cx - 8} 
                y={cy - 8} 
                width={16} 
                height={16} 
                fill="none" 
                stroke={stroke} 
                strokeWidth={1}
                strokeDasharray="2 2"
                className="animate-spin-slow origin-center"
            />
        </g>
    );
};

// --- TOOLTIPS ---

const BrutalTooltip = ({ active, payload, label, unit = '' }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] p-0 min-w-[180px] z-50">
        <div className="bg-zinc-900 border-b-2 border-zinc-800 p-2 flex justify-between items-center">
          <span className="text-white text-xs font-bold uppercase font-mono tracking-wider">
            {label || 'DATA'}
          </span>
          <div className="flex gap-1">
             <div className="w-1.5 h-1.5 bg-red-500"></div>
             <div className="w-1.5 h-1.5 bg-zinc-600"></div>
          </div>
        </div>
        <div className="p-3 flex flex-col gap-2">
          {payload.map((entry: any, index: number) => {
            const isTrend = entry.payload.details; 
            const name = isTrend ? entry.name : entry.name;
            const value = entry.value;
            const color = entry.color || entry.stroke || entry.fill;

            return (
              <div key={index} className="flex justify-between items-center gap-4 font-mono">
                <span className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
                   <div className="w-2 h-2" style={{ backgroundColor: color }}></div>
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

const TrendTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const details = payload[0].payload.details as Grade;
    const dateStr = new Date(details.date).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: '2-digit' });
    
    return (
      <div className="bg-black border-2 border-zinc-500 p-0 shadow-[8px_8px_0px_0px_#ccff00] min-w-[200px] z-50 animate-in fade-in zoom-in-95 duration-75">
        <div className="bg-zinc-900 border-b border-zinc-800 p-2 flex justify-between items-center">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{dateStr}</span>
            <span className="text-[10px] font-mono text-black bg-lime-400 px-1 font-bold">LOG_ID: {details.id.slice(0,4)}</span>
        </div>
        <div className="p-4">
            <h4 className="text-white font-black text-lg leading-tight font-mono mb-1">{details.courseName}</h4>
            
            <div className="flex items-end justify-between mt-3 border-t border-zinc-800 pt-3">
               <div className="flex flex-col">
                   <span className="text-[9px] text-zinc-500 font-mono uppercase mb-1">Assessment Type</span>
                   <span className="text-xs font-bold font-mono uppercase" style={{ color: COLORS[details.type] }}>
                     {details.type}
                   </span>
               </div>
               <div className="flex flex-col items-end">
                   <span className="text-[9px] text-zinc-500 font-mono uppercase mb-1">Score</span>
                   <span className="text-3xl font-black text-white font-mono leading-none">{details.score}<span className="text-sm align-top text-zinc-600">%</span></span>
               </div>
            </div>
        </div>
      </div>
    );
  }
  return null;
};

const BrutalLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 pt-2 border-t border-zinc-900/50">
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center gap-2 cursor-default hover:bg-zinc-900 px-2 py-1 transition-colors border border-transparent hover:border-zinc-800">
          <div 
            className="w-2 h-2" 
            style={{ backgroundColor: entry.color }} 
          />
          <span className="text-[10px] uppercase font-bold font-mono tracking-widest text-zinc-400">
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
          innerRadius={60}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
          stroke="none"
          cornerRadius={0}
        >
          {data.map((entry, index) => (
            <Cell 
                key={`cell-${index}`} 
                fill={GRADE_COLORS[entry.name] || '#333'} 
                className="outline-none" 
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
        <CartesianGrid stroke="#222" vertical={false} strokeDasharray="4 4" />
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
        <Tooltip 
            content={<BrutalTooltip />} 
            cursor={{ fill: '#ffffff', opacity: 0.05 }} 
        />
        <Legend content={<BrutalLegend />} />
        {activeTypes.map(type => (
            <Bar 
                key={type} 
                dataKey={type} 
                fill={COLORS[type] || '#fff'} 
                stackId="a"
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

  if (data.length < 3) return <div className="h-64 flex flex-col items-center justify-center text-zinc-600 font-mono text-xs uppercase border-2 border-dashed border-zinc-900"><span>Not Enough Data</span><span className="text-[10px] mt-2">Require 3+ Subjects for Radar</span></div>;

  const showMidterm = grades.some(g => g.type === ExamType.MIDTERM);
  const showFinal = grades.some(g => g.type === ExamType.FINAL);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#333" strokeWidth={1} strokeDasharray="4 4" />
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
                strokeWidth={3} 
                fill={COLORS[ExamType.MIDTERM]} 
                fillOpacity={0.1}
                dot={{ r: 3, fill: '#000', stroke: COLORS[ExamType.MIDTERM], strokeWidth: 2 }}
            />
        )}
        {showFinal && (
            <Radar 
                name="Final" 
                dataKey={ExamType.FINAL} 
                stroke={COLORS[ExamType.FINAL]} 
                strokeWidth={3} 
                fill={COLORS[ExamType.FINAL]} 
                fillOpacity={0.1}
                dot={{ r: 3, fill: '#000', stroke: COLORS[ExamType.FINAL], strokeWidth: 2 }}
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
        <CartesianGrid stroke="#222" vertical={false} strokeDasharray="4 4" />
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
        <Tooltip content={<BrutalTooltip unit="%" />} cursor={{ fill: '#ffffff', opacity: 0.05 }} />
        <Legend content={<BrutalLegend />} />
        {activeTypes.map(type => (
            <Bar 
                key={type} 
                dataKey={type} 
                fill={COLORS[type] || '#fff'} 
                barSize={30}
                animationDuration={1000}
                stroke="#000"
                strokeWidth={2}
            />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export const TrendLine: React.FC<{ grades: Grade[] }> = ({ grades }) => {
    const sorted = [...grades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Map data for timeline
    const data = sorted.map((g, i) => ({
        index: i + 1,
        date: g.date, // Pass full date for tooltip formatting
        displayDate: new Date(g.date).toLocaleDateString(undefined, {month: 'numeric', day: 'numeric'}),
        [g.type]: g.score,
        details: g 
    }));

    const activeTypes = Array.from(new Set(grades.map(g => g.type))) as ExamType[];

    if (grades.length === 0) return <div className="h-full flex items-center justify-center text-zinc-700 font-mono text-xs border-2 border-dashed border-zinc-900">NO_DATA_FOUND</div>;

    return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
        <CartesianGrid stroke="#222" strokeDasharray="4 4" vertical={false} />
        <XAxis 
            dataKey="index" 
            hide
        />
        <YAxis 
            domain={[0, 100]} 
            orientation="right"
            tick={{ fill: '#444', fontSize: 10, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
            width={30}
        />
        <Tooltip content={<TrendTooltip />} cursor={{ stroke: '#fff', strokeWidth: 1, strokeDasharray: '4 4' }} />
        
        {activeTypes.map(type => (
            <Line 
                key={type}
                connectNulls
                type="linear" 
                dataKey={type} 
                stroke={COLORS[type] || '#fff'} 
                strokeWidth={2} 
                dot={<SquareDot />}
                activeDot={<ActiveSquareDot />}
                animationDuration={1500}
                isAnimationActive={true}
            />
        ))}
        <Legend content={<BrutalLegend />} />
      </LineChart>
    </ResponsiveContainer>
    );
};