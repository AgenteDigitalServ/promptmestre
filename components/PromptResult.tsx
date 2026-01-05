
import React, { useState } from 'react';
import { GeneratedPrompt } from '../types';

interface PromptResultProps {
  prompt: GeneratedPrompt | null;
  isLoading: boolean;
}

const PromptResult: React.FC<PromptResultProps> = ({ prompt, isLoading }) => {
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
      <div className="mt-12 space-y-6 animate-pulse">
        <div className="h-10 bg-slate-800 rounded-lg w-1/3"></div>
        <div className="h-64 bg-slate-800 rounded-2xl w-full"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-slate-800 rounded-xl"></div>
          <div className="h-32 bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!prompt) return null;

  return (
    <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-full border border-indigo-500/20">
            {prompt.category}
          </span>
          <h2 className="text-2xl font-bold mt-2 text-white">Prompt Mestre: {prompt.theme}</h2>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {prompt.mainPrompt.persona}
          </span>
        </div>
      </div>

      {/* Main Prompt Section */}
      <section className="glass-card rounded-2xl overflow-hidden">
        <div className="bg-slate-800/50 px-6 py-3 flex items-center justify-between border-b border-slate-700/50">
          <span className="text-xs font-bold text-slate-400 uppercase">Prompt Principal</span>
          <button 
            onClick={() => copyToClipboard(prompt.mainPrompt.fullContent, 'main')}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${copiedMain ? 'text-emerald-400' : 'text-indigo-400 hover:text-indigo-300'}`}
          >
            {copiedMain ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Copiado!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copiar Prompt
              </>
            )}
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Público</span>
              <span className="text-sm font-medium text-slate-300">{prompt.mainPrompt.targetAudience}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Nível</span>
              <span className="text-sm font-medium text-slate-300">{prompt.mainPrompt.level}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Tom</span>
              <span className="text-sm font-medium text-slate-300">{prompt.mainPrompt.tone}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Objetivo</span>
              <span className="text-sm font-medium text-slate-300">{prompt.mainPrompt.objective}</span>
            </div>
          </div>
          <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800 font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-300 selection:bg-indigo-500/40">
            {prompt.mainPrompt.fullContent}
          </div>
        </div>
      </section>

      {/* Variations and Advice */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 1.417l-6.774 5.645a2 2 0 01-2.483.008l-.448-.373a2 2 0 01-.003-3.097l6.774-5.645a6 6 0 001.417-3.86l-.477-2.387a2 2 0 00-.547-1.022L2.29 2.29a1 1 0 00-1.414 1.414l5.357 5.357a2 2 0 01.547 1.022l.477 2.387a6 6 0 003.86 1.417l6.774 5.645a2 2 0 012.483-.008l.448.373a2 2 0 01.003 3.097l-6.774-5.645a6 6 0 00-1.417 3.86l.477 2.387a2 2 0 00.547 1.022l5.357 5.357a1 1 0 001.414-1.414l-5.357-5.357z" />
            </svg>
            Variações Inteligentes
          </h3>
          <div className="grid gap-4">
            {prompt.variations.map((v, i) => (
              <div key={i} className="glass-card p-4 rounded-xl group relative border-l-4 border-l-purple-500/50">
                <p className="text-sm text-slate-400 leading-relaxed pr-8">{v}</p>
                <button 
                  onClick={() => copyToClipboard(v, 'variation', i)}
                  className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${copiedIndex === i ? 'text-emerald-400' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
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
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Dicas de Uso
          </h3>
          <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-xl">
            <p className="text-sm text-slate-300 italic leading-relaxed">
              "{prompt.usageAdvice}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptResult;
