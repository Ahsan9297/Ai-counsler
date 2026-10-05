import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Terminal, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Copy, 
  Check, 
  Play, 
  ArrowRight,
  Eye,
  KeyRound,
  FileCode2,
  CheckCircle2
} from 'lucide-react';
import { SQLiResult, IDORResult } from '../types';
import { CODE_SNIPPETS } from '../data/codeSnippets';

export const CybersecurityLab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'sqli' | 'idor' | 'defense_script'>('sqli');

  // SQLi State
  const [sqliUsername, setSqliUsername] = useState("professor' --");
  const [sqliPassword, setSqliPassword] = useState("random_wrong_password");
  const [sqliMode, setSqliMode] = useState<'vulnerable' | 'patched'>('vulnerable');
  const [sqliResult, setSqliResult] = useState<SQLiResult | null>(null);
  const [isTestingSQLi, setIsTestingSQLi] = useState(false);

  // IDOR State
  const [idorLoggedInUser, setIdorLoggedInUser] = useState<number>(2); // Student Ahsan
  const [idorRequestedUser, setIdorRequestedUser] = useState<number>(1); // Professor
  const [idorMode, setIdorMode] = useState<'vulnerable' | 'patched'>('vulnerable');
  const [idorResult, setIdorResult] = useState<IDORResult | null>(null);
  const [isTestingIDOR, setIsTestingIDOR] = useState(false);

  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRunSQLi = async () => {
    setIsTestingSQLi(true);
    try {
      const response = await fetch('/api/security/test-sqli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: sqliUsername,
          password: sqliPassword,
          mode: sqliMode,
        }),
      });
      const data = await response.json();
      setSqliResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTestingSQLi(false);
    }
  };

  const handleRunIDOR = async () => {
    setIsTestingIDOR(true);
    try {
      const response = await fetch('/api/security/test-idor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loggedInUserId: idorLoggedInUser,
          requestedUserId: idorRequestedUser,
          mode: idorMode,
        }),
      });
      const data = await response.json();
      setIdorResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTestingIDOR(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#170a14] via-[#1b1026] to-[#0c1220] border border-rose-900/40 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h2 className="text-base font-bold text-slate-100">
                Cybersecurity Vulnerability & Defense Verification Lab
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl">
              Live exploit bench for your university capstone defense. Demonstrate the exact attack vectors
              (<strong>SQL Injection</strong> auth bypass and <strong>Insecure Direct Object Reference</strong>),
              observe the AST manipulation, and toggle the secure patches live.
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveSubTab('sqli')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'sqli'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SQLi Exploit & Patch
            </button>
            <button
              onClick={() => setActiveSubTab('idor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'idor'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              IDOR Exploit & Patch
            </button>
            <button
              onClick={() => setActiveSubTab('defense_script')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'defense_script'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Defense Panel Q&A Script
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. SQL INJECTION (SQLi) LAB */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'sqli' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Attack Form (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-xl bg-[#0c1220] border border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-rose-400" />
                SQL Injection (SQLi) Test Bench
              </h3>
              {/* Vulnerable vs Patched Toggle */}
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setSqliMode('vulnerable')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    sqliMode === 'vulnerable'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🔴 Vulnerable
                </button>
                <button
                  onClick={() => setSqliMode('patched')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    sqliMode === 'patched'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🟢 Patched
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              {sqliMode === 'vulnerable'
                ? 'Backend is currently executing raw f-strings: query = f"SELECT * FROM users WHERE username = \'{username}\' AND password = \'{password}\'"'
                : 'Backend is currently using parameterized prepared statements: cursor.execute("SELECT ... WHERE username = ? AND password = ?", (u, p))'}
            </p>

            {/* Input Form */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Username Input (Injection Vector)
                </label>
                <input
                  type="text"
                  value={sqliUsername}
                  onChange={(e) => setSqliUsername(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-rose-300 font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Password Input (Arbitrary String)
                </label>
                <input
                  type="text"
                  value={sqliPassword}
                  onChange={(e) => setSqliPassword(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Quick Attack Payloads */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5">
                  Pre-configured Exploit Payloads:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => {
                      setSqliUsername("professor' --");
                      setSqliPassword('any_random_pass');
                    }}
                    className="px-2 py-1 text-[11px] font-mono rounded bg-slate-900 hover:bg-slate-800 text-rose-400 border border-rose-900/60"
                  >
                    professor&apos; --
                  </button>
                  <button
                    onClick={() => {
                      setSqliUsername("admin' --");
                      setSqliPassword('foo');
                    }}
                    className="px-2 py-1 text-[11px] font-mono rounded bg-slate-900 hover:bg-slate-800 text-rose-400 border border-rose-900/60"
                  >
                    admin&apos; --
                  </button>
                  <button
                    onClick={() => {
                      setSqliUsername("' OR '1'='1' --");
                      setSqliPassword('bar');
                    }}
                    className="px-2 py-1 text-[11px] font-mono rounded bg-slate-900 hover:bg-slate-800 text-rose-400 border border-rose-900/60"
                  >
                    &apos; OR &apos;1&apos;=&apos;1&apos; --
                  </button>
                </div>
              </div>

              <button
                onClick={handleRunSQLi}
                disabled={isTestingSQLi}
                className={`w-full py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all ${
                  sqliMode === 'vulnerable'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                }`}
              >
                {isTestingSQLi ? (
                  <span>Executing Query on SQLite...</span>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>
                      {sqliMode === 'vulnerable' ? 'Trigger SQLi Exploit' : 'Test Parameterized Defense'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results & AST Breakdown (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Executed Query & Exploit Status Card */}
            <div className="p-5 rounded-xl bg-[#0c1220] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  Database Query & Execution Output
                </span>
                {sqliResult && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      sqliResult.isExploited
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {sqliResult.isExploited ? '🚨 AUTHENTICATION BYPASSED' : '🛡️ ATTACK BLOCKED'}
                  </span>
                )}
              </div>

              {!sqliResult && !isTestingSQLi && (
                <div className="py-8 text-center text-xs text-slate-400">
                  Click &apos;Trigger SQLi Exploit&apos; to view the live database response, raw executed SQL string, and AST analysis.
                </div>
              )}

              {sqliResult && (
                <div className="space-y-3">
                  {/* Executed SQL String */}
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Raw Query Dispatched to SQLite Engine:
                    </span>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-rose-300 whitespace-pre-wrap break-all">
                      {sqliResult.executedQuery}
                    </div>
                  </div>

                  {/* Vulnerability Analysis */}
                  <div
                    className={`p-3 rounded-lg text-xs leading-relaxed ${
                      sqliResult.isExploited
                        ? 'bg-rose-950/20 border border-rose-800/40 text-rose-200'
                        : 'bg-emerald-950/20 border border-emerald-800/40 text-emerald-200'
                    }`}
                  >
                    {sqliResult.vulnerabilityAnalysis}
                  </div>

                  {/* Leaked User Account if bypassed */}
                  {sqliResult.user && (
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-rose-700/60 text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-rose-300 text-xs flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          UNAUTHORIZED ACCOUNT ACCESS GRANTED:
                        </span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                          Role: {sqliResult.user.role}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                        <div>
                          <span className="text-slate-400">Name:</span> {sqliResult.user.name}
                        </div>
                        <div>
                          <span className="text-slate-400">Username:</span> {sqliResult.user.username}
                        </div>
                        <div>
                          <span className="text-slate-400">Degree:</span> {sqliResult.user.degree}
                        </div>
                        <div>
                          <span className="text-slate-400">Goal:</span> {sqliResult.user.career_goal}
                        </div>
                        <div className="col-span-2 pt-2 border-t border-slate-800 text-rose-400 font-mono">
                          <strong>Exposed Confidential Notes:</strong> {sqliResult.user.private_notes}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Remediation Patch Code Card */}
            <div className="p-5 rounded-xl bg-[#0c1220] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Exact Secure Patch (Python SQLite3 Parameterization)
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      sqliResult?.remediationSnippet ||
                        `cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))`,
                      'sqli_patch'
                    )
                  }
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800 cursor-pointer"
                >
                  {copied === 'sqli_patch' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied === 'sqli_patch' ? 'Copied' : 'Copy Patch'}</span>
                </button>
              </div>

              <pre className="p-3 rounded-xl bg-slate-950 text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {sqliResult?.remediationSnippet ||
                  `# SECURE IMPLEMENTATION (Python SQLite3):
cursor = conn.cursor()
# The '?' marks parameters. SQLite compiles the AST first, treating input strictly as data:
cursor.execute(
    "SELECT id, username, role, degree FROM users WHERE username = ? AND password_hash = ?",
    (username, hashed_password)
)
user = cursor.fetchone()`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. INSECURE DIRECT OBJECT REFERENCE (IDOR) LAB */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'idor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & URL Parameter Tamper (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-xl bg-[#0c1220] border border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Unlock className="w-4 h-4 text-amber-400" />
                IDOR URL Parameter Tamper Bench
              </h3>
              {/* Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setIdorMode('vulnerable')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    idorMode === 'vulnerable'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🔴 Vulnerable
                </button>
                <button
                  onClick={() => setIdorMode('patched')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    idorMode === 'patched'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🟢 Patched
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              {idorMode === 'vulnerable'
                ? 'Backend endpoint blindly queries SQLite using whatever user ID is passed in the query string: user_id = request.args.get(\'view_user\')'
                : 'Backend strictly validates logged-in session: if requested_id != session.get(\'user_id\') and role != \'admin\': abort(403)'}
            </p>

            {/* Simulation Parameters */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Current Logged-in Session (Who is in the browser)
                </label>
                <select
                  value={idorLoggedInUser}
                  onChange={(e) => setIdorLoggedInUser(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value={2}>User 2: Ahsan Nawaz (Role: Student)</option>
                  <option value={3}>User 3: Sarah Khan (Role: Student)</option>
                  <option value={1}>User 1: Dr. Evelyn Martinez (Role: Professor)</option>
                  <option value={4}>User 4: IT Services (Role: Admin)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Tampered URL Parameter (<code>?view_user=...</code>)
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-400">/dashboard?view_user=</span>
                  <input
                    type="number"
                    value={idorRequestedUser}
                    onChange={(e) => setIdorRequestedUser(Number(e.target.value))}
                    min={1}
                    max={4}
                    className="w-20 px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Quick Tamper Presets */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5">
                  Simulate Attacker Parameter Manipulation:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setIdorRequestedUser(1)}
                    className="px-2 py-1 text-[11px] font-mono rounded bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-900/60"
                  >
                    ?view_user=1 (Professor)
                  </button>
                  <button
                    onClick={() => setIdorRequestedUser(4)}
                    className="px-2 py-1 text-[11px] font-mono rounded bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-900/60"
                  >
                    ?view_user=4 (Root Admin)
                  </button>
                  <button
                    onClick={() => setIdorRequestedUser(3)}
                    className="px-2 py-1 text-[11px] font-mono rounded bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-900/60"
                  >
                    ?view_user=3 (Peer Student)
                  </button>
                </div>
              </div>

              <button
                onClick={handleRunIDOR}
                disabled={isTestingIDOR}
                className={`w-full py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all ${
                  idorMode === 'vulnerable'
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                }`}
              >
                {isTestingIDOR ? (
                  <span>Evaluating Session Permissions...</span>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>
                      {idorMode === 'vulnerable' ? 'Attempt IDOR Parameter Access' : 'Test Session Auth Patch'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* IDOR Output (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="p-5 rounded-xl bg-[#0c1220] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  Authorization Engine Audit Log
                </span>
                {idorResult && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      idorResult.isExploited
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {idorResult.isExploited ? '🚨 IDOR DATA BREACH' : '🛡️ ACCESS RESTRICTED'}
                  </span>
                )}
              </div>

              {!idorResult && !isTestingIDOR && (
                <div className="py-8 text-center text-xs text-slate-400">
                  Select a target user ID and test whether unauthorized confidential roadmaps are leaked.
                </div>
              )}

              {idorResult && (
                <div className="space-y-3">
                  <div
                    className={`p-3 rounded-lg text-xs leading-relaxed ${
                      idorResult.isExploited
                        ? 'bg-amber-950/20 border border-amber-800/40 text-amber-200'
                        : 'bg-emerald-950/20 border border-emerald-800/40 text-emerald-200'
                    }`}
                  >
                    {idorResult.analysis}
                  </div>

                  {/* Leaked Record */}
                  {idorResult.retrievedRecord && (
                    <div className="p-4 rounded-xl bg-slate-900 border border-amber-800/60 text-xs space-y-2">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                        <span className="font-bold text-amber-300">
                          RECORD DISCLOSED (User ID #{idorResult.retrievedRecord.id}):
                        </span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                          {idorResult.retrievedRecord.role.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                        <div>
                          <strong>Name:</strong> {idorResult.retrievedRecord.name}
                        </div>
                        <div>
                          <strong>Username:</strong> {idorResult.retrievedRecord.username}
                        </div>
                        <div>
                          <strong>Degree:</strong> {idorResult.retrievedRecord.degree}
                        </div>
                        <div>
                          <strong>CGPA:</strong> {idorResult.retrievedRecord.cgpa}
                        </div>
                        <div className="col-span-2 pt-1 border-t border-slate-800">
                          <strong>Private Roadmap:</strong> {idorResult.retrievedRecord.roadmap_summary}
                        </div>
                        <div className="col-span-2 font-mono text-amber-400">
                          <strong>Leaked Confidential Notes:</strong> {idorResult.retrievedRecord.private_notes}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Remediation Patch Card */}
            <div className="p-5 rounded-xl bg-[#0c1220] border border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Exact IDOR Mitigation Patch (Flask Session RBAC)
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      idorResult?.patchCode ||
                        `logged_in_id = session.get('user_id')\nif requested_id != logged_in_id and session.get('role') != 'admin': abort(403)`,
                      'idor_patch'
                    )
                  }
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800 cursor-pointer"
                >
                  {copied === 'idor_patch' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied === 'idor_patch' ? 'Copied' : 'Copy Patch'}</span>
                </button>
              </div>

              <pre className="p-3 rounded-xl bg-slate-950 text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {idorResult?.patchCode ||
                  `# SECURE ROUTE IMPLEMENTATION (app.py):
from flask import session, abort, request

@app.route('/dashboard')
def dashboard():
    logged_in_id = session.get('user_id')
    if not logged_in_id:
        return redirect('/login')

    requested_id = request.args.get('view_user', logged_in_id, type=int)

    # STRICT IDOR CHECK: Only allow own profile or verified admin
    if requested_id != logged_in_id and session.get('role') != 'admin':
        abort(403) # 403 Forbidden Access Intercept

    return render_template('dashboard.html', profile=db.get_user_profile(requested_id))`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. DEFENSE PANEL PRESENTATION SCRIPT */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'defense_script' && (
        <div className="p-6 rounded-xl bg-[#0c1220] border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-cyan-400" />
                University Defense Panel Presentation Guide & Defense Script
              </h3>
              <p className="text-xs text-slate-400">
                Word-for-word talking points to blow away your professor and external examination panel
              </p>
            </div>

            <button
              onClick={() => handleCopy(CODE_SNIPPETS.defense_walkthrough, 'defense_walkthrough')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 cursor-pointer"
            >
              {copied === 'defense_walkthrough' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Full Defense Script</span>
            </button>
          </div>

          <div className="prose prose-invert max-w-none text-xs space-y-4 font-mono leading-relaxed bg-slate-950 p-4 rounded-xl overflow-y-auto max-h-[500px]">
            {CODE_SNIPPETS.defense_walkthrough}
          </div>
        </div>
      )}
    </div>
  );
};
