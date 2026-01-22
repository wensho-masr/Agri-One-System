
import React, { useState } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface CenteredSelectProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  variant?: 'table' | 'default';
}

const CenteredSelect: React.FC<CenteredSelectProps> = ({ label, options, value, onChange, className, variant = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={variant === 'table' 
          ? `flex items-center gap-1 text-xs p-1.5 rounded-lg border-none cursor-pointer transition-all hover:brightness-110 ${className}`
          : `flex items-center justify-between w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-right focus:ring-2 focus:ring-emerald-500 outline-none transition-all hover:border-slate-600 ${className}`
        }
      >
        <span className="truncate">{selectedOption?.label || label || 'اختر...'}</span>
        <ChevronDown size={14} className="opacity-50" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200" 
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-slate-800 border border-slate-700 w-full max-w-xs rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
              <span className="font-bold text-slate-300">{label || 'اختر من القائمة'}</span>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-700 rounded-full text-slate-400">
                <X size={18} />
              </button>
            </div>
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-right flex items-center justify-between p-4 rounded-2xl transition-all mb-1 ${
                    value === opt.value 
                    ? 'bg-emerald-500/10 text-emerald-500 font-bold' 
                    : 'hover:bg-slate-700/50 text-slate-300'
                  }`}
                >
                  <span>{opt.label}</span>
                  {value === opt.value && <Check size={18} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CenteredSelect;
