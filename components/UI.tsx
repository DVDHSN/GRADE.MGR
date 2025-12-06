import React, { ReactNode } from 'react';
import { X, Minus, Square, AlertTriangle } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'outline' | 'ghost' | 'retro' | 'icon';
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  // BRUTAL PHYSICS: Deep press effect (active state translates 4px) and hard, unblurred shadows.
  // Every button feels like a physical switch.
  const baseStyle = "font-mono font-bold uppercase tracking-wider py-3 px-6 text-sm relative transition-all duration-75 ease-out border-2 select-none flex items-center justify-center gap-2 active:top-[4px] active:left-[4px] active:shadow-none outline-none focus:outline-none";
  
  const variants = {
    // Primary: Standard operation
    primary: "bg-white text-black border-white shadow-[4px_4px_0px_0px_#333] hover:shadow-[6px_6px_0px_0px_#ef4444] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:border-red-500 hover:text-red-600",
    
    // Danger: Destructive actions
    danger: "bg-red-600 text-white border-red-600 shadow-[4px_4px_0px_0px_#000] hover:bg-red-500 hover:shadow-[6px_6px_0px_0px_#fff] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:text-black hover:border-white",
    
    // Outline: Secondary actions
    outline: "bg-transparent text-white border-zinc-700 shadow-[4px_4px_0px_0px_transparent] hover:border-white hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_0px_#fff] hover:-translate-y-0.5 hover:-translate-x-0.5",
    
    // Retro: Special actions (Submit, Save)
    retro: "bg-[#ccff00] text-black border-[#ccff00] shadow-[4px_4px_0px_0px_#000] hover:bg-white hover:border-white hover:-translate-y-0.5 hover:-translate-x-0.5",
    
    // Ghost: Low priority
    ghost: "border-transparent text-zinc-500 hover:text-white hover:bg-zinc-900 active:translate-x-0 active:translate-y-0 px-2 py-1 shadow-none active:top-0 active:left-0",
    
    // Icon: Square, distinct
    icon: "p-2 aspect-square bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-red-500 hover:border-red-500 hover:bg-red-950/30 active:translate-y-0 active:translate-x-0"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full group">
      {label && <label className="text-xs font-bold uppercase text-zinc-500 group-focus-within:text-lime-400 transition-colors duration-200 ml-1 mb-1 flex items-center gap-2">
        <span className="w-1 h-1 bg-zinc-700 group-focus-within:bg-lime-400 transition-colors" /> {label}
      </label>}
      <input 
        className={`bg-black border-2 border-zinc-800 text-white p-3 focus:outline-none focus:border-lime-400 focus:shadow-[4px_4px_0px_0px_#ccff00] transition-all duration-200 font-mono placeholder:text-zinc-800 ${className}`} 
        {...props} 
      />
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full group">
      {label && <label className="text-xs font-bold uppercase text-zinc-500 group-focus-within:text-lime-400 transition-colors duration-200 ml-1 mb-1 flex items-center gap-2">
        <span className="w-1 h-1 bg-zinc-700 group-focus-within:bg-lime-400 transition-colors" /> {label}
      </label>}
      <div className="relative">
        <select 
          className={`w-full bg-black border-2 border-zinc-800 text-white p-3 pr-8 focus:outline-none focus:border-lime-400 focus:shadow-[4px_4px_0px_0px_#ccff00] transition-all duration-200 font-mono appearance-none cursor-pointer rounded-none hover:border-zinc-600 ${className}`} 
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-hover:text-white transition-colors">▼</div>
      </div>
    </div>
  );
};

export const Card: React.FC<{ children: ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`bg-black border-2 border-zinc-800 flex flex-col hover:border-zinc-500 hover:shadow-[4px_4px_0px_0px_#222] transition-all duration-300 group hover:-translate-y-0.5 ${className}`}>
    {title && (
      <div className="bg-zinc-900 border-b-2 border-zinc-800 p-2 px-3 flex items-center justify-between select-none group-hover:bg-zinc-800 transition-colors duration-300">
         <h3 className="text-xs font-bold uppercase tracking-widest font-mono flex items-center gap-2 group-hover:text-white text-zinc-400 transition-colors">
            <span className="w-2 h-2 bg-red-500 inline-block border border-black group-hover:bg-lime-400 transition-colors"></span>
            {title}
         </h3>
         <div className="flex gap-1">
             <Minus size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
             <Square size={10} className="opacity-50 group-hover:opacity-100 transition-opacity" strokeWidth={3} />
             <X size={12} className="opacity-50 group-hover:opacity-100 transition-opacity hover:text-red-500 cursor-pointer" />
         </div>
      </div>
    )}
    <div className="p-6 relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        <div className="relative z-10">
            {children}
        </div>
    </div>
  </div>
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-black border-2 border-white w-full max-w-lg relative shadow-[16px_16px_0px_0px_#111] animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-white text-black p-3 border-b-2 border-black flex justify-between items-center select-none shrink-0">
            <h2 className="text-lg font-bold uppercase tracking-widest font-mono">>> {title}</h2>
            <button onClick={onClose} className="hover:bg-red-600 hover:text-white p-1 border-2 border-transparent hover:border-black transition-colors active:scale-95">
                <X size={20} />
            </button>
        </div>
        
        <div className="p-6 font-mono text-sm leading-relaxed overflow-y-auto custom-scrollbar bg-black text-zinc-300">
            {children}
        </div>
        
        <div className="p-4 border-t-2 border-zinc-800 bg-zinc-950 flex justify-end gap-3 shrink-0">
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
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-red-950/80 backdrop-grayscale p-4 animate-in fade-in duration-200">
        <div className="bg-black border-2 border-red-500 w-full max-w-md relative shadow-[16px_16px_0px_0px_#450a0a] animate-in zoom-in-95 duration-150 flex flex-col">
          <div className="bg-red-500 text-black p-3 font-black uppercase tracking-widest flex items-center gap-2 border-b-2 border-black">
             <AlertTriangle size={20} strokeWidth={3} />
             {title}
          </div>
          <div className="p-8 text-center bg-black bg-[radial-gradient(#222_1px,transparent_1px)] bg-[size:10px_10px]">
              <p className="font-mono text-lg text-white mb-4 font-bold leading-tight">{message}</p>
              <p className="text-xs text-red-500 font-mono uppercase tracking-widest border border-red-900/50 p-2 inline-block bg-red-950/20">
                Action is irreversible
              </p>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4 border-t-2 border-red-900/50 bg-zinc-950">
             <Button variant="outline" onClick={onCancel} className="w-full text-xs hover:border-zinc-500">ABORT</Button>
             <Button variant="danger" onClick={onConfirm} className="w-full text-xs">CONFIRM PURGE</Button>
          </div>
        </div>
      </div>
    );
  };