
import React from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/20">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1 bg-cyan-500 rounded blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-10 h-10 bg-slate-900 border border-cyan-500/50 rounded flex items-center justify-center font-bold text-cyan-400 shadow-inner">
              <span className="font-logo text-xl">P</span>
            </div>
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-xl font-logo font-bold tracking-tight text-white">PROMPT</span>
            <span className="text-xs font-tech tracking-[0.3em] text-cyan-500 font-bold uppercase">Mestre</span>
          </div>
        </div>
        
        <button 
          onClick={toggleSidebar}
          className="group relative px-4 py-2 text-slate-400 hover:text-cyan-400 transition-all font-tech"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline font-medium uppercase tracking-widest text-[10px]">Log de Sistemas</span>
          </div>
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 transition-all duration-300 group-hover:w-full"></div>
        </button>
      </div>
    </header>
  );
};

export default Header;
