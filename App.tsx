import React, { useState, useEffect } from 'react';
import { Grade, AppSettings, DEFAULT_SCALE } from './types';
import { GradeForm } from './components/GradeForm';
import { Dashboard } from './components/Dashboard';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { HelpSystem } from './components/HelpSystem';
import { LayoutGrid, PieChart, PenTool, Settings as SettingsIcon, PanelLeftClose, PanelLeftOpen, GraduationCap, HelpCircle } from 'lucide-react';

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
          relative group flex items-center gap-4 px-4 py-3 mx-2 rounded-lg transition-all duration-300 hover:translate-x-1
          ${isActive 
            ? 'bg-zinc-900 text-white shadow-[0_0_15px_rgba(0,0,0,0.5)]' 
            : 'text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900/40'}
          ${isSidebarCollapsed ? 'justify-center' : ''}
        `}
        title={isSidebarCollapsed ? label : undefined}
      >
        <Icon 
          size={20} 
          className={`transition-all duration-300 flex-shrink-0 ${isActive ? 'text-red-500 scale-110' : 'group-hover:scale-110'}`} 
        />
        
        <span className={`
          font-mono text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 origin-left overflow-hidden
          ${isSidebarCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}
        `}>
          {label}
        </span>

        {/* Active Indicator Dot */}
        {isActive && !isSidebarCollapsed && (
          <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
        )}
        
        {/* Tooltip for collapsed state */}
        {isSidebarCollapsed && (
             <div className="absolute left-full ml-4 px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-xs text-white font-mono uppercase tracking-wider rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl translate-x-2 group-hover:translate-x-0">
               {label}
             </div>
        )}
      </button>
    );
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden selection:bg-red-900 selection:text-white font-sans">
      
      {/* Help System Overlay */}
      <HelpSystem view={currentView} isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Sidebar */}
      <aside 
        className={`
          relative flex flex-col bg-zinc-950 border-r border-zinc-900 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-30
          ${isSidebarCollapsed ? 'w-20' : 'w-72'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-24 flex items-center justify-between px-6 mb-2">
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-3 animate-in fade-in duration-300">
               <div className="bg-red-600 p-2 rounded shadow-[0_0_15px_rgba(220,38,38,0.5)] group hover:scale-105 transition-transform duration-300">
                 <GraduationCap className="text-white group-hover:rotate-12 transition-transform duration-300" size={24} />
               </div>
               <h1 className="text-2xl font-black uppercase tracking-tighter text-white whitespace-nowrap">
                 GRADE<span className="text-red-600 inline-block hover:rotate-12 transition-transform cursor-default origin-bottom-left">.MGR</span>
               </h1>
            </div>
          ) : (
            <div className="w-full flex justify-center animate-in fade-in duration-300">
               <div className="bg-red-600 p-2 rounded shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:scale-110 transition-transform">
                 <GraduationCap className="text-white" size={20} />
               </div>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-10 bg-zinc-900 border border-zinc-800 text-zinc-400 p-1.5 rounded-full hover:text-white hover:border-red-600 hover:bg-zinc-800 transition-all z-50 shadow-xl hover:scale-110"
        >
           {isSidebarCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
        </button>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col gap-2 py-4 overflow-y-auto custom-scrollbar">
           <NavItem view="dashboard" icon={LayoutGrid} label="Dashboard" />
           <NavItem view="analytics" icon={PieChart} label="Analytics" />
           <NavItem view="input" icon={PenTool} label="Input Protocol" />
           
           <div className={`mt-auto pt-4 mx-4 border-t border-zinc-900 transition-opacity duration-300 ${isSidebarCollapsed ? 'border-transparent' : ''}`}>
             <NavItem view="settings" icon={SettingsIcon} label="System Config" />
           </div>
        </nav>

        {/* Footer */}
        <div className={`p-6 text-center transition-all duration-500 ${isSidebarCollapsed ? 'opacity-0 h-0 overflow-hidden p-0' : 'opacity-100'}`}>
          <p className="text-zinc-800 font-mono text-[10px] uppercase tracking-widest hover:text-red-900 cursor-default">
            System V.6.0
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto bg-black/20 relative scroll-smooth">
        
        {/* Help Button (Floating or Header) */}
        <div className="absolute top-4 right-4 md:right-8 z-40">
           <button 
             onClick={() => setIsHelpOpen(true)}
             className="bg-zinc-900/80 backdrop-blur border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-600 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-red-900/20 group hover:scale-110"
             title="System Help"
           >
             <HelpCircle size={20} className="group-hover:rotate-12 transition-transform" />
           </button>
        </div>

        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 pb-32 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          {/* Dynamic Header for Mobile/Context */}
          <div className="md:hidden mb-6 pb-4 border-b border-zinc-900/50 flex items-center justify-between">
             <h2 className="text-xl font-bold uppercase tracking-tight text-zinc-400">
               {currentView === 'input' ? 'Input Protocol' : currentView}
             </h2>
             <span className="text-[10px] font-mono text-zinc-600 uppercase">Mobile View</span>
          </div>

          {currentView === 'dashboard' && <Dashboard grades={grades} settings={settings} />}
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