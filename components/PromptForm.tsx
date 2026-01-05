
import React, { useState } from 'react';

interface PromptFormProps {
  onGenerate: (theme: string) => void;
  isLoading: boolean;
}

const PromptForm: React.FC<PromptFormProps> = ({ onGenerate, isLoading }) => {
  const [theme, setTheme] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (theme.trim() && !isLoading) {
      onGenerate(theme);
    }
  };

  const handleClear = () => {
    setTheme('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative group max-w-3xl mx-auto">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-lg blur opacity-10 group-focus-within:opacity-40 transition duration-500"></div>
      
      <div className="relative flex flex-col md:flex-row gap-0 bg-slate-900 border border-slate-700/50 rounded-lg shadow-2xl overflow-hidden">
        {/* HUD Decoration Left */}
        <div className="hidden md:block w-1.5 bg-cyan-500/50 self-stretch"></div>
        
        <div className="flex-1 relative flex items-center">
          <div className="absolute left-4 flex flex-col gap-0.5 opacity-40">
            <div className="w-4 h-[1px] bg-cyan-400"></div>
            <div className="w-2 h-[1px] bg-cyan-400"></div>
          </div>
          <input 
            type="text" 
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="DIGITE O TEMA"
            className="w-full pl-12 pr-24 py-5 bg-transparent border-none text-cyan-50 font-tech tracking-wider uppercase placeholder:text-slate-700 focus:ring-0 text-sm md:text-base"
            disabled={isLoading}
          />
          
          {/* Opção de Limpar - Ajustada posição */}
          {theme && !isLoading && (
            <button 
              type="button"
              onClick={handleClear}
              className="absolute right-4 px-3 py-1.5 font-tech text-[8px] md:text-[9px] text-slate-500 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/30 rounded transition-all uppercase tracking-[0.2em] bg-slate-950/50 backdrop-blur-sm"
              title="Limpar Tema"
            >
              Limpar
            </button>
          )}
        </div>

        <button 
          type="submit"
          disabled={!theme.trim() || isLoading}
          className={`
            px-10 py-5 font-tech font-bold uppercase tracking-[0.2em] text-xs transition-all relative overflow-hidden group/btn
            ${isLoading 
              ? 'bg-slate-800 text-slate-500' 
              : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
            }
          `}
        >
          <div className="relative z-10 flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processando</span>
              </>
            ) : (
              <>
                <span>Executar Geração</span>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              </>
            )}
          </div>
          {/* Button Scan Effect */}
          {!isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
          )}
        </button>
      </div>

      <div className="mt-3 flex justify-between items-center px-1">
        <div className="flex gap-1">
          {[1,2,3,4].map(i => <div key={i} className="w-1 h-1 bg-cyan-500/20 rounded-full"></div>)}
        </div>
        <span className="font-tech text-[10px] text-slate-600 tracking-tighter uppercase italic">Status: Link Neural Operacional</span>
      </div>
      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </form>
  );
};

export default PromptForm;
