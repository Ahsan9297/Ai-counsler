import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  FileText, 
  CheckCircle2, 
  Copy, 
  Check, 
  Layers, 
  Cpu, 
  BookOpen, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  Filter
} from 'lucide-react';
import { RAGQueryResponse } from '../types';
import { CODE_SNIPPETS } from '../data/codeSnippets';

export const OfflineRagStudio: React.FC = () => {
  const [query, setQuery] = useState('What is the tuition fee per credit hour and merit scholarship criteria?');
  const [isSearching, setIsSearching] = useState(false);
  const [ragResult, setRagResult] = useState<RAGQueryResponse | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'interactive' | 'architecture' | 'code'>('interactive');

  const sampleQueries = [
    'What is the tuition fee per credit hour and merit scholarship criteria?',
    'What is the minimum CGPA required to transfer from another university?',
    'How many semesters is the maximum allowable period for BS degree completion?',
    'What are the mandatory summer internship and capstone project requirements?',
  ];

  const handleExecuteRAG = async (searchQuery?: string) => {
    const q = searchQuery || query;
    setIsSearching(true);
    try {
      const response = await fetch('/api/rag-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await response.json();
      if (data.success) {
        setRagResult(data);
      }
    } catch (e) {
      console.error('RAG search error:', e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCopyCode = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0c1220] via-[#101b33] to-[#0c1220] border border-cyan-900/40 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-slate-100">
                Offline Vector RAG Architecture (ChromaDB + PyPDF + Llama 3)
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl">
              100% offline knowledge retrieval engine. Embeds university handbooks, fee structures, and admission policies into a local ChromaDB vector store using <code>all-MiniLM-L6-v2</code> for zero-hallucination counseling during your university defense.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'interactive'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Interactive RAG Sandbox
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'code'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Python RAG Code
            </button>
          </div>
        </div>
      </div>

      {/* How Offline RAG Works 4-Step Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0c1220] border border-slate-800">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[11px] font-bold flex items-center justify-center">
              1
            </span>
            <span className="text-xs font-semibold text-slate-200">PDF Ingestion</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Extracts raw text from university handbooks via <code>pypdf</code>.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0c1220] border border-slate-800">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 text-[11px] font-bold flex items-center justify-center">
              2
            </span>
            <span className="text-xs font-semibold text-slate-200">Semantic Chunking</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Splits text into 400-word blocks with 50-word sliding overlaps.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0c1220] border border-slate-800">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-purple-950 text-purple-400 border border-purple-800 text-[11px] font-bold flex items-center justify-center">
              3
            </span>
            <span className="text-xs font-semibold text-slate-200">Local ChromaDB</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Embeds chunks locally via <code>all-MiniLM-L6-v2</code> without internet.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0c1220] border border-slate-800">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-bold flex items-center justify-center">
              4
            </span>
            <span className="text-xs font-semibold text-slate-200">Grounded Synthesis</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Feeds top-k chunks into Llama 3 with zero-hallucination constraint.
          </p>
        </div>
      </div>

      {viewMode === 'interactive' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Query & Search Panel (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-xl bg-[#0c1220] border border-slate-800 flex flex-col gap-4">
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-1 flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                Query Vector Database
              </h3>
              <p className="text-xs text-slate-400">
                Ask specific questions about university fee structures, admissions, and course prerequisites
              </p>
            </div>

            {/* Input field */}
            <div className="space-y-2">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={3}
                className="w-full p-3 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                placeholder="Type query to retrieve vector matches..."
              />

              <button
                onClick={() => handleExecuteRAG()}
                disabled={isSearching || !query.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-xs font-medium flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSearching ? (
                  <>
                    <Zap className="w-3.5 h-3.5 animate-spin" />
                    <span>Searching ChromaDB & Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Execute Vector RAG Query</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Defense Demonstration Test Queries:
              </span>
              <div className="space-y-1.5">
                {sampleQueries.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(q);
                      handleExecuteRAG(q);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800/80 transition-all flex items-start gap-2"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{q}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ingested Documents Status */}
            <div className="pt-3 border-t border-slate-800 text-xs">
              <span className="text-[11px] text-slate-400 font-semibold block mb-2">
                Current Local Vector Collections:
              </span>
              <div className="space-y-1 text-[11px] text-slate-300">
                <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/50">
                  <span>📄 university_fee_structure_2026.pdf</span>
                  <span className="font-mono text-cyan-400">4 chunks</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/50">
                  <span>📄 computing_admissions_handbook.pdf</span>
                  <span className="font-mono text-indigo-400">3 chunks</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/50">
                  <span>📄 career_placement_guidelines.pdf</span>
                  <span className="font-mono text-purple-400">3 chunks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel: Retrieved Chunks & Grounded Answer (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Grounded AI Answer Card */}
            <div className="p-5 rounded-xl bg-[#0c1220] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-semibold text-slate-100 uppercase tracking-wider">
                    Grounded Zero-Hallucination Response
                  </h4>
                </div>
                {ragResult && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Latency: {ragResult.retrievalLatencyMs}ms
                  </span>
                )}
              </div>

              {!ragResult && !isSearching && (
                <div className="py-8 text-center text-xs text-slate-400">
                  Select a test query or run a search to view retrieved vector chunks and the grounded answer.
                </div>
              )}

              {isSearching && (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <Zap className="w-6 h-6 text-cyan-400 animate-spin mb-2" />
                  <p className="text-xs text-slate-300">Calculating semantic similarity across vector embeddings...</p>
                </div>
              )}

              {ragResult && !isSearching && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                    {ragResult.groundedAnswer}
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>
                      Retrieved <strong>{ragResult.topMatches.length}</strong> matching vector chunks from local ChromaDB.
                    </span>
                    <span className="text-emerald-400 font-mono">100% Grounded in PDF</span>
                  </div>
                </div>
              )}
            </div>

            {/* Vector Similarity Match Inspector */}
            {ragResult && ragResult.topMatches.length > 0 && (
              <div className="p-5 rounded-xl bg-[#0c1220] border border-slate-800 shadow-md flex-1">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-xs font-semibold text-slate-100 uppercase tracking-wider">
                      Retrieved Vector Chunks & Cosine Similarity
                    </h4>
                  </div>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                  {ragResult.topMatches.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-cyan-300 text-[11px]">
                          [{idx + 1}] {m.docTitle}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">{m.category}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                            Score: {(m.score * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* Similarity progress bar */}
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, m.score * 100)}%` }}
                        ></div>
                      </div>

                      <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
                        &quot;{m.chunk}&quot;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Code View */}
      {viewMode === 'code' && (
        <div className="p-5 rounded-xl bg-[#0c1220] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Production-Ready <code>rag_pipeline.py</code> (ChromaDB + PyPDF + Llama 3)
              </h3>
              <p className="text-xs text-slate-400">
                Drop this file into your Python Flask project root directory. Fully offline capable.
              </p>
            </div>

            <button
              onClick={() => handleCopyCode(CODE_SNIPPETS.rag_pipeline_py, 'rag_py')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 cursor-pointer"
            >
              {copied === 'rag_py' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Python Script</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 max-h-[500px] overflow-y-auto whitespace-pre leading-relaxed">
            {CODE_SNIPPETS.rag_pipeline_py}
          </div>
        </div>
      )}
    </div>
  );
};
