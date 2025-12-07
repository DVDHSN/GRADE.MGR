import React, { ReactNode } from 'react';
import { X, Minus, Square, AlertTriangle, CornerDownRight, Plus, AlertCircle } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'outline' | 'ghost' | 'retro' | 'icon';
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  // BRUTAL PHYSICS: Thicker borders, deeper offsets.
  const baseStyle = "font-mono font-black uppercase tracking-wider py-3 px-6 text-sm relative transition-all duration-100 ease-out border-4 select-none flex items-center justify-center gap-2 active:top-[4px] active:left-[4px] active:shadow-none outline-none focus:outline-none focus:ring-4 focus:ring-offset-4 focus:ring-offset-black focus:ring-lime-400";
  
  const variants = {
    // Primary: Standard operation
    primary: "bg-white text-black border-zinc-300 shadow-[6px_6px_0px_0px_#27272a] hover:shadow-[8px_8px_0px_0px_#ef4444] hover:-translate-y-1 hover:-translate-x-1 hover:border-white hover:bg-zinc-100 hover:text-red-600",
    
    // Danger: Destructive actions
    danger: "bg-red-600 text-white border-red-800 shadow-[6px_6px_0px_0px_#000] hover:bg-red-500 hover:shadow-[8px_8px_0px_0px_#fff] hover:-translate-y-1 hover:-translate-x-1 hover:text-black hover:border-black",
    
    // Outline: Secondary actions
    outline: "bg-transparent text-zinc-300 border-zinc-700 shadow-[6px_6px_0px_0px_transparent] hover:border-white hover:bg-white hover:text-black hover:shadow-[6px_6px_0px_0px_#fff] hover:-translate-y-1 hover:-translate-x-1",
    
    // Retro: Special actions (Submit, Save)
    retro: "bg-[#ccff00] text-black border-[#99cc00] shadow-[6px_6px_0px_0px_#000] hover:bg-white hover:border-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_#ccff00]",
    
    // Ghost: Low priority
    ghost: "border-transparent text-zinc-500 hover:text-white hover:bg-zinc-900 active:translate-x-0 active:translate-y-0 px-2 py-1 shadow-none active:top-0 active:left-0",
    
    // Icon: Square, distinct
    icon: "p-3 aspect-square bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-red-500 hover:border-red-500 hover:bg-red-950/30 active:translate-y-0 active:translate-x-0 shadow-none hover:shadow-[4px_4px_0px_0px_#ef4444]"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full group relative">
      <div className="flex justify-between items-baseline">
          {label && <label className={`text-xs font-black uppercase transition-colors duration-200 ml-1 mb-1 flex items-center gap-2 ${error ? 'text-red-500' : 'text-zinc-500 group-focus-within:text-lime-400'}`}>
            <span className={`w-2 h-2 border transition-all ${error ? 'border-red-500 bg-red-500' : 'border-zinc-700 group-focus-within:bg-lime-400 group-focus-within:border-lime-400'}`} /> {label}
          </label>}
          {error && <span className="text-[10px] text-red-500 font-mono font-bold uppercase animate-in slide-in-from-right-2 flex items-center gap-1"><AlertCircle size={10} /> {error}</span>}
      </div>
      <div className="relative">
        <input 
          className={`w-full bg-zinc-950 border-4 text-white p-4 focus:outline-none transition-all duration-200 font-mono placeholder:text-zinc-700 ${
            error 
            ? 'border-red-500 focus:border-red-500 focus:shadow-[6px_6px_0px_0px_#ef4444]' 
            : 'border-zinc-800 focus:border-lime-400 focus:bg-black focus:shadow-[6px_6px_0px_0px_#ccff00]'
          } ${className}`} 
          {...props} 
        />
        <div className={`absolute right-0 bottom-0 w-3 h-3 border-r-2 border-b-2 pointer-events-none transition-colors ${error ? 'border-red-500' : 'border-zinc-700 group-focus-within:border-lime-400'}`} />
      </div>
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full group">
       <div className="flex justify-between items-baseline">
          {label && <label className={`text-xs font-black uppercase transition-colors duration-200 ml-1 mb-1 flex items-center gap-2 ${error ? 'text-red-500' : 'text-zinc-500 group-focus-within:text-lime-400'}`}>
            <span className={`w-2 h-2 border transition-all ${error ? 'border-red-500 bg-red-500' : 'border-zinc-700 group-focus-within:bg-lime-400 group-focus-within:border-lime-400'}`} /> {label}
          </label>}
          {error && <span className="text-[10px] text-red-500 font-mono font-bold uppercase animate-in slide-in-from-right-2 flex items-center gap-1"><AlertCircle size={10} /> {error}</span>}
      </div>
      <div className="relative">
        <select 
          className={`w-full bg-zinc-950 border-4 text-white p-4 pr-10 focus:outline-none transition-all duration-200 font-mono appearance-none cursor-pointer rounded-none hover:border-zinc-600 focus:bg-black ${
            error 
            ? 'border-red-500 focus:border-red-500 focus:shadow-[6px_6px_0px_0px_#ef4444]' 
            : 'border-zinc-800 focus:border-lime-400 focus:shadow-[6px_6px_0px_0px_#ccff00]'
          } ${className}`} 
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${error ? 'text-red-500' : 'text-zinc-500 group-hover:text-white'}`}>
            <CornerDownRight size={16} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

export const Card: React.FC<{ children: ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`bg-[#18181b] border-4 border-zinc-800 flex flex-col hover:border-zinc-500 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000] relative overflow-hidden ${className}`}>
    
    {/* Decorative corner elements */}
    <div className="absolute top-0 right-0 p-1">
        <Plus size={10} className="text-zinc-800 group-hover:text-zinc-600 transition-colors" />
    </div>
    <div className="absolute bottom-0 left-0 p-1">
        <Plus size={10} className="text-zinc-800 group-hover:text-zinc-600 transition-colors" />
    </div>

    {title && (
      <div className="bg-zinc-900/50 border-b-4 border-zinc-800 p-3 px-4 flex items-center justify-between select-none group-hover:bg-zinc-800 transition-colors duration-300">
         <h3 className="text-xs font-black uppercase tracking-widest font-mono flex items-center gap-3 group-hover:text-white text-zinc-400 transition-colors">
            <span className="w-3 h-3 bg-red-500 inline-block border-2 border-black group-hover:bg-lime-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]"></span>
            {title}
         </h3>
         <div className="flex gap-2">
             <div className="h-1 w-4 bg-zinc-700 group-hover:bg-zinc-500 transition-colors"></div>
             <div className="h-1 w-1 bg-zinc-700 group-hover:bg-zinc-500 transition-colors"></div>
         </div>
      </div>
    )}
    <div className="p-6 relative h-full">
        {/* Subtle grid pattern inside cards */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        <div className="relative z-10 h-full">
            {children}
        </div>
    </div>
  </div>
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#18181b] border-4 border-white w-full max-w-lg relative shadow-[20px_20px_0px_0px_#000] animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-white text-black p-4 border-b-4 border-black flex justify-between items-center select-none shrink-0">
            <h2 className="text-xl font-black uppercase tracking-widest font-mono flex items-center gap-2">
                <span className="bg-black text-white px-1">SYS</span>
                {title}
            </h2>
            <button onClick={onClose} className="hover:bg-red-600 hover:text-white p-2 border-2 border-transparent hover:border-black transition-colors active:scale-95 group">
                <X size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
            </button>
        </div>
        
        <div className="p-8 font-mono text-sm leading-relaxed overflow-y-auto custom-scrollbar bg-[#18181b] text-zinc-300">
            {children}
        </div>
        
        <div className="p-6 border-t-4 border-zinc-800 bg-zinc-950 flex justify-end gap-4 shrink-0">
          <Button variant="outline" onClick={onClose} className="text-xs">CANCEL</Button>
          <Button variant="primary" onClick={onClose} className="text-xs">ACKNOWLEDGE</Button>
        </div>
      </div>
    </div>
  );
};

// High-Alert Confirmation Modal
export const ConfirmModal: React.FC<{ isOpen: boolean; onConfirm: () => void; onCancel: () => void; title: string; message: string }> = ({ isOpen, onConfirm, onCancel, title, message }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-red-950/90 backdrop-grayscale p-4 animate-in fade-in duration-200">
        <div className="bg-black border-4 border-red-500 w-full max-w-md relative shadow-[24px_24px_0px_0px_#450a0a] animate-in zoom-in-95 duration-150 flex flex-col">
          <div className="bg-red-500 text-black p-4 font-black uppercase tracking-widest flex items-center gap-2 border-b-4 border-black text-xl">
             <AlertTriangle size={24} strokeWidth={3} />
             {title}
          </div>
          <div className="p-10 text-center bg-black bg-[radial-gradient(#333_1px,transparent_1px)] bg-[size:10px_10px]">
              <p className="font-mono text-xl text-white mb-6 font-bold leading-tight uppercase">{message}</p>
              <p className="text-xs text-red-500 font-mono uppercase tracking-widest border-2 border-red-900/50 p-3 inline-block bg-red-950/20 font-bold">
                Action is irreversible // Proceed with caution
              </p>
          </div>
          <div className="grid grid-cols-2 gap-6 p-6 border-t-4 border-red-900/50 bg-zinc-950">
             <Button variant="outline" onClick={onCancel} className="w-full text-xs hover:border-zinc-500">ABORT</Button>
             <Button variant="danger" onClick={onConfirm} className="w-full text-xs">CONFIRM PURGE</Button>
          </div>
        </div>
      </div>
    );
  };