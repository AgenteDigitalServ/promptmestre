
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

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
      <div className="relative flex flex-col md:flex-row gap-4 p-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
        <div className="flex-1 relative flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Qual o tema do seu prompt? (ex: História Medieval, Marketing para SaaS...)"
            className="w-full pl-12 pr-4 py-4 bg-transparent border-none text-white text-lg placeholder:text-slate-600 focus:ring-0"
            disabled={isLoading}
          />
        </div>
        <button 
          type="submit"
          disabled={!theme.trim() || isLoading}
          className={`
            px-8 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2
            ${isLoading 
              ? 'bg-slate-800 cursor-not-allowed text-slate-500' 
              : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-lg shadow-indigo-600/30'
            }
          `}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Gerando...</span>
            </>
          ) : (
            <>
              <span>Gerar Prompt</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PromptForm;
