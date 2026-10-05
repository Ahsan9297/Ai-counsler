/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CareerCounselor } from './components/CareerCounselor';
import { PromptEngineeringStudio } from './components/PromptEngineeringStudio';
import { OfflineRagStudio } from './components/OfflineRagStudio';
import { CybersecurityLab } from './components/CybersecurityLab';
import { DefenseFeatures } from './components/DefenseFeatures';
import { CodebaseExporter } from './components/CodebaseExporter';
import { ShieldCheck, Cpu, Database, Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'counselor' | 'prompts' | 'rag' | 'security' | 'features' | 'codebase'
  >('counselor');

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'counselor' && <CareerCounselor />}
        {activeTab === 'prompts' && <PromptEngineeringStudio />}
        {activeTab === 'rag' && <OfflineRagStudio />}
        {activeTab === 'security' && <CybersecurityLab />}
        {activeTab === 'features' && <DefenseFeatures />}
        {activeTab === 'codebase' && <CodebaseExporter />}
      </main>

      {/* Professional University Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#080d17] px-4 py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-slate-300">
              AI Career Counseling Bot & Defense Research Platform
            </span>
            <span className="text-slate-500 hidden md:inline">&bull;</span>
            <span className="text-slate-400 hidden md:inline">
              Lead Student Researcher: Ahsan Nawaz
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-cyan-400">
              <Cpu className="w-3.5 h-3.5" /> Ollama Llama 3 & Gemini 3.8 Flash
            </span>
            <span className="flex items-center gap-1 text-indigo-400">
              <Database className="w-3.5 h-3.5" /> ChromaDB RAG
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> SQLi & IDOR Hardened
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
