
import React, { useState } from 'react';
import { GeneratedPrompt } from '../types';

interface PromptResultProps {
  prompt: GeneratedPrompt | null;
  isLoading: boolean;
  onToggleFavorite: (id: string) => void;
}

const PromptResult: React.FC<PromptResultProps> = ({ prompt, isLoading, onToggleFavorite }) => {
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, type: 'main' | 'variation', index?: number) => {
    navigator.clipboard.writeText(text);
    if (type === 'main') {
      setCopiedMain(true);
      setTimeout(() => setCopiedMain(false), 2000);
    } else if (index !== undefined) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-16 space-y-8 animate-pulse">
        <div className="flex items-end gap-4">
          <div className="h-12 bg-slate-800 rounded w-48"></div>
          <div className="h-6 bg-slate-800 rounded w-32 mb-1"></div>
        </div>
        <div className="h-[400px] bg-slate-800/50 rounded-lg border border-slate-700/30"></div>
      </div>
    );
  }

  if (!prompt) return null;

  return (
    <div className="mt-16 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Header Info */}
      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
              <span className="font-tech text-[9px] font-bold text-cyan-500 uppercase tracking-widest">Compilação Concluída</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-tech font-bold text-white tracking-tighter uppercase leading-none">
              {prompt.theme}
            </h2>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-tech text-[9px] text-slate-500 uppercase tracking-widest">Classificação</span>
            <span className="px-4 py-1 bg-cyan-500/10 text-cyan-400 font-tech font-bold text-xs tracking-widest border border-cyan-500/30 rounded-sm">
              {prompt.category}
            </span>
          </div>
        </div>
        <div className="mt-4 h-[1px] bg-gradient-to-r from-cyan-500/50 via-slate-800 to-transparent"></div>
      </div>

      {/* Main Terminal View */}
      <section className="cyber-card rounded-lg group">
        <div className="bg-slate-950/80 px-6 py-4 flex items-center justify-between border-b border-cyan-500/20">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40"></div>
            </div>
            <span className="font-tech text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Output_v3.3</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onToggleFavorite(prompt.id)}
              className={`flex items-center gap-2 font-tech text-[9px] font-bold uppercase tracking-widest transition-all ${prompt.isFavorite ? 'text-yellow-400' : 'text-slate-500 hover:text-cyan-400'}`}
              title={prompt.isFavorite ? 'Remover' : 'Salvar'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={prompt.isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {prompt.isFavorite ? 'Salvo' : 'Favoritar'}
            </button>

            <button 
              onClick={() => copyToClipboard(prompt.mainPrompt.fullContent, 'main')}
              className={`group/copy flex items-center gap-2 font-tech text-[9px] font-bold uppercase tracking-widest transition-all ${copiedMain ? 'text-emerald-400' : 'text-cyan-400 hover:text-white'}`}
            >
              {copiedMain ? 'Copiado' : 'Transferir'}
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform group-hover/copy:scale-110`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 pb-8 border-b border-slate-800/50">
            {[
              { label: 'Persona', value: prompt.mainPrompt.persona, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
              { label: 'Alvo', value: prompt.mainPrompt.targetAudience, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
              { label: 'Nível', value: prompt.mainPrompt.level, icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
              { label: 'Tom', value: prompt.mainPrompt.tone, icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-1 border-l border-slate-800 pl-4">
                <div className="flex items-center gap-1.5">
                  <span className="font-tech text-[8px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</span>
                </div>
                <span className="font-tech text-xs font-semibold text-slate-200 uppercase tracking-wider">{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="relative group/terminal">
            <div className="absolute top-4 right-4 text-[8px] font-mono text-cyan-500/20 uppercase pointer-events-none">NEOTICA_BUFFER_0x2</div>
            <div className="bg-black/40 p-8 rounded border border-slate-800 font-mono text-sm leading-relaxed text-slate-300 min-h-[250px] overflow-x-auto whitespace-pre-wrap selection:bg-cyan-500/30">
              <div className="mb-4 text-cyan-500/40 text-[9px] font-bold tracking-widest">[ SYSTEM_INSTRUCTION_BLOCK ]</div>
              {prompt.mainPrompt.fullContent}
              <span className="inline-block w-2 h-4 bg-cyan-500 ml-1 animate-pulse align-middle"></span>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-sections */}
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
            <h3 className="font-tech text-lg font-bold text-white uppercase tracking-widest">Variantes Ativas</h3>
            <div className="flex-1 h-[1px] bg-slate-800"></div>
          </div>
          <div className="grid gap-4">
            {prompt.variations.map((v, i) => (
              <div key={i} className="cyber-card p-5 rounded group relative border-l-2 border-l-cyan-500/30 hover:border-l-cyan-400 transition-all">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2">
                    <span className="font-tech text-[8px] font-bold text-slate-500 uppercase tracking-widest">SEQ_ID_0{i+1}</span>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{v}</p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(v, 'variation', i)}
                    className={`p-2 rounded border border-slate-800 hover:border-cyan-500/50 transition-colors ${copiedIndex === i ? 'text-emerald-400' : 'text-slate-600 hover:text-cyan-400'}`}
                  >
                    {copiedIndex === i ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-3">
            <h3 className="font-tech text-lg font-bold text-white uppercase tracking-widest">Protocolo</h3>
            <div className="flex-1 h-[1px] bg-slate-800"></div>
          </div>
          <div className="cyber-card p-6 rounded relative overflow-hidden group">
            <p className="font-tech text-[10px] text-cyan-400 leading-relaxed uppercase tracking-wider">
              SUGESTÃO_DE_IMPLEMENTAÇÃO:
              <span className="block mt-2 text-slate-300 italic font-sans font-medium text-sm normal-case">
                "{prompt.usageAdvice}"
              </span>
            </p>
            <div className="mt-6 flex gap-2">
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-cyan-500 shadow-[0_0_10px_rgba(0,242,255,0.5)]"></div>
              </div>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="font-tech text-[8px] text-slate-600 font-bold uppercase">Confidence_Index</span>
              <span className="font-tech text-[8px] text-cyan-500 font-bold uppercase">94.2% Accurate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptResult;
