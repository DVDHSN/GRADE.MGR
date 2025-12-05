import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { Grade, GradingScale, ExamType, getSubjectCode } from '../types';

const BRUTAL_BG = '#09090b';
const BRUTAL_BORDER = '#27272a';

// Colors for distinct exam types
export const COLORS: Record<string, string> = {
  [ExamType.MIDTERM]: '#ef4444', // Red
  [ExamType.FINAL]: '#ffffff', // White
  [ExamType.QUIZ]: '#fbbf24', // Amber
  [ExamType.ASSIGNMENT]: '#3b82f6', // Blue
  [ExamType.PROJECT]: '#a855f7', // Purple
};

// Colors for Grades
export const GRADE_COLORS: Record<string, string> = {
  'A': '#10b981', // Emerald
  'B': '#3b82f6', // Blue
  'C': '#fbbf24', // Amber
  'D': '#f97316', // Orange
  'F': '#ef4444', // Red
};

// Helper to determine grade letter
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

  const data = Object.entries(gradeCounts).map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={GRADE_COLORS[entry.name] || '#888'} stroke="none" />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: BRUTAL_BG, border: `1px solid ${BRUTAL_BORDER}`, color: '#fff' }} itemStyle={{color: '#fff'}} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const GradeHistogram: React.FC<{ grades: Grade[]; scale: GradingScale }> = ({ grades, scale }) => {
  // Structure: { 'A': { Midterm: 2, Final: 1 }, 'B': { ... } }
  const dataMap: Record<string, Record<string, number>> = {
      'A': {}, 'B': {}, 'C': {}, 'D': {}, 'F': {}
  };

  grades.forEach(g => {
    const letter = getLetter(g.score, scale);
    if (!dataMap[letter]) dataMap[letter] = {};
    if (!dataMap[letter][g.type]) dataMap[letter][g.type] = 0;
    dataMap[letter][g.type]++;
  });

  const data = Object.keys(dataMap).map(letter => ({
    name: letter,
    ...dataMap[letter]
  }));

  const activeTypes = Array.from(new Set(grades.map(g => g.type))) as ExamType[];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#52525b" tick={{ fill: '#fff', fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
        <Tooltip cursor={{fill: '#27272a', opacity: 0.4}} contentStyle={{ backgroundColor: BRUTAL_BG, border: `1px solid ${BRUTAL_BORDER}`, color: '#fff' }} />
        <Legend />
        {activeTypes.map(type => (
            <Bar key={type} dataKey={type} fill={COLORS[type] || '#888'} radius={[2, 2, 0, 0]} animationDuration={800} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SubjectRadar: React.FC<{ grades: Grade[] }> = ({ grades }) => {
  // Calculate average per subject per type
  const subjectStats = grades.reduce((acc: Record<string, Record<string, { total: number, count: number }>>, curr) => {
    if (!acc[curr.courseName]) acc[curr.courseName] = {};
    if (!acc[curr.courseName][curr.type]) acc[curr.courseName][curr.type] = { total: 0, count: 0 };
    
    acc[curr.courseName][curr.type].total += curr.score;
    acc[curr.courseName][curr.type].count += 1;
    return acc;
  }, {});

  const data = Object.entries(subjectStats).map(([subject, types]) => {
    // Find a representative grade to get the custom code if it exists
    const repGrade = grades.find(g => g.courseName === subject);
    const item: any = { subject: getSubjectCode(subject, repGrade?.customCode), fullSubject: subject, fullMark: 100 };
    Object.entries(types).forEach(([type, stats]) => {
        item[type] = Math.round(stats.total / stats.count);
    });
    return item;
  });

  if (data.length < 3) return <div className="h-64 flex items-center justify-center text-zinc-600 font-mono text-xs uppercase">Need 3+ Subjects</div>;

  // We only show Midterm and Final on Radar to prevent chaos
  const showMidterm = grades.some(g => g.type === ExamType.MIDTERM);
  const showFinal = grades.some(g => g.type === ExamType.FINAL);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="#3f3f46" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'monospace', fontWeight: 'bold' }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Tooltip contentStyle={{ backgroundColor: BRUTAL_BG, border: `1px solid ${BRUTAL_BORDER}`, color: '#fff' }} />
        <Legend />
        {showMidterm && <Radar name="Midterm" dataKey={ExamType.MIDTERM} stroke={COLORS[ExamType.MIDTERM]} strokeWidth={2} fill={COLORS[ExamType.MIDTERM]} fillOpacity={0.1} />}
        {showFinal && <Radar name="Final" dataKey={ExamType.FINAL} stroke={COLORS[ExamType.FINAL]} strokeWidth={2} fill={COLORS[ExamType.FINAL]} fillOpacity={0.1} />}
      </RadarChart>
    </ResponsiveContainer>
  );
};

export const YearComparison: React.FC<{ grades: Grade[] }> = ({ grades }) => {
  // Group by Year, then by Type
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

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#52525b" tick={{ fill: '#fff' }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: BRUTAL_BG, border: `1px solid ${BRUTAL_BORDER}`, color: '#fff' }} />
        <Legend />
        {activeTypes.map(type => (
            <Bar key={type} dataKey={type} fill={COLORS[type] || '#888'} radius={[2, 2, 0, 0]} barSize={20} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Find the payload that has a value
    const p = payload.find((item: any) => item.value !== undefined);
    if (!p) return null;
    
    const details = p.payload.details as Grade;

    return (
      <div className="bg-zinc-950 border border-zinc-800 p-3 shadow-xl backdrop-blur-md">
        <p className="font-bold text-white text-sm mb-1">{details.courseName} <span className="text-zinc-500">({getSubjectCode(details.courseName, details.customCode)})</span></p>
        <div className="flex items-center justify-between gap-4 mb-2">
           <span className="text-[10px] font-mono text-zinc-500 uppercase">{new Date(details.date).toLocaleDateString()}</span>
           <span className="text-[10px] font-mono uppercase" style={{ color: COLORS[details.type] }}>{details.type}</span>
        </div>
        <p className="font-mono text-xl font-black text-white">{details.score}%</p>
      </div>
    );
  }
  return null;
};

export const TrendLine: React.FC<{ grades: Grade[] }> = ({ grades }) => {
    // We need to pivot data: { date: '...', Midterm: 80, Final: null }
    // Sort by date
    const sorted = [...grades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // To make a readable trend line, we plot chronologically
    const data = sorted.map((g, i) => ({
        index: i + 1,
        date: new Date(g.date).toLocaleDateString(),
        [g.type]: g.score,
        details: g // Attach full object for custom tooltip
    }));

    const activeTypes = Array.from(new Set(grades.map(g => g.type))) as ExamType[];

    if (grades.length === 0) return <div className="h-full flex items-center justify-center text-zinc-700 font-mono text-xs">NO DATA</div>;

    return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        <XAxis dataKey="index" hide />
        <YAxis stroke="#52525b" domain={[0, 100]} hide />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {activeTypes.map(type => (
            <Line 
                key={type}
                connectNulls // Connect points even if there are gaps
                type="monotone" 
                dataKey={type} 
                stroke={COLORS[type] || '#888'} 
                strokeWidth={3} 
                dot={{ r: 4, fill: COLORS[type] || '#888', strokeWidth: 0 }}
                activeDot={{ r: 8, fill: '#fff', stroke: COLORS[type], strokeWidth: 2 }}
                animationDuration={1500}
            />
        ))}
      </LineChart>
    </ResponsiveContainer>
    );
};