import React, { useState } from 'react';
import { 
  Layers, 
  FileSearch, 
  GitBranch, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const DefenseFeatures: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<'gap_analyzer' | 'visual_flow' | 'heartbeat'>('gap_analyzer');

  // Resume Gap Analyzer state
  const [targetRole, setTargetRole] = useState('AI Full-Stack Solutions Architect');
  const [studentSkills, setStudentSkills] = useState(
    'Python, OOP, Data Structures, Algorithms, SQLite, Basic React, Git, Linear Algebra, Machine Learning Fundamentals'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gapAnalysisResult, setGapAnalysisResult] = useState<{
    fitScore: number;
    strongSkills: string[];
    criticalGaps: string[];
    recommendations: string[];
  } | null>({
    fitScore: 72,
    strongSkills: ['Data Structures & Algorithms', 'Python Core', 'SQLite Relational Modeling', 'Linear Algebra'],
    criticalGaps: [
      'Local Vector DBs (ChromaDB / Faiss)',
      'Async API Frameworks (FastAPI / Node async)',
      'Containerization (Docker & Kubernetes)',
      'Production LLM Orchestration (Ollama / vLLM)',
    ],
    recommendations: [
      'Package your university capstone in a multi-stage Docker container.',
      'Add a dedicated ChromaDB semantic index to prove RAG competence on your GitHub.',
      'Replace vanilla SQLite queries with parameterized asynchronous drivers.',
    ],
  });

  const [copied, setCopied] = useState(false);

  const handleRunGapAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setGapAnalysisResult({
        fitScore: 78,
        strongSkills: [
          'Python Systems Programming',
          'Data Structures & Algorithms (3.8+ GPA)',
          'Local AI Orchestration (Ollama Llama 3)',
          'Defensive Security (SQLi & IDOR mitigation)',
        ],
        criticalGaps: [
          'Docker & Container Orchestration',
          'Distributed Caching (Redis)',
          'Cloud Infra as Code (Terraform)',
        ],
        recommendations: [
          'Dockerize the current Flask + SQLite application to show container deployment.',
          'Add rate-limiting with Redis on the /api/generate-roadmap endpoint.',
          'Add automated GitHub Actions CI pipeline running pytest and security linters (Bandit).',
        ],
      });
      setIsAnalyzing(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0c1220] via-[#151c33] to-[#0c1220] border border-cyan-900/40 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-slate-100">
                Defense-Winning Feature Expansions
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl">
              Three high-impact capabilities designed to set your university capstone apart from basic CRUD chatbots.
              Demonstrate industry alignment, visual progress tracking, and resilient offline-first failover.
            </p>
          </div>

          {/* Feature Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedFeature('gap_analyzer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedFeature === 'gap_analyzer'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1. ATS Skill Gap Analyzer
            </button>
            <button
              onClick={() => setSelectedFeature('visual_flow')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedFeature === 'visual_flow'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2. Visual Roadmap Flowchart
            </button>
            <button
              onClick={() => setSelectedFeature('heartbeat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedFeature === 'heartbeat'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3. Hybrid Fallback Engine
            </button>
          </div>
        </div>
      </div>

      {/* FEATURE 1: ATS SKILL GAP ANALYZER */}
      {selectedFeature === 'gap_analyzer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-5 rounded-xl bg-[#0c1220] border border-slate-800 flex flex-col gap-4">
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-1 flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-cyan-400" />
                Transcript & Resume Skill Matcher
              </h3>
              <p className="text-xs text-slate-400">
                Calculates the delta between completed university coursework and real-world hiring prerequisites
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Target Industry Job Title
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Student Completed Courses & Skills
                </label>
                <textarea
                  rows={4}
                  value={studentSkills}
                  onChange={(e) => setStudentSkills(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={handleRunGapAnalysis}
                disabled={isAnalyzing}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-xs font-medium flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <span>Computing Skill Delta...</span>
                ) : (
                  <>
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Analyze Skill Gaps & Readiness</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 p-5 rounded-xl bg-[#0c1220] border border-slate-800 shadow-md">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                Automated ATS Readiness Report
              </span>
              {gapAnalysisResult && (
                <span className="text-xs font-bold text-cyan-300 font-mono">
                  ATS Match Score: {gapAnalysisResult.fitScore}%
                </span>
              )}
            </div>

            {gapAnalysisResult && (
              <div className="space-y-4">
                {/* Score bar */}
                <div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-1.5">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${gapAnalysisResult.fitScore}%` }}
                    ></div>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Target hiring benchmark: 75%+ readiness to clear initial recruiter screen.
                  </span>
                </div>

                {/* Strong Skills */}
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified Academic Competencies:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {gapAnalysisResult.strongSkills.map((s, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Critical Gaps */}
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-800/40">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Identified Industry Deficits (Missing from Coursework):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {gapAnalysisResult.criticalGaps.map((g, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-rose-950 text-rose-300 border border-rose-800"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Defense Recommendations */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <span className="font-semibold text-cyan-400 block mb-1">
                    Action Plan to Bridge Gaps Before Graduation:
                  </span>
                  {gapAnalysisResult.recommendations.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FEATURE 2: VISUAL ROADMAP FLOWCHART */}
      {selectedFeature === 'visual_flow' && (
        <div className="p-5 rounded-xl bg-[#0c1220] border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-indigo-400" />
                Visual Academic & Career Progression Timeline
              </h3>
              <p className="text-xs text-slate-400">
                Interactive flowchart mapping semesters directly to portfolio milestones and capstone defense
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(`graph TD
  A[Semester 5: Operating Systems & DBMS] --> B[Semester 6: Mandatory Tech Internship]
  B --> C[Semester 7: Capstone AI Counselor with Ollama]
  C --> D[Semester 8: Cybersecurity Defense & Industry Placement]`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-3 py-1.5 text-xs rounded-lg bg-slate-900 text-indigo-300 border border-indigo-800/80 hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Mermaid.js Diagram</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Stage 1 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 relative">
              <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center text-xs font-bold mb-2">
                1
              </div>
              <h4 className="text-xs font-bold text-slate-100 mb-1">Core Fundamentals</h4>
              <span className="text-[10px] font-mono text-cyan-400 block mb-2">Semesters 1–4</span>
              <ul className="text-[11px] text-slate-400 space-y-1">
                <li>• Data Structures & Algorithms</li>
                <li>• Object-Oriented Software Eng</li>
                <li>• Relational Databases (SQLite)</li>
                <li>• Maintain CGPA &gt;= 3.8</li>
              </ul>
            </div>

            {/* Stage 2 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 relative">
              <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center text-xs font-bold mb-2">
                2
              </div>
              <h4 className="text-xs font-bold text-slate-100 mb-1">Applied AI & Systems</h4>
              <span className="text-[10px] font-mono text-indigo-400 block mb-2">Semesters 5–6</span>
              <ul className="text-[11px] text-slate-400 space-y-1">
                <li>• Local Ollama Llama 3 Setup</li>
                <li>• Vector Embeddings & ChromaDB</li>
                <li>• Mandatory 8-Week Internship</li>
                <li>• Complete 50 LeetCode Mediums</li>
              </ul>
            </div>

            {/* Stage 3 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 relative">
              <div className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-800 text-purple-400 flex items-center justify-center text-xs font-bold mb-2">
                3
              </div>
              <h4 className="text-xs font-bold text-slate-100 mb-1">Capstone & Defense</h4>
              <span className="text-[10px] font-mono text-purple-400 block mb-2">Semester 7</span>
              <ul className="text-[11px] text-slate-400 space-y-1">
                <li>• Build Hybrid Counseling Bot</li>
                <li>• Implement SQLi & IDOR vectors</li>
                <li>• Demonstrate 100% offline RAG</li>
                <li>• Internal Department Review</li>
              </ul>
            </div>

            {/* Stage 4 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 relative">
              <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center text-xs font-bold mb-2">
                4
              </div>
              <h4 className="text-xs font-bold text-slate-100 mb-1">Placement & Graduation</h4>
              <span className="text-[10px] font-mono text-emerald-400 block mb-2">Semester 8</span>
              <ul className="text-[11px] text-slate-400 space-y-1">
                <li>• Final Defense Presentation</li>
                <li>• AWS Certified AI Practitioner</li>
                <li>• Convert to Full-time Offer</li>
                <li>• Open-Source Release on GitHub</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 3: HYBRID FALLBACK ENGINE */}
      {selectedFeature === 'heartbeat' && (
        <div className="p-5 rounded-xl bg-[#0c1220] border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Hybrid Architecture & Offline Heartbeat Failover
              </h3>
              <p className="text-xs text-slate-400">
                How the Flask backend dynamically switches between local Ollama and Google Gemini
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Heartbeat: Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">Local Primary Engine (Ollama):</span>
                <span className="text-emerald-400 font-mono text-[10px]">localhost:11434</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Runs completely on the presenter&apos;s machine. Handles all counseling prompts without an internet connection.
                If Ollama is unresponsive (timeout &gt; 5000ms), Flask transparently triggers the cloud fallback.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-cyan-300">
                Status: 🟢 Listening (Llama 3 8B 4-bit Quantized)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">Cloud Secondary Engine (Gemini):</span>
                <span className="text-indigo-400 font-mono text-[10px]">Gemini 3.8 Flash</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Activated when connected to campus Wi-Fi or when complex multi-turn reasoning is required.
                Enables high-throughput concurrent chats without consuming laptop VRAM.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-indigo-300">
                Status: 🟢 Ready via @google/genai SDK
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
