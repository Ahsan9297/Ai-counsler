import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  Copy, 
  FileText, 
  Calendar, 
  Target, 
  BookOpen, 
  ArrowRight,
  User,
  Sliders,
  Award
} from 'lucide-react';
import { ChatMessage, RoadmapRequest } from '../types';

export const CareerCounselor: React.FC = () => {
  const [profile, setProfile] = useState<RoadmapRequest>({
    degree: 'BS Computer Science',
    year: 'Year 4 (Final Year)',
    interests: 'Applied Generative AI, Full-Stack Python/React, Cybersecurity & Cloud Architecture',
    targetCareer: 'AI Solutions Architect & Cloud Security Engineer',
    cgpa: '3.82',
    budget: 'Medium ($500 for high-impact AWS/Terraform certifications)',
    promptMode: 'advanced_cot',
  });

  const [activeView, setActiveView] = useState<'roadmap' | 'chat'>('roadmap');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState<string | null>(null);
  const [engineUsed, setEngineUsed] = useState<string>('Ready');
  const [copied, setCopied] = useState(false);

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        'Hello Ahsan! I am your AI Career Counselor. I have analyzed your profile: BS Computer Science (Year 4) aiming for an AI Solutions Architect & Cloud Security career. How can we refine your capstone preparation, semester planning, or interview strategy today?',
      timestamp: 'Just now',
    },
  ]);

  // Sample historical sessions
  const [sessions, setSessions] = useState([
    {
      id: 'sess-1',
      title: 'BS CS -> AI Solutions Architect',
      date: 'Today, 10:15 AM',
      active: true,
    },
    {
      id: 'sess-2',
      title: 'Data Science & FinTech Quant Roadmap',
      date: 'Yesterday',
      active: false,
    },
    {
      id: 'sess-3',
      title: 'Cybersecurity Analyst & Red Team Track',
      date: 'Oct 02, 2026',
      active: false,
    },
  ]);

  const handleGenerateRoadmap = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/counsel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedRoadmap(data.roadmap);
        setEngineUsed(data.engineUsed || 'Gemini 3.8 Flash');
        setActiveView('roadmap');
      } else {
        alert(data.error || 'Failed to generate roadmap');
      }
    } catch (err: any) {
      console.error(err);
      alert('Error connecting to backend server.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendChat = async (overridePrompt?: string) => {
    const textToSend = overridePrompt || chatInput;
    if (!textToSend.trim() || isChatting) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatting(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          messages: chatMessages,
          currentContext: {
            degree: profile.degree,
            year: profile.year,
            targetCareer: profile.targetCareer,
            roadmapSummary: generatedRoadmap?.slice(0, 300) || 'AI Solutions Architect',
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsChatting(false);
    }
  };

  const handleCopyRoadmap = () => {
    if (!generatedRoadmap) return;
    navigator.clipboard.writeText(generatedRoadmap);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePresetSelect = (preset: 'ai_architect' | 'software_eng' | 'data_science') => {
    if (preset === 'ai_architect') {
      setProfile({
        degree: 'BS Computer Science',
        year: 'Year 4 (Final Year)',
        interests: 'Applied Generative AI, Full-Stack Python/React, Cybersecurity & Cloud Architecture',
        targetCareer: 'AI Solutions Architect & Cloud Security Engineer',
        cgpa: '3.82',
        budget: 'Medium ($500 for AWS/Terraform exams)',
        promptMode: 'advanced_cot',
      });
    } else if (preset === 'software_eng') {
      setProfile({
        degree: 'BS Software Engineering',
        year: 'Year 3',
        interests: 'Microservices, Distributed Systems, Go, Kubernetes, TypeScript',
        targetCareer: 'Principal Distributed Systems Engineer',
        cgpa: '3.65',
        budget: 'Low (Open source focus)',
        promptMode: 'advanced_cot',
      });
    } else {
      setProfile({
        degree: 'BS Data Science',
        year: 'Year 3',
        interests: 'Quantitative Modeling, Time Series, FinTech, PyTorch, SQL',
        targetCareer: 'Quantitative Risk Analyst & ML Engineer',
        cgpa: '3.70',
        budget: 'Medium',
        promptMode: 'advanced_cot',
      });
    }
  };

  const handleNewSession = () => {
    const newId = `sess-${Date.now()}`;
    const newSession = {
      id: newId,
      title: `${profile.degree} -> ${profile.targetCareer.slice(0, 20)}...`,
      date: 'Just now',
      active: true,
    };
    setSessions((prev) => [newSession, ...prev.map((s) => ({ ...s, active: false }))]);
    setGeneratedRoadmap(null);
    setChatMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `New session started for ${profile.degree}. Fill out the profile parameters or hit 'Generate Comprehensive Roadmap' to run your personalized counseling analysis.`,
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-80px)]">
      {/* Left Sidebar: Session History & Student Profile (3 cols) */}
      <aside className="lg:col-span-3 flex flex-col gap-4">
        {/* New Session Button */}
        <button
          onClick={handleNewSession}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-medium text-xs shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>New Counseling Session</span>
        </button>

        {/* Profile Card */}
        <div className="p-4 rounded-xl bg-[#0c1220] border border-slate-800 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800/80 flex items-center justify-center">
                <User className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-100">Ahsan Nawaz</h4>
                <p className="text-[11px] text-slate-400">University Candidate</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800">
              GPA {profile.cgpa}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800/60 text-xs space-y-1.5 text-slate-300">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Degree:</span>
              <span className="font-medium text-slate-200">{profile.degree}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Academic Year:</span>
              <span className="text-cyan-300 font-mono">{profile.year}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Target Role:</span>
              <span className="text-indigo-300 font-medium truncate max-w-[130px]">
                {profile.targetCareer}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="p-3 rounded-xl bg-[#0c1220] border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Degree Quick Presets
          </span>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => handlePresetSelect('ai_architect')}
              className="w-full text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800/80 transition-all flex items-center justify-between"
            >
              <span>AI Solutions Architect</span>
              <span className="text-[10px] font-mono text-cyan-400">CS Yr 4</span>
            </button>
            <button
              onClick={() => handlePresetSelect('software_eng')}
              className="w-full text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-indigo-300 border border-slate-800/80 transition-all flex items-center justify-between"
            >
              <span>Distributed Systems Eng</span>
              <span className="text-[10px] font-mono text-indigo-400">SE Yr 3</span>
            </button>
            <button
              onClick={() => handlePresetSelect('data_science')}
              className="w-full text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-purple-300 border border-slate-800/80 transition-all flex items-center justify-between"
            >
              <span>FinTech ML / Quant</span>
              <span className="text-[10px] font-mono text-purple-400">DS Yr 3</span>
            </button>
          </div>
        </div>

        {/* Session History */}
        <div className="p-3 rounded-xl bg-[#0c1220] border border-slate-800 flex-1 flex flex-col">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Persistent SQLite Sessions
          </span>
          <div className="space-y-1 overflow-y-auto max-h-[220px] scrollbar-thin">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className={`p-2 rounded-lg text-xs cursor-pointer transition-all border ${
                  sess.active
                    ? 'bg-cyan-950/40 border-cyan-800 text-cyan-200'
                    : 'bg-slate-900/40 border-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-medium truncate">{sess.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{sess.date}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Counseling Workspace (9 cols) */}
      <main className="lg:col-span-9 flex flex-col gap-4">
        {/* Profile Configuration & Generation Bar */}
        <div className="p-4 rounded-xl bg-[#0c1220] border border-slate-800 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Academic & Career Parameter Specification
              </h3>
              <p className="text-xs text-slate-400">
                Feeds into local Ollama (Llama 3) or Gemini 3.8 Flash with structured Chain-of-Thought
              </p>
            </div>

            {/* Prompt Mode Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Prompt Mode:</span>
              <div className="bg-slate-900 p-0.5 rounded-lg border border-slate-800 flex text-xs">
                <button
                  onClick={() => setProfile((p) => ({ ...p, promptMode: 'advanced_cot' }))}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    profile.promptMode === 'advanced_cot'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ⚡ Advanced CoT
                </button>
                <button
                  onClick={() => setProfile((p) => ({ ...p, promptMode: 'naive' }))}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    profile.promptMode === 'naive'
                      ? 'bg-slate-700 text-slate-200 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Naive Baseline
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-medium">Degree & Major</label>
              <input
                type="text"
                value={profile.degree}
                onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-medium">Academic Year</label>
              <input
                type="text"
                value={profile.year}
                onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-medium">Target Career Milestone</label>
              <input
                type="text"
                value={profile.targetCareer}
                onChange={(e) => setProfile({ ...profile, targetCareer: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <div className="md:col-span-2">
              <label className="text-[11px] text-slate-400 block mb-1 font-medium">Core Skills & Interests</label>
              <input
                type="text"
                value={profile.interests}
                onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-medium">CGPA / Grade</label>
              <input
                type="text"
                value={profile.cgpa}
                onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Action trigger */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ready to synthesize 4-phase milestone trajectory</span>
            </div>

            <button
              onClick={handleGenerateRoadmap}
              disabled={isGenerating}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-medium text-xs shadow-md shadow-cyan-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Academic Roadmap...</span>
                </>
              ) : (
                <>
                  <Target className="w-4 h-4" />
                  <span>Generate Comprehensive Roadmap</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* View Switcher: Generated Roadmap vs Continuous Chat */}
        <div className="flex items-center justify-between bg-[#0c1220] p-1.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveView('roadmap')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeView === 'roadmap'
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Personalized Roadmap</span>
              {generatedRoadmap && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => setActiveView('chat')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeView === 'chat'
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Continuous Live Chat Follow-Up</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-300">
                {chatMessages.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 pr-2">
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">Engine:</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
              {engineUsed}
            </span>
          </div>
        </div>

        {/* Content View 1: Roadmap Document */}
        {activeView === 'roadmap' && (
          <div className="p-5 rounded-xl bg-[#0c1220] border border-slate-800 shadow-md flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-semibold text-slate-100 uppercase tracking-wider">
                  Academic Milestones, Technical Stack & Defense Roadmap
                </h4>
              </div>

              {generatedRoadmap && (
                <button
                  onClick={handleCopyRoadmap}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Markdown</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* If roadmap not yet generated */}
            {!generatedRoadmap && !isGenerating && (
              <div className="py-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-800/80 flex items-center justify-center mb-3 text-cyan-400 shadow-lg shadow-cyan-900/30">
                  <Target className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-200 mb-1">
                  Ready to Build Your Career & Defense Roadmap
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Click the button below to generate a university-grade 4-phase trajectory aligned with your degree, CGPA, and career goals.
                </p>
                <button
                  onClick={handleGenerateRoadmap}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-600/30"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Roadmap Now</span>
                </button>
              </div>
            )}

            {isGenerating && (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
                <p className="text-xs font-medium text-slate-200">
                  Running Advanced Chain-of-Thought Reasoning...
                </p>
                <p className="text-[11px] text-slate-400 max-w-sm mt-1">
                  Synthesizing university curriculum constraints, semester timelines, and high-impact capstone specifications.
                </p>
              </div>
            )}

            {generatedRoadmap && !isGenerating && (
              <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-4 max-h-[550px] overflow-y-auto pr-2 scrollbar-thin">
                <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/40 text-cyan-200 text-xs flex items-center justify-between">
                  <span>
                    🎯 <strong>Roadmap Target:</strong> {profile.degree} → {profile.targetCareer}
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-900/50">
                    CGPA: {profile.cgpa}
                  </span>
                </div>

                <div className="prose prose-invert max-w-none text-xs space-y-3 whitespace-pre-wrap font-mono">
                  {generatedRoadmap}
                </div>

                {/* Quick actions for defense */}
                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">
                    Want to explore how to integrate ChromaDB or patch SQLi in this roadmap?
                  </span>
                  <button
                    onClick={() => {
                      setActiveView('chat');
                      handleSendChat('How do I showcase this exact roadmap during my university defense presentation?');
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/80 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Ask AI Counselor for Defense Prep</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content View 2: Continuous Live Chat */}
        {activeView === 'chat' && (
          <div className="p-4 rounded-xl bg-[#0c1220] border border-slate-800 shadow-md flex-1 flex flex-col h-[580px]">
            {/* Quick Follow-up Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none text-xs">
              <span className="text-[11px] text-slate-400 whitespace-nowrap">Suggested:</span>
              <button
                onClick={() =>
                  handleSendChat('What are the top 3 LeetCode patterns I should master for technical interviews?')
                }
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap text-[11px]"
              >
                LeetCode Interview Patterns
              </button>
              <button
                onClick={() =>
                  handleSendChat('How can I explain the SQL Injection exploit and parameterized fix to my professor?')
                }
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap text-[11px]"
              >
                Explain SQLi Defense to Panel
              </button>
              <button
                onClick={() =>
                  handleSendChat('Which certifications should I avoid, and which ones add real value to an AI resume?')
                }
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap text-[11px]"
              >
                Worthwhile vs Scam Certifications
              </button>
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 text-xs ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] p-3 rounded-xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-700 to-indigo-700 text-white rounded-tr-none'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                    <div className="text-[10px] text-slate-400 mt-1.5 flex justify-end">
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-cyan-400">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isChatting && (
                <div className="flex gap-3 text-xs justify-start">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>Counselor is synthesizing response...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-800"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about capstone requirements, study schedules, interview prep, or course selection..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isChatting}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-600/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
