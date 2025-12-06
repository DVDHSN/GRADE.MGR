import React, { useState } from 'react';
import { Grade, ExamType, SUBJECT_LIST } from '../types';
import { Terminal, ArrowRight, Edit, Trash2, AlertOctagon, XCircle } from 'lucide-react';
import { Modal, ConfirmModal, Input, Button, Select } from './UI';

interface RecentGradesProps {
  grades: Grade[];
  onUpdate?: (grade: Grade) => void;
  onDelete?: (id: string) => void;
}

export const RecentGrades: React.FC<RecentGradesProps> = ({ grades, onUpdate, onDelete }) => {
  const recent = [...grades].reverse().slice(0, 6);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states for editing
  const [editScore, setEditScore] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editType, setEditType] = useState<ExamType>(ExamType.MIDTERM);

  const handleRowClick = (grade: Grade) => {
    if (!onUpdate) return;
    setEditingGrade(grade);
    setEditScore(grade.score.toString());
    setEditSubject(grade.courseName);
    setEditType(grade.type);
  };

  const handleSave = () => {
    if (editingGrade && onUpdate) {
        onUpdate({
            ...editingGrade,
            score: Number(editScore),
            courseName: editSubject,
            type: editType
        });
        setEditingGrade(null);
    }
  };

  const initiateDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Stop event from bubbling to edit handler
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId && onDelete) {
        onDelete(deletingId);
        setDeletingId(null);
        // Also close edit modal if it happens to be open for this item
        if (editingGrade?.id === deletingId) setEditingGrade(null);
    }
  };

  const handleDeleteFromModal = () => {
      if (editingGrade) {
          setDeletingId(editingGrade.id);
      }
  };

  const examOptions = Object.values(ExamType).map(t => ({ value: t, label: t }));
  const subjectOptions = [
    ...SUBJECT_LIST.sort().map(s => ({ value: s, label: s })),
    { value: editSubject, label: editSubject }
  ].filter((v, i, a) => a.findIndex(t => t.value === v.value) === i);

  return (
    <>
        <div className="flex flex-col h-full bg-black border-2 border-zinc-800 hover:border-zinc-500 transition-colors duration-300">
            <div className="flex items-center justify-between p-4 border-b-2 border-zinc-800 bg-zinc-950">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white font-mono flex items-center gap-2">
                    <Terminal size={14} className="text-lime-500" /> SYSTEM_LOG
                </h3>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse delay-75"></div>
                </div>
            </div>

            <div className="flex flex-col p-0">
                {recent.length === 0 ? (
                    <div className="text-center py-12 text-zinc-600 text-xs font-mono uppercase tracking-widest">
                        [ LOG EMPTY ]
                    </div>
                ) : (
                    recent.map((g) => {
                        const dateObj = new Date(g.date);
                        const dateStr = dateObj.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
                        const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

                        return (
                            <div 
                                key={g.id} 
                                className="group flex items-stretch border-b border-zinc-900 last:border-0 hover:bg-zinc-900 transition-colors duration-150 relative"
                            >
                                {/* Left: Edit Zone (Primary Action) */}
                                <div 
                                    onClick={() => handleRowClick(g)}
                                    className="flex-1 flex cursor-pointer relative hover:bg-zinc-800/50 transition-colors"
                                    title="Open Edit Protocol"
                                >
                                    {/* Accent Bar */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-lime-500 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-200" />

                                    {/* Date Stamp */}
                                    <div className="w-16 flex flex-col items-center justify-center border-r border-zinc-900 bg-zinc-950 group-hover:bg-black group-hover:text-lime-500 transition-colors px-1 py-3 text-zinc-500">
                                        <span className="text-[10px] font-mono font-bold leading-tight">{dateStr}</span>
                                        <span className="text-[9px] font-mono opacity-60">{timeStr}</span>
                                    </div>

                                    {/* Grade Details */}
                                    <div className="flex-1 flex flex-col justify-center px-4 py-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-bold uppercase tracking-tight text-zinc-300 group-hover:text-white transition-colors">
                                                {g.courseName.slice(0, 15)}{g.courseName.length > 15 && '..'}
                                            </span>
                                            <span className={`text-xs font-mono font-bold ${g.score >= 50 ? 'text-lime-500' : 'text-red-500'} bg-black px-2 py-0.5 border border-zinc-800 group-hover:border-current`}>
                                                {g.score}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] uppercase font-mono text-zinc-600 group-hover:text-zinc-400">
                                                {g.type}
                                            </span>
                                            <span className="text-[9px] uppercase font-mono text-lime-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                MOD <Edit size={9} />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Delete Zone (Destructive Action) */}
                                <button 
                                    onClick={(e) => initiateDelete(e, g.id)}
                                    className="w-12 border-l border-zinc-900 bg-zinc-950 hover:bg-red-600 hover:text-white text-zinc-700 flex items-center justify-center transition-all duration-200 z-10 active:bg-red-700"
                                    title="PURGE ENTRY"
                                    aria-label="Delete Grade"
                                >
                                    <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
            
            <div className="mt-auto p-2 bg-zinc-950 border-t-2 border-zinc-800 text-[10px] font-mono text-zinc-600 text-center uppercase cursor-default select-none">
                End of Stream
            </div>
        </div>

        {/* Edit Modal */}
        <Modal 
            isOpen={!!editingGrade && !deletingId} 
            onClose={() => setEditingGrade(null)} 
            title="DATA CORRECTION PROTOCOL"
        >
            <div className="flex flex-col gap-6">
                <div className="bg-red-900/10 border border-red-900/30 p-3 text-[10px] text-red-500 font-mono uppercase tracking-widest flex items-center gap-2">
                    <AlertOctagon size={14} />
                    Historical Alteration
                </div>

                <div className="flex flex-col gap-4">
                     <Select 
                        label="Override Subject" 
                        options={subjectOptions}
                        value={editSubject}
                        onChange={(e) => setEditSubject(e.target.value)}
                     />
                     
                     <Select 
                        label="Reclassify Assessment" 
                        options={examOptions}
                        value={editType}
                        onChange={(e) => setEditType(e.target.value as ExamType)}
                     />

                     <Input 
                        label="Corrected Score (%)"
                        type="number"
                        min="0"
                        max="100"
                        value={editScore}
                        onChange={(e) => setEditScore(e.target.value)}
                        className="text-lime-500 font-bold"
                     />
                </div>

                <div className="flex justify-between items-center border-t-2 border-zinc-800 pt-4 mt-2">
                    <Button variant="danger" onClick={handleDeleteFromModal} className="py-2 px-3 text-xs flex gap-2 items-center">
                        <Trash2 size={14} /> PURGE
                    </Button>
                    
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setEditingGrade(null)} className="py-2 text-xs">
                            ABORT
                        </Button>
                        <Button variant="retro" onClick={handleSave} className="py-2 text-xs">
                            OVERWRITE
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmModal 
            isOpen={!!deletingId}
            title="SYSTEM ALERT // DELETION"
            message="You are initiating a permanent purge of this grade record. This operation will immediately impact your GPA calculations and cannot be reversed."
            onConfirm={confirmDelete}
            onCancel={() => setDeletingId(null)}
        />
    </>
  );
};