import React, { useState, useEffect } from 'react';
import { Grade, AppSettings, DEFAULT_SCALE } from './types';
import { GradeForm } from './components/GradeForm';
import { Dashboard } from './components/Dashboard';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { HelpSystem } from './components/HelpSystem';
import { LayoutGrid, PieChart, PenTool, Settings as SettingsIcon, PanelLeftClose, PanelLeftOpen, GraduationCap, HelpCircle, Terminal } from 'lucide-react';

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
    if(confirm("SYSTEM WARNING: Confirm deletion of all records? This action is irreversible.")) {
      setGrades([]);
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => {
    const isActive = currentView === view;
    return (
      <button 
        onClick={() => setCurrentView(view)}
        className={`
          relative group flex items-center gap-4 px-4 py-4 mx-0 transition-all duration-200
          ${isActive 
            ? 'bg-white text-black border-y-2 border-black z-10' 
            : 'text-zinc-500 hover:text-white hover:bg-zinc-900 border-y-2 border-transparent hover:pl-6'}
          ${isSidebarCollapsed ? 'justify-center hover:pl-4' : ''}
        `}
        title={isSidebarCollapsed ? label : undefined}
      >
        <Icon 
          size={20} 
          className={`flex-shrink-0 transition-transform duration-200 ${isActive ? 'text-black' : 'group-hover:text-white group-hover:scale-110'}`} 
          strokeWidth={2}
        />
        
        <span className={`
          font-mono text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 overflow-hidden
          ${isSidebarCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}
        `}>
          {label}
        </span>
        
        {isActive && !isSidebarCollapsed && (
            <span className="absolute right-4 text-xs animate-pulse">●</span>
        )}
      </button>
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white overflow-hidden selection:bg-lime-400 selection:text-black font-mono">
      
      {/* Help System Overlay */}
      <HelpSystem view={currentView} isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Sidebar */}
      <aside 
        className={`
          relative flex flex-col bg-black border-r-2 border-zinc-800 transition-all duration-300 z-30
          ${isSidebarCollapsed ? 'w-20' : 'w-72'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-24 flex items-center justify-center px-2 mb-2 border-b-2 border-zinc-800 bg-zinc-950 select-none">
          {!isSidebarCollapsed ? (
            <div className="flex flex-col items-center gap-1 animate-in fade-in duration-300 group">
               <h1 className="text-3xl font-black uppercase tracking-tighter text-white whitespace-nowrap cursor-default italic group-hover:-skew-x-12 transition-transform duration-300">
                 GRADE<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">.MGR</span>
               </h1>
               <div className="text-[10px] text-zinc-500 tracking-[0.2em] w-full text-center border-t border-zinc-800 pt-1 group-hover:text-red-500 transition-colors">SYS.V6.1</div>
            </div>
          ) : (
            <div className="w-full flex justify-center animate-in fade-in duration-300">
               <Terminal size={32} className="text-white hover:text-red-500 transition-colors cursor-pointer" />
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-28 bg-black border-2 border-zinc-700 text-zinc-400 p-1 hover:text-white hover:border-white transition-all z-50 hover:scale-110 hover:rotate-180 duration-300"
        >
           {isSidebarCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
        </button>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col py-0 overflow-y-auto custom-scrollbar gap-px bg-zinc-900">
           <NavItem view="dashboard" icon={LayoutGrid} label="Dashboard" />
           <NavItem view="analytics" icon={PieChart} label="Analytics" />
           <NavItem view="input" icon={PenTool} label="Input_Log" />
           
           <div className={`mt-auto ${isSidebarCollapsed ? '' : 'border-t-2 border-zinc-800'}`}>
             <NavItem view="settings" icon={SettingsIcon} label="Config" />
           </div>
        </nav>

        {/* Footer */}
        <div className={`p-4 text-center bg-black border-t-2 border-zinc-800 ${isSidebarCollapsed ? 'opacity-0 h-0 overflow-hidden p-0' : 'opacity-100'}`}>
          <div className="flex justify-center gap-2 mb-2 group cursor-help">
            <div className="w-2 h-2 bg-red-500 animate-pulse group-hover:bg-red-400"></div>
            <div className="w-2 h-2 bg-yellow-500 group-hover:bg-yellow-400 transition-colors delay-75"></div>
            <div className="w-2 h-2 bg-green-500 group-hover:bg-green-400 transition-colors delay-150"></div>
          </div>
          <p className="text-zinc-600 font-mono text-[9px] uppercase tracking-widest cursor-default group-hover:text-zinc-400 transition-colors">
            ONLINE // SECURE
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto bg-transparent relative scroll-smooth">
        
        {/* Help Button */}
        <div className="absolute top-6 right-6 z-40">
           <button 
             onClick={() => setIsHelpOpen(true)}
             className="bg-black border-2 border-zinc-800 text-zinc-500 hover:text-black hover:bg-white hover:border-white w-10 h-10 flex items-center justify-center transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#fff] hover:-translate-y-1 hover:-translate-x-1 active:translate-x-0 active:translate-y-0 active:shadow-none"
             title="System Help"
           >
             <HelpCircle size={20} />
           </button>
        </div>

        <div className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12 pb-32 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Mobile Header */}
          <div className="md:hidden mb-8 border-b-2 border-zinc-800 pb-4 flex items-center justify-between bg-black p-4 border-2">
             <h2 className="text-xl font-bold uppercase tracking-tight text-white">
               {currentView === 'input' ? 'Input Protocol' : currentView}
             </h2>
             <span className="text-[10px] font-mono text-zinc-500 uppercase border border-zinc-800 px-2 py-1">Mob.View</span>
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