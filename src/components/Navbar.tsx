import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  Database, 
  ShieldAlert, 
  Layers, 
  Code2, 
  Cpu,
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'counselor' | 'prompts' | 'rag' | 'security' | 'features' | 'codebase';
  setActiveTab: (tab: 'counselor' | 'prompts' | 'rag' | 'security' | 'features' | 'codebase') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'counselor', label: 'AI Counselor', icon: GraduationCap, badge: 'Live SaaS' },
    { id: 'prompts', label: 'Prompt Studio', icon: Terminal, badge: 'CoT & JSON' },
    { id: 'rag', label: 'Offline RAG', icon: Database, badge: 'ChromaDB' },
    { id: 'security', label: 'Cyber Defense Lab', icon: ShieldAlert, badge: 'SQLi + IDOR' },
    { id: 'features', label: 'Defense Features', icon: Layers, badge: '3 Expansions' },
    { id: 'codebase', label: 'Python Codebase', icon: Code2, badge: 'Drop-in' },
  ] as const;

  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 tracking-tight text-lg">
                Career<span className="text-cyan-400">AI</span> Studio
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-medium">
                University Capstone Edition
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hybrid Llama 3 & Gemini 3.8 Flash • Persistent SQLite • Cybersecurity Defense Lab
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600/30 via-indigo-600/30 to-purple-600/30 text-cyan-200 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>

        {/* System Badges */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-[11px]">Ollama & Gemini Ready</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span className="font-mono text-[11px]">Port 5000 / 3000</span>
          </div>
        </div>
      </div>
    </header>
  );
};
