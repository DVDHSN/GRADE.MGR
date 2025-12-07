import React, { useState, useEffect } from 'react';
import { Grade, AppSettings, DEFAULT_SCALE } from './types';
import { GradeForm } from './components/GradeForm';
import { Dashboard } from './components/Dashboard';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { HelpSystem } from './components/HelpSystem';
import { ConfirmModal } from './components/UI';
import { LayoutGrid, PieChart, PenTool, Settings as SettingsIcon, PanelLeftClose, PanelLeftOpen, GraduationCap, HelpCircle, Terminal, Command } from 'lucide-react';

type View = 'dashboard' | 'analytics' | 'input' | 'settings';

const App = () => {
  // Data State
  const [grades, setGrades] = useState<Grade[]>(() => {
    const saved = localStorage.getItem('grade_mgr_data');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            return parsed.map((g: any) => ({
                ...g,
                year: g.year || g.semester || new Date().getFullYear().toString()
            }));
        } catch (e) {
            console.error("Failed to load data", e);
            return [];
        }
    }
    return [];
  });

  // Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('grade_mgr_settings');
    return saved ? JSON.parse(saved) : { targetScore: 75, gradingScale: DEFAULT_SCALE };
  });

  // UI State
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('grade_mgr_data', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('grade_mgr_settings', JSON.stringify(settings));
  }, [settings]);

  const addGrade = (grade: Grade) => {
    setGrades([...grades, grade]);
    setCurrentView('dashboard');
  };

  const updateGrade = (updatedGrade: Grade) => {
    setGrades(grades.map(g => g.id === updatedGrade.id ? updatedGrade : g));
  };

  const deleteGrade = (id: string) => {
    setGrades(grades.filter(g => g.id !== id));
  };

  const handleImportData = (newGrades: Grade[]) => {
      const cleaned = newGrades.map((g: any) => ({
          ...g,
          year: g.year || g.semester || new Date().getFullYear().toString()
      }));
      setGrades(prev => [...prev, ...cleaned]);
      setCurrentView('dashboard');
  };

  const handleClearData = () => {
    setIsResetModalOpen(true);
  };

  const performFactoryReset = () => {
    setGrades([]);
    setSettings({ targetScore: 75, gradingScale: DEFAULT_SCALE });
    setIsResetModalOpen(false);
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => {
    const isActive = currentView === view;
    return (
      <button 
        onClick={() => setCurrentView(view)}
        className={`
          relative group flex items-center gap-4 px-6 py-5 mx-0 transition-all duration-200
          ${isActive 
            ? 'bg-zinc-100 text-black border-y-4 border-black z-10 -my-0.5' 
            : 'text-zinc-500 hover:text-white hover:bg-zinc-900 border-y-4 border-transparent hover:border-zinc-800'}
          ${isSidebarCollapsed ? 'justify-center px-0' : ''}
        `}
        title={isSidebarCollapsed ? label : undefined}
      >
        <Icon 
          size={24} 
          className={`flex-shrink-0 transition-transform duration-200 ${isActive ? 'text-black' : 'group-hover:text-white group-hover:scale-110'}`} 
          strokeWidth={isActive ? 3 : 2}
        />
        
        <span className={`
          font-mono text-base font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 overflow-hidden
          ${isSidebarCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}
        `}>
          {label}
        </span>
        
        {isActive && !isSidebarCollapsed && (
            <span className="absolute right-4 text-xs animate-pulse font-black text-red-500">● ACT</span>
        )}
      </button>
    );
  };

  return (
    <div className="flex h-screen w-full text-zinc-200 overflow-hidden selection:bg-lime-400 selection:text-black font-mono">
      
      {/* Help System Overlay */}
      <HelpSystem view={currentView} isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Factory Reset Confirmation */}
      <ConfirmModal 
        isOpen={isResetModalOpen}
        title="SYSTEM PURGE // FACTORY RESET"
        message="WARNING: You are about to initiate a full factory reset. This will delete ALL grades and reset settings to default. This action is irreversible."
        onConfirm={performFactoryReset}
        onCancel={() => setIsResetModalOpen(false)}
      />

      {/* Sidebar */}
      <aside 
        className={`
          relative flex flex-col bg-[#0e0e10] border-r-4 border-zinc-800 transition-all duration-300 z-30
          ${isSidebarCollapsed ? 'w-24' : 'w-80'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-28 flex items-center justify-center px-4 mb-0 border-b-4 border-zinc-800 bg-black select-none relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] bg-[size:4px_4px] opacity-50 pointer-events-none"></div>
          {!isSidebarCollapsed ? (
            <div className="flex flex-col items-center gap-1 animate-in fade-in duration-300 group z-10 w-full">
               <div className="flex items-center gap-2 border-2 border-white p-1 px-3 bg-black transform -rotate-2 hover:rotate-0 transition-transform duration-300 shadow-[4px_4px_0px_0px_#ef4444]">
                   <Command size={18} />
                   <h1 className="text-2xl font-black uppercase tracking-tighter text-white whitespace-nowrap italic">
                     GRADE.MGR
                   </h1>
               </div>
               <div className="text-[10px] text-zinc-600 font-bold tracking-[0.3em] w-full text-center mt-3 group-hover:text-red-500 transition-colors">SYS.V6.2</div>
            </div>
          ) : (
            <div className="w-full flex justify-center animate-in fade-in duration-300 z-10">
               <div className="bg-white text-black p-2 border-2 border-zinc-500 hover:border-red-500 hover:bg-black hover:text-white transition-all cursor-pointer shadow-[4px_4px_0px_0px_#333]">
                 <Terminal size={28} strokeWidth={2} />
               </div>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-5 top-[120px] bg-black border-2 border-zinc-500 text-zinc-400 w-10 h-10 flex items-center justify-center hover:text-white hover:border-white transition-all z-50 hover:scale-110 hover:shadow-[4px_4px_0px_0px_#ccff00] active:translate-y-1 active:shadow-none"
        >
           {isSidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col py-0 overflow-y-auto custom-scrollbar gap-0 bg-[#0e0e10]">
           <NavItem view="dashboard" icon={LayoutGrid} label="Dashboard" />
           <NavItem view="analytics" icon={PieChart} label="Analytics" />
           <NavItem view="input" icon={PenTool} label="Input_Log" />
           
           <div className={`mt-auto ${isSidebarCollapsed ? '' : 'border-t-4 border-zinc-800'}`}>
             <NavItem view="settings" icon={SettingsIcon} label="Config" />
           </div>
        </nav>

        {/* Footer */}
        <div className={`p-6 text-center bg-black border-t-4 border-zinc-800 ${isSidebarCollapsed ? 'opacity-0 h-0 overflow-hidden p-0' : 'opacity-100'}`}>
          <div className="flex justify-center gap-3 mb-3 group cursor-help">
            <div className="w-3 h-3 bg-red-500 border border-black hover:scale-125 transition-transform"></div>
            <div className="w-3 h-3 bg-yellow-500 border border-black hover:scale-125 transition-transform delay-75"></div>
            <div className="w-3 h-3 bg-green-500 border border-black hover:scale-125 transition-transform delay-150"></div>
          </div>
          <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest cursor-default group-hover:text-zinc-400 transition-colors font-bold">
            SECURE CONNECTION
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto bg-transparent relative scroll-smooth p-0">
        
        {/* Help Button */}
        <div className="absolute top-8 right-8 z-40 hidden md:block">
           <button 
             onClick={() => setIsHelpOpen(true)}
             className="bg-[#18181b] border-2 border-zinc-700 text-zinc-500 hover:text-black hover:bg-lime-400 hover:border-black w-12 h-12 flex items-center justify-center transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#fff] hover:-translate-y-1 hover:-translate-x-1 active:translate-x-0 active:translate-y-0 active:shadow-none"
             title="System Help"
           >
             <HelpCircle size={24} strokeWidth={2} />
           </button>
        </div>

        <div className="max-w-[1800px] mx-auto p-4 md:p-8 lg:p-12 pb-32 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Mobile Header */}
          <div className="md:hidden mb-8 border-b-4 border-zinc-800 pb-4 flex items-center justify-between bg-black p-4 border-4 shadow-[4px_4px_0px_0px_#333]">
             <h2 className="text-xl font-black uppercase tracking-tight text-white">
               {currentView === 'input' ? 'Input Protocol' : currentView}
             </h2>
             <button onClick={() => setIsHelpOpen(true)} className="text-[10px] font-mono font-bold text-black bg-lime-400 px-2 py-1 uppercase border-2 border-black active:translate-y-0.5">Help</button>
          </div>

          {currentView === 'dashboard' && (
            <Dashboard 
                grades={grades} 
                settings={settings} 
                onUpdateGrade={updateGrade}
                onDeleteGrade={deleteGrade}
            />
          )}
          {currentView === 'analytics' && <Analytics grades={grades} settings={settings} />}
          {currentView === 'settings' && (
              <Settings 
                  grades={grades} 
                  settings={settings} 
                  onUpdateSettings={setSettings}
                  onImportData={handleImportData}
                  onClearData={handleClearData}
              />
          )}
          {currentView === 'input' && (
            <div className="max-w-xl mx-auto pt-4 md:pt-10">
              <GradeForm onAddGrade={addGrade} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;