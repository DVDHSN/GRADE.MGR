import React, { useRef } from 'react';
import { Grade, AppSettings, GradingScale } from '../types';
import { Card, Input, Button } from './UI';
import { Settings, Activity, Target, Download, Upload, Trash2, Database } from 'lucide-react';

interface ToolsProps {
  grades: Grade[];
  settings: AppSettings;
  onUpdateSettings: (s: AppSettings) => void;
  onImportData: (grades: Grade[]) => void;
  onClearData: () => void;
}

export const Tools: React.FC<ToolsProps> = ({ grades, settings, onUpdateSettings, onImportData, onClearData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Consistency Calculation (Standard Deviation)
  const calculateConsistency = () => {
    if (grades.length < 2) return { val: 0, text: 'N/A', color: 'text-zinc-500' };
    
    const avg = grades.reduce((a, b) => a + b.score, 0) / grades.length;
    const squareDiffs = grades.map(g => Math.pow(g.score - avg, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    const stdDev = Math.sqrt(avgSquareDiff);

    // Lower SD = More Consistent
    if (stdDev < 5) return { val: stdDev.toFixed(1), text: 'ROBOTIC', color: 'text-emerald-500' };
    if (stdDev < 10) return { val: stdDev.toFixed(1), text: 'STABLE', color: 'text-blue-500' };
    if (stdDev < 15) return { val: stdDev.toFixed(1), text: 'VOLATILE', color: 'text-yellow-500' };
    return { val: stdDev.toFixed(1), text: 'CHAOTIC', color: 'text-red-500' };
  };

  const consistency = calculateConsistency();

  const handleScaleChange = (key: keyof GradingScale, value: string) => {
    onUpdateSettings({
        ...settings,
        gradingScale: {
            ...settings.gradingScale,
            [key]: Number(value)
        }
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(grades, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `grademgr_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const parsed = JSON.parse(result);
        if (Array.isArray(parsed)) {
            // Basic validation: check if items look like grades
            if(parsed.length === 0 || (parsed[0].courseName && parsed[0].score !== undefined)) {
                 if(confirm(`Import ${parsed.length} records? This will append to your current data.`)) {
                     onImportData(parsed);
                 }
            } else {
                alert("Invalid file structure.");
            }
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Consistency Meter */}
      <Card title="Performance Consistency">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Activity size={48} className={consistency.color} />
                <div className="flex flex-col">
                    <span className={`text-4xl font-black italic tracking-tighter ${consistency.color}`}>{consistency.text}</span>
                    <span className="text-zinc-500 font-mono text-xs">Standard Deviation: {consistency.val}</span>
                </div>
            </div>
            <div className="text-right max-w-xs text-zinc-600 text-xs font-mono hidden md:block">
                Measures the volatility of your grading history. Lower deviation implies consistent performance.
            </div>
        </div>
      </Card>

      {/* Grading Schema Settings */}
      <Card title="System Configuration">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-2">
                    <Settings size={18} className="text-red-500" />
                    <h3 className="font-bold text-white uppercase">Grading Thresholds (Min %)</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <Input 
                        label="Min for A" 
                        type="number" 
                        value={settings.gradingScale.A} 
                        onChange={(e) => handleScaleChange('A', e.target.value)}
                    />
                    <Input 
                        label="Min for B" 
                        type="number" 
                        value={settings.gradingScale.B} 
                        onChange={(e) => handleScaleChange('B', e.target.value)}
                    />
                    <Input 
                        label="Min for C" 
                        type="number" 
                        value={settings.gradingScale.C} 
                        onChange={(e) => handleScaleChange('C', e.target.value)}
                    />
                    <Input 
                        label="Min for D (Pass)" 
                        type="number" 
                        value={settings.gradingScale.D} 
                        onChange={(e) => handleScaleChange('D', e.target.value)}
                    />
                </div>
                <p className="text-zinc-500 text-[10px] font-mono mt-2">* Scores below D are automatically classified as F (Fail).</p>
            </div>

            <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-2 mb-2">
                    <Target size={18} className="text-red-500" />
                    <h3 className="font-bold text-white uppercase">Objectives</h3>
                </div>
                <Input 
                    label="Target Grade Goal (%)" 
                    type="number" 
                    value={settings.targetScore} 
                    onChange={(e) => onUpdateSettings({...settings, targetScore: Number(e.target.value)})}
                />
                <div className="p-4 border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs font-mono">
                    Adjusting these values will instantly update all analytics and dashboards across the system.
                </div>
            </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card title="Data Management">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={handleExport}>
                <Download size={16} /> Backup Data (JSON)
            </Button>
            
            <div className="relative">
                <input 
                    type="file" 
                    accept=".json" 
                    onChange={handleImport} 
                    ref={fileInputRef}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="w-full">
                    <Upload size={16} /> Restore Backup
                </Button>
            </div>

            <Button variant="danger" onClick={onClearData}>
                <Trash2 size={16} /> Factory Reset
            </Button>
        </div>
        <p className="text-zinc-500 text-[10px] font-mono text-center mt-2">
            <Database size={10} className="inline mr-1" />
            Data is stored locally in your browser. Perform regular backups to avoid data loss.
        </p>
      </Card>
    </div>
  );
};