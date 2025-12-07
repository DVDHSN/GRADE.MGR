import React, { useState } from 'react';
import { Grade, ExamType, SUBJECT_LIST } from '../types';
import { Button, Input, Select, Card } from './UI';
import { Plus, ArrowRight } from 'lucide-react';

interface GradeFormProps {
  onAddGrade: (grade: Grade) => void;
}

const FORMS = ["Form 1", "Form 2", "Form 3", "Form 4", "Form 5"];

export const GradeForm: React.FC<GradeFormProps> = ({ onAddGrade }) => {
  const [subjectSelect, setSubjectSelect] = useState(SUBJECT_LIST[0]);
  const [customSubject, setCustomSubject] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [type, setType] = useState<ExamType>(ExamType.MIDTERM);
  const [year, setYear] = useState(FORMS[3]); // Default to Form 4
  const [score, setScore] = useState('');
  
  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (subjectSelect === "(Custom)" && !customSubject.trim()) {
        newErrors.customSubject = "Subject Name Required";
    }

    if (!score) {
        newErrors.score = "Score Required";
    } else {
        const numScore = Number(score);
        if (isNaN(numScore)) {
            newErrors.score = "Must be a number";
        } else if (numScore < 0 || numScore > 100) {
            newErrors.score = "Range: 0 - 100";
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const isCustom = subjectSelect === "(Custom)";
    const finalCourseName = isCustom ? customSubject.toUpperCase() : subjectSelect;
    
    const newGrade: Grade = {
      id: crypto.randomUUID(),
      courseName: finalCourseName,
      customCode: isCustom && customCode ? customCode.toUpperCase() : undefined,
      type,
      score: Number(score),
      year,
      date: new Date().toISOString(),
    };

    onAddGrade(newGrade);
    
    // Reset specific fields
    if (isCustom) {
      setCustomSubject('');
      setCustomCode('');
    }
    setScore('');
    setErrors({});
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScore(e.target.value);
    if (errors.score) {
        setErrors(prev => ({ ...prev, score: '' }));
    }
  };

  const handleCustomSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomSubject(e.target.value);
    if (errors.customSubject) {
        setErrors(prev => ({ ...prev, customSubject: '' }));
    }
  };

  const examOptions = Object.values(ExamType).map(t => ({ value: t, label: t }));
  const subjectOptions = [
    ...SUBJECT_LIST.sort().map(s => ({ value: s, label: s })),
    { value: "(Custom)", label: "(Custom) - Enter manually" }
  ];
  const formOptions = FORMS.map(y => ({ value: y, label: y }));

  return (
    <Card title="Input Protocol" className="h-full max-w-2xl mx-auto border-red-900/30">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter hover:tracking-normal transition-all duration-300">New Entry</h2>
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Enter performance data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <Select 
                label="Subject"
                options={subjectOptions}
                value={subjectSelect}
                onChange={(e) => setSubjectSelect(e.target.value)}
              />
              {subjectSelect === "(Custom)" && (
                <div className="grid grid-cols-3 gap-4 animate-in slide-in-from-top-2 fade-in duration-300">
                  <div className="col-span-2">
                    <Input 
                      label="Subject Name"
                      placeholder="e.g. ROBOTICS" 
                      value={customSubject}
                      onChange={handleCustomSubjectChange}
                      required
                      autoFocus
                      className="border-lime-500/50"
                      error={errors.customSubject}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input 
                      label="Code (Opt)"
                      placeholder="ROB" 
                      value={customCode}
                      maxLength={3}
                      onChange={(e) => setCustomCode(e.target.value)}
                      className="border-lime-500/50"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <Select 
                label="Academic Form"
                options={formOptions}
                value={year}
                onChange={(e) => setYear(e.target.value)}
            />
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <Select 
            label="Assessment Type"
            options={examOptions}
            value={type}
            onChange={(e) => setType(e.target.value as ExamType)}
          />
          <Input 
            label="Score (%)" 
            type="number" 
            min="0" 
            max="100" 
            value={score}
            onChange={handleScoreChange}
            required
            className="text-red-500 font-bold text-xl"
            error={errors.score}
          />
        </div>

        <Button type="submit" className="mt-4 bg-white text-black border-white hover:bg-zinc-200 hover:text-black hover:border-white w-full group">
          <span className="flex items-center justify-center gap-2 group-hover:gap-4 transition-all duration-200">
             Confirm Entry <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </Button>
      </form>
    </Card>
  );
};