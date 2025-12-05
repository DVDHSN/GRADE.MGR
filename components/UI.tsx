import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'outline' | 'ghost';
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  const baseStyle = "font-mono font-bold uppercase tracking-wider py-3 px-6 border-2 text-sm relative overflow-hidden group active:scale-95 hover:scale-[1.02] transition-all duration-300 ease-out transform-gpu";
  
  const variants = {
    primary: "bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed",
    danger: "bg-zinc-900 border-red-900 text-red-500 hover:bg-red-950 hover:border-red-600 hover:text-red-400 hover:shadow-[0_0_20px_rgba(153,27,27,0.4)] hover:-translate-y-0.5",
    outline: "bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-200 hover:text-white hover:bg-zinc-900 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]",
    ghost: "border-transparent text-zinc-500 hover:text-red-500 hover:bg-zinc-900/50 hover:scale-105",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full group">
      {label && <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest group-focus-within:text-red-500 transition-colors duration-300">{label}</label>}
      <input 
        className={`bg-zinc-950 border-2 border-zinc-800 text-zinc-100 p-3 focus:outline-none focus:border-red-600 focus:shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:border-zinc-600 hover:shadow-[0_0_10px_rgba(255,255,255,0.05)] transition-all duration-300 font-mono placeholder:text-zinc-800 ${className}`} 
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
      {label && <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest group-focus-within:text-red-500 transition-colors duration-300">{label}</label>}
      <select 
        className={`bg-zinc-950 border-2 border-zinc-800 text-zinc-100 p-3 focus:outline-none focus:border-red-600 focus:shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:border-zinc-600 hover:shadow-[0_0_10px_rgba(255,255,255,0.05)] transition-all duration-300 font-mono appearance-none cursor-pointer ${className}`} 
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const Card: React.FC<{ children: ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`border-2 border-zinc-900 bg-zinc-950/50 backdrop-blur-sm p-6 flex flex-col gap-4 hover:border-zinc-700 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.6)] hover:-translate-y-1 hover:scale-[1.005] transition-all duration-300 ease-out group transform-gpu ${className}`}>
    {title && (
      <div className="flex items-center justify-between mb-2">
         <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 border-b-2 border-zinc-900 pb-2 w-full group-hover:border-red-900/30 group-hover:text-red-500/80 transition-colors duration-300">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-950 border-2 border-zinc-800 w-full max-w-lg relative animate-in zoom-in-95 duration-200 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-red-500 transition-colors hover:scale-110 hover:rotate-90 duration-300"
        >
          <X size={24} />
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">{title}</h2>
          <div className="h-1 w-12 bg-red-600 mb-6" />
          <div className="text-zinc-300 font-mono text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {children}
          </div>
        </div>
        
        <div className="p-4 bg-zinc-900/50 border-t border-zinc-900 flex justify-end">
          <Button variant="outline" onClick={onClose} className="py-2 text-xs">Close Protocol</Button>
        </div>
      </div>
    </div>
  );
};