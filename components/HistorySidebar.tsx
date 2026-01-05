
import React from 'react';
import { GeneratedPrompt } from '../types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: GeneratedPrompt[];
  onSelectItem: (prompt: GeneratedPrompt) => void;
  onClear: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onSelectItem,
  onClear
}) => {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-xs bg-slate-900 z-50 shadow-2xl transition-transform duration-300 transform border-l border-slate-800 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <h2 className="text-xl font-bold text-white">Histórico</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center px-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Nenhum prompt gerado ainda. Comece criando o seu primeiro!</p>
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-950/30 hover:bg-slate-800/50 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{item.category}</span>
                  <span className="text-[10px] text-slate-500">{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white line-clamp-1">{item.theme}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic">"{item.mainPrompt.objective}"</p>
              </button>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="p-6 border-t border-slate-800">
            <button 
              onClick={onClear}
              className="w-full py-3 text-sm text-slate-400 hover:text-red-400 font-medium transition-colors border border-slate-800 hover:border-red-400/20 rounded-xl"
            >
              Limpar Histórico
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default HistorySidebar;
