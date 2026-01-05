
import React, { useState, useEffect, useCallback } from 'react';
import { generatePromptFromTheme } from './geminiService';
import { GeneratedPrompt, PromptState } from './types';
import Header from './components/Header';
import PromptForm from './components/PromptForm';
import PromptResult from './components/PromptResult';
import HistorySidebar from './components/HistorySidebar';

const App: React.FC = () => {
  const [state, setState] = useState<PromptState>({
    currentPrompt: null,
    history: [],
    isLoading: false,
    error: null,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load history from localStorage on mount
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

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('prompt_mestre_history', JSON.stringify(state.history));
  }, [state.history]);

  const handleGenerate = async (theme: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const newPrompt = await generatePromptFromTheme(theme);
      setState(prev => ({
        ...prev,
        currentPrompt: newPrompt,
        history: [newPrompt, ...prev.history].slice(0, 50), // Keep last 50
        isLoading: false,
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Ocorreu um erro ao gerar o prompt. Verifique sua conexão ou tente novamente."
      }));
      console.error(err);
    }
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
    <div className="min-h-screen text-slate-200 selection:bg-indigo-500/30">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Engenharia de <span className="gradient-text">Prompt</span> Pro
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Transforme temas simples em instruções poderosas e estruturadas em segundos. 
            Melhor que 90% dos prompts escritos manualmente.
          </p>
        </div>

        <PromptForm onGenerate={handleGenerate} isLoading={state.isLoading} />

        {state.error && (
          <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {state.error}
          </div>
        )}

        <PromptResult 
          prompt={state.currentPrompt} 
          isLoading={state.isLoading} 
        />
      </main>

      <HistorySidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        history={state.history}
        onSelectItem={selectHistoryItem}
        onClear={clearHistory}
      />

      <footer className="py-8 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Prompt Mestre — Desenvolvido com Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
