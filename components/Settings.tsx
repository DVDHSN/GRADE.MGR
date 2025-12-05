import React, { useRef } from 'react';
import { Grade, AppSettings, GradingScale } from '../types';
import { Card, Input, Button } from './UI';
import { Settings as SettingsIcon, Target, Download, Upload, Trash2, Database, FileJson, FileSpreadsheet } from 'lucide-react';

interface SettingsProps {
  grades: Grade[];
  settings: AppSettings;
  onUpdateSettings: (s: AppSettings) => void;
  onImportData: (grades: Grade[]) => void;
  onClearData: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ grades, settings, onUpdateSettings, onImportData, onClearData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScaleChange = (key: keyof GradingScale, value: string) => {
    onUpdateSettings({
        ...settings,
        gradingScale: {
            ...settings.gradingScale,
            [key]: Number(value)
        }
    });
  };

  const handleExportJSON = () => {
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

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Subject,Code,Type,Score,Year,Date\n"
      + grades.map(g => `${g.courseName},${g.customCode || ''},${g.type},${g.score},${g.year},${g.date}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "grademgr_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
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
            // Robust filtering for valid grades
            const validGrades = parsed.filter((g: any) => g.courseName && typeof g.score === 'number');
            
            if (validGrades.length > 0) {
                 // Direct import if valid data found, avoiding 'confirm' blocking issues
                 onImportData(validGrades);
            } else {
                alert("File loaded, but no valid grade records were found.");
            }
        } else {
            alert("Invalid file format: Expected a JSON array.");
        }
      } catch (err) {
        console.error("Import Error:", err);
        alert("Failed to parse JSON file. Please ensure it is a valid backup.");
      }
      
      // Reset input to allow re-uploading same file if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      
      <div className="flex flex-col gap-2 mb-4">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">System Settings</h2>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Configuration & Data Control</p>
      </div>

      {/* Grading Schema Settings */}
      <Card title="Grading Configuration">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-2">
                    <SettingsIcon size={18} className="text-red-500" />
                    <h3 className="font-bold text-white uppercase">Grade Thresholds (Min %)</h3>
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
            </div>

            <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-2 mb-2">
                    <Target size={18} className="text-red-500" />
                    <h3 className="font-bold text-white uppercase">Objectives</h3>
                </div>
                <Input 
                    label="Target GPA / Avg Score" 
                    type="number" 
                    value={settings.targetScore} 
                    onChange={(e) => onUpdateSettings({...settings, targetScore: Number(e.target.value)})}
                />
                <div className="p-4 border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs font-mono">
                    Changes apply immediately to all analytics.
                </div>
            </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card title="Data Management">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" onClick={handleExportJSON} type="button">
                <FileJson size={16} /> Backup JSON
            </Button>
            
            <Button variant="outline" onClick={handleExportCSV} type="button">
                <FileSpreadsheet size={16} /> Export CSV
            </Button>
            
            <div>
                <input 
                    type="file" 
                    accept=".json" 
                    onChange={handleImport} 
                    ref={fileInputRef}
                    style={{ display: 'none' }} 
                />
                <Button variant="outline" className="w-full" onClick={handleTriggerUpload} type="button">
                    <Upload size={16} /> Restore JSON
                </Button>
            </div>

            <Button variant="danger" onClick={onClearData} type="button">
                <Trash2 size={16} /> Factory Reset
            </Button>
        </div>
        <p className="text-zinc-500 text-[10px] font-mono text-center mt-2">
            <Database size={10} className="inline mr-1" />
            Local storage only. No cloud sync.
        </p>
      </Card>
    </div>
  );
};