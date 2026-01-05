
import React, { useState, useEffect } from 'react';
import { generatePromptFromTheme } from './geminiService.ts';
import { GeneratedPrompt, PromptState } from './types.ts';
import Header from './components/Header.tsx';
import PromptForm from './components/PromptForm.tsx';
import PromptResult from './components/PromptResult.tsx';
import HistorySidebar from './components/HistorySidebar.tsx';

const App: React.FC = () => {
  const [state, setState] = useState<PromptState>({
    currentPrompt: null,
    history: [],
    isLoading: false,
    error: null,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('prompt_mestre_history');
    if (savedHistory) {
      try {
        setState(prev => ({ ...prev, history: JSON.parse(savedHistory) }));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('prompt_mestre_history', JSON.stringify(state.history));
  }, [state.history]);

  const handleGenerate = async (theme: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const newPrompt = await generatePromptFromTheme(theme);
      setState(prev => {
        const updatedHistory = [newPrompt, ...prev.history].slice(0, 100);
        return {
          ...prev,
          currentPrompt: newPrompt,
          history: updatedHistory,
          isLoading: false,
        };
      });
    } catch (err: any) {
      console.error("Erro Neural detectado:", err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "Ocorreu uma falha inesperada na rede neural. Verifique os buffers de conexão."
      }));
    }
  };

  const toggleFavorite = (id: string) => {
    setState(prev => {
      const updatedHistory = prev.history.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      );
      
      const updatedCurrent = prev.currentPrompt?.id === id 
        ? { ...prev.currentPrompt, isFavorite: !prev.currentPrompt.isFavorite }
        : prev.currentPrompt;

      return {
        ...prev,
        history: updatedHistory,
        currentPrompt: updatedCurrent
      };
    });
  };

  const selectHistoryItem = (prompt: GeneratedPrompt) => {
    setState(prev => ({ ...prev, currentPrompt: prompt }));
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearHistory = () => {
    setState(prev => ({ ...prev, history: [] }));
    localStorage.removeItem('prompt_mestre_history');
  };

  return (
    <div className="min-h-screen text-slate-200 selection:bg-cyan-500/30 overflow-x-hidden">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="container mx-auto px-6 py-16 max-w-5xl">
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-4xl md:text-6xl font-tech font-bold tracking-tighter uppercase leading-none">
            Neural <span className="gradient-text">Prompt</span> Engine
          </h1>
        </div>

        <PromptForm onGenerate={handleGenerate} isLoading={state.isLoading} />

        {state.error && (
          <div className="mt-10 p-5 bg-red-500/5 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-4">
            <div className="w-10 h-10 flex-shrink-0 bg-red-500/10 rounded flex items-center justify-center animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-tech text-[10px] font-bold uppercase tracking-widest text-red-500/70">Relatório de Falha de Sistema</span>
              <p className="font-medium text-xs md:text-sm font-mono opacity-90">{state.error}</p>
            </div>
          </div>
        )}

        <PromptResult 
          prompt={state.currentPrompt} 
          isLoading={state.isLoading} 
          onToggleFavorite={toggleFavorite}
        />
      </main>

      <HistorySidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        history={state.history}
        onSelectItem={selectHistoryItem}
        onClear={clearHistory}
      />

      <footer className="py-12 text-center border-t border-slate-900/50 mt-12">
        <div className="flex justify-center gap-12 mb-6">
          <div className="flex flex-col items-center">
            <span className="font-tech text-[8px] text-slate-700 uppercase font-bold tracking-[0.2em]">Hardware_Status</span>
            <span className="font-tech text-[9px] text-emerald-500/60 uppercase">Online</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-tech text-[8px] text-slate-700 uppercase font-bold tracking-[0.2em]">Cloud_Link</span>
            <span className="font-tech text-[9px] text-cyan-500/60 uppercase">Encrypted</span>
          </div>
        </div>
        <p className="font-tech text-[9px] text-slate-600 uppercase tracking-[0.4em]">
          TERMINAL_SESS_END // {new Date().getFullYear()} PROMPT_MESTRE_SYS
        </p>
      </footer>
    </div>
  );
};

export default App;
