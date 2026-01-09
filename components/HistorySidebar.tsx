
import React, { useState } from 'react';
import { GeneratedPrompt } from '../types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: GeneratedPrompt[];
  onSelectItem: (prompt: GeneratedPrompt) => void;
  onDeleteItem: (id: string) => void;
  onClear: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onSelectItem,
  onDeleteItem,
  onClear
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  const filteredHistory = activeTab === 'all' 
    ? history 
    : history.filter(item => item.isFavorite);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-slate-950 z-50 shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-transform duration-500 transform border-l border-cyan-500/20 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-8 border-b border-slate-900 bg-slate-950">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="font-tech text-2xl font-bold text-white uppercase tracking-tighter">Log de Dados</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="font-tech text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sistemas Ativos</span>
              </div>
            </div>
            <button onClick={onClose} className="p-3 text-slate-500 hover:text-white hover:bg-slate-900 rounded border border-slate-900 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border border-slate-800 rounded p-1">
            <button 
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 font-tech text-[10px] font-bold uppercase tracking-widest transition-all rounded ${activeTab === 'all' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Log Geral
            </button>
            <button 
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-2 font-tech text-[10px] font-bold uppercase tracking-widest transition-all rounded flex items-center justify-center gap-2 ${activeTab === 'favorites' ? 'bg-yellow-500/10 text-yellow-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill={activeTab === 'favorites' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Arquivos Salvos
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-700 text-center px-6">
              <div className="relative mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-tech text-[10px] uppercase opacity-40">Empty_Buffer</div>
              </div>
              <p className="font-tech text-xs uppercase tracking-widest">
                {activeTab === 'favorites' ? 'Nenhum prompt salvo nos arquivos.' : 'Log de histórico vazio.'}
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => onSelectItem(item)}
                  className={`w-full text-left p-5 rounded border bg-slate-900/20 hover:bg-slate-900/60 transition-all relative overflow-hidden ${item.isFavorite ? 'border-yellow-500/20' : 'border-slate-900 hover:border-cyan-500/30'}`}
                >
                  {item.isFavorite && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/40"></div>
                  )}
                  
                  <div className="flex items-center justify-between mb-3 pr-6">
                    <span className={`font-tech text-[9px] font-bold uppercase tracking-[0.2em] ${item.isFavorite ? 'text-yellow-500' : 'text-cyan-500'}`}>{item.category}</span>
                    <span className="font-tech text-[9px] text-slate-600">{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-tech text-sm font-bold text-slate-200 group-hover:text-cyan-50 uppercase tracking-tight pr-6 line-clamp-1">{item.theme}</h3>
                  <div className="mt-3 flex gap-0.5">
                    {[1,2,3,4,5].map(i => <div key={i} className={`h-0.5 flex-1 ${i <= (item.isFavorite ? 5 : 3) ? (item.isFavorite ? 'bg-yellow-500/40' : 'bg-cyan-500/40') : 'bg-slate-800'}`}></div>)}
                  </div>
                </button>

                {/* Botão de Deletar Individual */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(item.id);
                  }}
                  className="absolute top-4 right-4 p-1.5 text-slate-700 hover:text-red-500 hover:bg-red-500/5 rounded transition-all opacity-0 group-hover:opacity-100 z-10"
                  title="Deletar Registro"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-8 bg-slate-950 border-t border-slate-900">
          <button 
            onClick={onClear}
            className="w-full py-4 font-tech text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 hover:text-red-500 transition-all border border-slate-900 hover:border-red-500/20 rounded-sm"
          >
            Wipe_Database (Limpar Tudo)
          </button>
        </div>
      </aside>
    </>
  );
};

export default HistorySidebar;
