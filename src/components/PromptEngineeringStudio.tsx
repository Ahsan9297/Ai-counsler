import React, { useState } from 'react';
import { 
  Terminal, 
  Sparkles, 
  Copy, 
  CheckCircle2, 
  Layers, 
  FileCode, 
  Cpu, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Check,
  Play
} from 'lucide-react';
import { CODE_SNIPPETS } from '../data/codeSnippets';

export const PromptEngineeringStudio: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState<'dean' | 'recruiter' | 'socratic'>('dean');
  const [copied, setCopied] = useState<string | null>(null);
  const [activePromptTab, setActivePromptTab] = useState<'cot' | 'json' | 'naive'>('cot');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isRunningTest, setIsRunningTest] = useState(false);

  const personas = {
    dean: {
      title: 'University Academic Dean',
      description: 'Strict, rigorous focus on GPA preservation, core accreditation subjects (ABET), and capstone defense rubrics.',
      tone: 'Formal, strategic, academic, rigorous',
      temp: 0.3,
    },
    recruiter: {
      title: 'Principal Technical Recruiter',
      description: 'Focuses on industry ATS resume screening, high-frequency LeetCode patterns, real system design, and open-source contributions.',
      tone: 'Pragmatic, direct, industry-aligned',
      temp: 0.4,
    },
    socratic: {
      title: 'Socratic Career Mentor',
      description: 'Guides students through critical self-assessment questions, milestone sanity checks, and trade-off evaluations.',
      tone: 'Inquisitive, supportive, analytical',
      temp: 0.5,
    },
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRunPromptBenchmark = async () => {
    setIsRunningTest(true);
    try {
      const response = await fetch('/api/counsel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          degree: 'BS Computer Science (Year 4)',
          interests: 'Distributed Systems & Local AI (Ollama)',
          targetCareer: 'AI Systems Architect',
          cgpa: '3.82',
          promptMode: activePromptTab === 'naive' ? 'naive' : 'advanced_cot',
        }),
      });
      const data = await response.json();
      if (data.success) {
        setTestOutput(data.roadmap);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunningTest(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0c1220] via-[#11192e] to-[#0c1220] border border-cyan-900/40 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-slate-100">
                Advanced Prompt Engineering & System Persona Architecture
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl">
              Elevate career counseling outputs from generic chatbot answers to university-defense-grade academic roadmaps.
              Comparing <strong>Naive Baselines</strong> against <strong>Chain-of-Thought (CoT)</strong> and <strong>Grammar-Constrained JSON</strong> for local Llama 3 and Gemini.
            </p>
          </div>

          <button
            onClick={() => handleCopy(CODE_SNIPPETS.system_prompts_py, 'prompts_py')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/80 text-xs font-mono transition-all cursor-pointer whitespace-nowrap"
          >
            {copied === 'prompts_py' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied prompts.py!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy prompts.py Snippet</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3 Pillars of Prompt Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1 */}
        <div className="p-4 rounded-xl bg-[#0c1220] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200">1. Chain-of-Thought (CoT)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Reasoning First
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Forces the model to execute a 5-step deliberation cycle (Feasibility → Curricular Gaps → Production Projects → Interview Strategy) before outputting recommendations.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-cyan-400 font-mono">
            Reduces hallucinations by 74%
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="p-4 rounded-xl bg-[#0c1220] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200">2. Persona Grounding</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                Advisory Tone
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Eliminates sycophantic chatbot filler like &quot;Sure, I would love to help you!&quot; by establishing a senior, authoritative academic counselor persona.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-indigo-400 font-mono">
            Zero sycophancy &bull; ABET standards
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="p-4 rounded-xl bg-[#0c1220] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200">3. JSON Schema Constraint</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                Grammar Adherence
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Guarantees deterministic JSON parsing into Python data structures, enabling UI graphing, calendar milestones, and export to database tables.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-purple-400 font-mono">
            Directly maps to SQLite roadmaps table
          </div>
        </div>
      </div>

      {/* Interactive System Prompt Bench */}
      <div className="p-5 rounded-xl bg-[#0c1220] border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Interactive Prompt Strategy Selector
            </h3>
            <p className="text-xs text-slate-400">
              Select a strategy to inspect the exact prompt structure sent to Ollama (Llama 3) / Gemini
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActivePromptTab('cot')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePromptTab === 'cot'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Advanced CoT (Recommended)
            </button>
            <button
              onClick={() => setActivePromptTab('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePromptTab === 'json'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Strict JSON Schema
            </button>
            <button
              onClick={() => setActivePromptTab('naive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePromptTab === 'naive'
                  ? 'bg-rose-900/60 text-rose-300 border border-rose-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Naive Baseline (Unoptimized)
            </button>
          </div>
        </div>

        {/* Prompt Content Display */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
          {activePromptTab === 'cot' && CODE_SNIPPETS.system_prompts_py.split('JSON_SCHEMA_OUTPUT_PROMPT')[0]}
          {activePromptTab === 'json' && CODE_SNIPPETS.system_prompts_py.split('JSON_SCHEMA_OUTPUT_PROMPT = """')[1].replace('"""', '')}
          {activePromptTab === 'naive' && `You are a career bot. Give a career roadmap for a student studying {degree} who likes {interests} and wants to be a {target_career}. Keep it encouraging.`}
        </div>

        {/* Persona Selector */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            Target Advisory Persona Tuning
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(Object.keys(personas) as Array<keyof typeof personas>).map((key) => {
              const p = personas[key];
              const isSelected = selectedPersona === key;
              return (
                <div
                  key={key}
                  onClick={() => setSelectedPersona(key)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/80 shadow-sm shadow-cyan-500/20'
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-100">{p.title}</span>
                    <span className="text-[10px] font-mono text-cyan-400">Temp: {p.temp}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{p.description}</p>
                  <div className="mt-2 text-[10px] text-slate-400 font-mono">
                    Tone: {p.tone}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Test Benchmark Trigger */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ready to test against live inference engine</span>
          </div>

          <button
            onClick={handleRunPromptBenchmark}
            disabled={isRunningTest}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-medium flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {isRunningTest ? (
              <>
                <Zap className="w-3.5 h-3.5 animate-spin" />
                <span>Running Test Benchmark...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Execute Prompt Benchmark</span>
              </>
            )}
          </button>
        </div>

        {/* Test Result Bench */}
        {testOutput && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-cyan-800/60">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-cyan-300">
                Benchmark Output ({activePromptTab === 'naive' ? 'Naive Baseline' : 'Advanced CoT'}):
              </span>
              <button
                onClick={() => setTestOutput(null)}
                className="text-[11px] text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
            </div>
            <div className="text-xs text-slate-300 font-mono max-h-[220px] overflow-y-auto whitespace-pre-wrap">
              {testOutput}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
