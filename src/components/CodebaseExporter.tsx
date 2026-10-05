import React, { useState } from 'react';
import { 
  Code2, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  FolderGit2, 
  CheckCircle2, 
  FileText
} from 'lucide-react';
import { CODE_SNIPPETS } from '../data/codeSnippets';

export const CodebaseExporter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<
    'app_py' | 'database_py' | 'rag_pipeline_py' | 'system_prompts_py' | 'defense_walkthrough'
  >('app_py');
  const [copied, setCopied] = useState(false);

  const fileTabs = [
    { id: 'app_py', name: 'app.py', desc: 'Flask Server & Auth Routes', icon: FileCode },
    { id: 'database_py', name: 'database.py', desc: 'SQLite Tables & Secure Queries', icon: FileCode },
    { id: 'rag_pipeline_py', name: 'rag_pipeline.py', desc: 'ChromaDB Offline Vector RAG', icon: FileCode },
    { id: 'system_prompts_py', name: 'system_prompts.py', desc: 'Advanced CoT Prompt Templates', icon: FileCode },
    { id: 'defense_walkthrough', name: 'defense_walkthrough.md', desc: 'University Defense Guide', icon: FileText },
  ] as const;

  const currentContent = CODE_SNIPPETS[selectedFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = fileTabs.find((f) => f.id === selectedFile)?.name || 'code.txt';
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0c1220] via-[#101b33] to-[#0c1220] border border-cyan-900/40 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FolderGit2 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-slate-100">
                Complete Python / Flask Repository Codebase
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl">
              Drop these pristine, production-ready Python files directly into your local project.
              Includes both the vulnerable routes for your live demonstration and the secure patched implementations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied File!' : 'Copy File'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-md shadow-cyan-600/30 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code Viewer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* File Tree (3 cols) */}
        <div className="lg:col-span-3 p-4 rounded-xl bg-[#0c1220] border border-slate-800 flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Project Files
          </span>
          <div className="space-y-1">
            {fileTabs.map((f) => {
              const Icon = f.icon;
              const isActive = selectedFile === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFile(f.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-start gap-2.5 cursor-pointer border ${
                    isActive
                      ? 'bg-cyan-950/40 border-cyan-800/80 text-cyan-200'
                      : 'bg-slate-900/40 border-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <div>
                    <div className="font-mono font-medium">{f.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{f.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs">
            <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">
              Requirements (<code>pip install</code>):
            </span>
            <pre className="p-2.5 rounded-lg bg-slate-950 text-[10px] font-mono text-cyan-300 leading-relaxed overflow-x-auto">
{`flask>=3.0.0
requests>=2.31.0
chromadb>=0.4.24
pypdf>=4.0.0
sentence-transformers>=2.3.0
bcrypt>=4.1.0`}
            </pre>
          </div>
        </div>

        {/* Code Content (9 cols) */}
        <div className="lg:col-span-9 p-5 rounded-xl bg-[#0c1220] border border-slate-800 shadow-md flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-200">
                {fileTabs.find((f) => f.id === selectedFile)?.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                {selectedFile.endsWith('_md') ? 'Markdown' : 'Python 3.10+'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {currentContent.split('\n').length} lines
            </span>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 whitespace-pre overflow-x-auto max-h-[620px] scrollbar-thin leading-relaxed">
            {currentContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
