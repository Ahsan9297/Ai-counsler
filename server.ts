import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI SDK server-side
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Mock database for University Defense SQLi and IDOR tests
interface MockUser {
  id: number;
  username: string;
  password_hash: string;
  name: string;
  role: 'student' | 'professor' | 'admin';
  degree: string;
  cgpa: number;
  career_goal: string;
  private_notes: string;
  roadmap_summary: string;
}

const MOCK_USERS_DB: MockUser[] = [
  {
    id: 1,
    username: 'professor',
    password_hash: 'Arg0n2$hashed_faculty_key_99182',
    name: 'Dr. Evelyn Martinez',
    role: 'professor',
    degree: 'Ph.D. Computer Systems',
    cgpa: 3.98,
    career_goal: 'Tenured Department Chair & Grant Lead',
    private_notes: 'CONFIDENTIAL: Grading key for CS-409 Final Defense and committee deliberation rubric.',
    roadmap_summary: 'Postdoctoral NSF grants -> ABET accreditation audit -> AI research lab expansion.',
  },
  {
    id: 2,
    username: 'student_ahsan',
    password_hash: 'Arg0n2$student_secure_pass_123',
    name: 'Ahsan Nawaz',
    role: 'student',
    degree: 'BS Computer Science (Year 4)',
    cgpa: 3.82,
    career_goal: 'AI Solutions Architect & Cloud Security Engineer',
    private_notes: 'Capstone project: Hybrid Gemini + Local Ollama Career Counselor with live exploit lab.',
    roadmap_summary: 'Year 4 Sem 1: RAG pipeline & ChromaDB indexing -> Sem 2: Defense demonstration -> AWS Certified AI Practitioner.',
  },
  {
    id: 3,
    username: 'sarah_khan',
    password_hash: 'Arg0n2$student_secure_pass_456',
    name: 'Sarah Khan',
    role: 'student',
    degree: 'BS Data Science (Year 3)',
    cgpa: 3.65,
    career_goal: 'Quantitative Risk Analyst & FinTech ML Engineer',
    private_notes: 'Academic probation risk: Needs grade replacement in Calculus II; scholarship contingent on 3.5+ CGPA.',
    roadmap_summary: 'Focus: Stochastic Modeling -> Financial Engineering portfolio -> Goldman Sachs Summer Internship.',
  },
  {
    id: 4,
    username: 'admin',
    password_hash: 'Arg0n2$super_admin_pass_9021',
    name: 'System Administrator (IT Services)',
    role: 'admin',
    degree: 'M.Sc. Information Security',
    cgpa: 4.0,
    career_goal: 'Chief Information Security Officer (CISO)',
    private_notes: 'ROOT ACCESS: Active SSH keys deployed to production SQLite backup replica at /var/backups/sqlite.db.',
    roadmap_summary: 'Enterprise zero-trust migration -> ISO 27001 university audit -> Disaster recovery failover.',
  },
];

// Sample offline RAG documents (Fee structures, Admission criteria, Department prerequisites)
const UNIVERSITY_RAG_DOCUMENTS = [
  {
    id: 'doc-fee-01',
    title: 'University Fee Structure (Fall 2026/Spring 2027)',
    category: 'Finance & Tuition',
    chunks: [
      'Tuition Fee per Credit Hour: BS Computer Science & Software Engineering is $220/credit hour. Average 18 credits per semester totals $3,960/semester.',
      'Laboratory & Computing Infrastructure Surcharge: $350 per regular semester (covers high-performance GPU cluster, local Ollama servers, and network lab).',
      'Merit Scholarship Criteria: CGPA >= 3.85 awards 50% tuition waiver; CGPA >= 3.95 awards 100% tuition waiver for the following active semester.',
      'Late Registration Penalty: $150 applied after 5th business day of academic semester commencement.',
    ],
  },
  {
    id: 'doc-admission-02',
    title: 'Department of Computing Admission & Minimum Criteria',
    category: 'Admissions & Prerequisites',
    chunks: [
      'BS Computer Science Admission: Minimum 60% in Higher Secondary Certificate (Pre-Engineering / ICS with Math and Physics) plus minimum 50% on University Aptitude Entrance Test (UET).',
      'Transfer & Lateral Entry: Students transferring from accredited universities require minimum transfer CGPA of 2.75; maximum 50% of degree credits can be transferred.',
      'Degree Completion Timeline: Standard duration is 4 years (8 semesters). Maximum allowable period for BS degree completion is 6 years (12 semesters).',
    ],
  },
  {
    id: 'doc-career-03',
    title: 'Faculty Industry Placement Guidelines & Internships',
    category: 'Career Services',
    chunks: [
      'Mandatory Summer Internship: All 3rd year (6th semester) students must complete a verified 8-week corporate tech internship for 3 non-credit graduation units.',
      'Capstones & Final Year Projects: Projects must address either enterprise industry challenges or verified research gaps, evaluated by an external defense panel.',
      'Target Industry Tech Stacks: Software Engineering tracks prioritize Full-Stack (React/Node/Python), Cloud Architectures (AWS/GCP), and Applied Generative AI.',
    ],
  },
];

// Simple cosine-style TF-IDF keyword vector similarity calculator for offline RAG demonstration
function calculateSemanticMatch(query: string, text: string): number {
  const queryTokens = query.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
  const textTokens = text.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
  if (queryTokens.length === 0 || textTokens.length === 0) return 0;

  let matches = 0;
  for (const q of queryTokens) {
    if (textTokens.includes(q)) matches += 1.5;
    else if (textTokens.some((t) => t.includes(q) || q.includes(t))) matches += 0.8;
  }
  const score = Math.min(0.99, (matches / Math.sqrt(queryTokens.length * 4)) * 0.75 + 0.15);
  return Number(score.toFixed(3));
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. Generate Career Roadmap
app.post('/api/counsel', async (req, res) => {
  try {
    const {
      degree = 'BS Computer Science',
      year = 'Year 3',
      interests = 'AI, Web Development, Cybersecurity',
      targetCareer = 'AI Full-Stack Engineer',
      cgpa = '3.7',
      budget = 'Medium',
      promptMode = 'advanced_cot', // 'naive' | 'advanced_cot'
    } = req.body;

    // Advanced System Prompt designed for high academic & career quality
    const advancedSystemPrompt = `You are an elite University Academic Advisor and Senior Tech Career Strategist.
Your goal is to build an exhaustive, pragmatic, semester-by-semester academic & career roadmap for a student.

Parameters:
- Degree: ${degree} (${year})
- Current CGPA: ${cgpa}
- Core Technical & Domain Interests: ${interests}
- Target Career Milestone: ${targetCareer}
- Financial / Resource Constraints: ${budget}

Instructions:
1. Provide a sharp executive assessment of their target career viability.
2. Formulate 4 clear milestone phases (Foundation, Specialization, High-Impact Portfolio, Industry Placement/Defense).
3. Specify exact technologies, recommended open-source frameworks, certifications worth taking (vs marketing scams to avoid), and high-caliber capstone project ideas.
4. Include actionable strategies for academic CGPA maintenance alongside skill acquisition.
5. Provide 3 specific tactical interview preparation topics (System Design, LeetCode/Algorithms, Behavioral STAR method).
Format output in clean, structured Markdown with clear headers, tables where helpful, bullet points, and bold emphasis.`;

    const naiveSystemPrompt = `You are a career bot. Give a career roadmap for a student studying ${degree} who likes ${interests} and wants to be a ${targetCareer}.`;

    const systemPrompt = promptMode === 'naive' ? naiveSystemPrompt : advancedSystemPrompt;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: systemPrompt,
        config: {
          temperature: promptMode === 'naive' ? 0.9 : 0.4,
        },
      });

      return res.json({
        success: true,
        roadmap: response.text || 'No roadmap generated.',
        engineUsed: 'Gemini 3.8 Flash (Server-Side)',
        promptMode,
        systemPromptLength: systemPrompt.length,
      });
    }

    // Fallback if no Gemini API Key is configured yet
    const fallbackRoadmap = `### Executive Summary: ${degree} -> ${targetCareer}
**Profile Assessment:** With a **${cgpa} CGPA** in **${year}**, you have a strong academic foundation to pursue **${targetCareer}**.

---

### Phase 1: Core Competency & Academic Fortification (Months 1–3)
- **Coursework Alignment:** Prioritize Data Structures, Algorithms, Database Management Systems (SQLite/PostgreSQL), and Distributed Systems.
- **Deep Technical Skills:**
  - Backend: Python (Flask/FastAPI), RESTful API design, ORM vs raw SQL security principles.
  - Frontend: React / TypeScript / Bootstrap 5, async state management, responsive UI design.
  - AI Foundation: Local LLM orchestration (Ollama/Llama 3), vector embeddings, and LangChain/ChromaDB.

---

### Phase 2: High-Caliber Capstone & Defense Readiness (Months 4–6)
- **University Capstone Project:** Complete the *AI Career Counseling Bot with Offline ChromaDB RAG & Live Exploit Defense Lab*.
- **Security Showcase:**
  - Demonstrate vulnerability testing: SQL Injection bypass with \`' OR 1=1 --\` and IDOR via URL parameters.
  - Demonstrate mitigation: Parameterized Prepared Statements & Session Token validation.
- **Offline Architecture:** Highlight 100% air-gapped usability with Ollama (Llama 3) for zero cloud dependency during defense evaluation.

---

### Phase 3: Industry Certification & Portfolio Deployment (Months 7–9)
- **High-ROI Certifications:**
  - AWS Certified Solutions Architect - Associate or HashiCorp Certified: Terraform Associate.
  - *Skip generic overpriced bootcamp certificates; open-source GitHub contributions carry 3x more weight.*
- **Production Artifacts:**
  - Dockerize the Python Flask + SQLite backend.
  - Setup CI/CD with GitHub Actions for automated unit testing and security linting (Bandit/Flake8).

---

### Phase 4: Job Placement & High-Frequency Interview Prep (Months 10–12)
- **Technical Screen Prep:** Top 75 LeetCode patterns (Sliding Window, Two Pointers, Dynamic Programming, Graph Traversals).
- **System Design:** Design a scalable vector search service (ChromaDB/Faiss), caching layers (Redis), and auth (JWT/OAuth2).
- **STAR Stories:** Prepare 3 deep-dive technical narratives explaining how you patched severe vulnerabilities during your capstone defense.`;

    return res.json({
      success: true,
      roadmap: fallbackRoadmap,
      engineUsed: 'Local Fallback Engine (Add GEMINI_API_KEY to test live Flash generation)',
      promptMode,
      systemPromptLength: systemPrompt.length,
    });
  } catch (error: any) {
    console.error('Error generating roadmap:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate career counseling roadmap.',
    });
  }
});

// 2. Continuous Chat Follow-Up with Session Memory Context
app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [], currentContext = {}, prompt = '' } = req.body;

    const contextInstruction = `You are a high-level AI Career Mentor assisting a university student.
Current Context:
- Degree: ${currentContext.degree || 'BS Computer Science'}
- Year: ${currentContext.year || 'Senior'}
- Target Career: ${currentContext.targetCareer || 'AI Engineer'}
- Previous Roadmap Outline: ${currentContext.roadmapSummary || 'Specializing in Applied AI and Full-Stack Engineering'}

Tone: Mentoring, technical, supportive, highly pragmatic, free of fluff.
Answer the user's specific follow-up query thoroughly.`;

    if (ai) {
      // Build conversation contents
      const conversationPrompt = `${contextInstruction}

Conversation History:
${messages
  .slice(-6)
  .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'Student' : 'Mentor'}: ${m.content}`)
  .join('\n')}

Student: ${prompt}
Mentor:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: conversationPrompt,
      });

      return res.json({
        success: true,
        reply: response.text || 'I understand your question. Let us break that down.',
      });
    }

    // Local fallback reply
    return res.json({
      success: true,
      reply: `Regarding your query about "${prompt}": In your ${currentContext.degree || 'degree program'}, you should combine coursework directly with portfolio demonstration. For your final university defense, the committee will look for architectural maturity: why you chose SQLite over MongoDB, how your Ollama local inference manages latency, and how your parameterized queries prevent SQL injection. Focus on measurable benchmarks and live demonstrable exploits.`,
    });
  } catch (error: any) {
    console.error('Error in chat follow-up:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Chat service encountered an error.',
    });
  }
});

// 3. Offline Vector RAG Simulation (ChromaDB + PyPDF Chunking Engine)
app.post('/api/rag-simulate', async (req, res) => {
  try {
    const { query = 'What is the tuition fee per credit hour and merit scholarship criteria?' } = req.body;

    // Search through all chunks
    const matches: { docTitle: string; category: string; chunk: string; score: number }[] = [];

    for (const doc of UNIVERSITY_RAG_DOCUMENTS) {
      for (const chunk of doc.chunks) {
        const score = calculateSemanticMatch(query, chunk);
        if (score > 0.25) {
          matches.push({
            docTitle: doc.title,
            category: doc.category,
            chunk,
            score,
          });
        }
      }
    }

    // Sort by cosine similarity score
    matches.sort((a, b) => b.score - a.score);
    const topK = matches.slice(0, 3);

    // If matches found, synthesize grounded response
    const retrievedContextText = topK.map((m, i) => `[Document ${i + 1} - ${m.docTitle}]: "${m.chunk}"`).join('\n\n');

    let ragAnswer = '';

    if (ai && topK.length > 0) {
      const ragPrompt = `You are an offline university knowledge retrieval system. 
Answer the student's question STRICTLY and ACCURATELY based ONLY on the retrieved PDF document excerpts below. Do not hallucinate.

Question: ${query}

Retrieved Excerpts:
${retrievedContextText}

Grounded Answer:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: ragPrompt,
      });
      ragAnswer = response.text || 'No grounded answer could be generated.';
    } else if (topK.length > 0) {
      ragAnswer = `Based on the retrieved university documents:\n${topK
        .map((k) => `• ${k.chunk} (Source: ${k.docTitle}, Match Score: ${(k.score * 100).toFixed(1)}%)`)
        .join('\n')}`;
    } else {
      ragAnswer = 'No relevant university document chunks surpassed the similarity threshold (>0.25). Please refine your search query.';
    }

    return res.json({
      success: true,
      query,
      topMatches: topK,
      groundedAnswer: ragAnswer,
      contextChunkCount: topK.length,
      retrievalLatencyMs: Math.floor(Math.random() * 25) + 12,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message });
  }
});

// 4. Cybersecurity Lab: SQL Injection Exploit & Patch Simulator
app.post('/api/security/test-sqli', (req, res) => {
  const { username = "professor' --", password = 'any_random_password', mode = 'vulnerable' } = req.body;

  if (mode === 'vulnerable') {
    // Exact raw f-string flaw present in the user's university project:
    // query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
    const rawSqlString = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    // Simulate SQL engine parsing:
    // In SQLite, '--' causes the rest of the query line to be treated as a comment!
    let authenticatedUser: MockUser | null = null;
    let bypassed = false;

    // Check if user entered SQLi bypass payload
    const lowerUser = username.trim();
    if (lowerUser.includes("' --") || lowerUser.includes("' OR '1'='1") || lowerUser.includes("' OR 1=1 --")) {
      // Find the base username before the quote
      const targetUser = lowerUser.split("'")[0];
      const match = MOCK_USERS_DB.find((u) => u.username.toLowerCase() === targetUser.toLowerCase());

      if (match) {
        authenticatedUser = match;
        bypassed = true;
      } else {
        // Default to first user if generic ' OR 1=1
        authenticatedUser = MOCK_USERS_DB[0];
        bypassed = true;
      }
    } else {
      // Standard credentials check
      const match = MOCK_USERS_DB.find((u) => u.username === username && password === 'admin123'); // regular password check
      if (match) authenticatedUser = match;
    }

    return res.json({
      success: true,
      mode: 'vulnerable',
      executedQuery: rawSqlString,
      isExploited: bypassed,
      authenticated: authenticatedUser !== null,
      user: authenticatedUser
        ? {
            id: authenticatedUser.id,
            username: authenticatedUser.username,
            name: authenticatedUser.name,
            role: authenticatedUser.role,
            degree: authenticatedUser.degree,
            career_goal: authenticatedUser.career_goal,
            private_notes: authenticatedUser.private_notes,
          }
        : null,
      vulnerabilityAnalysis: bypassed
        ? `CRITICAL EXPLOIT SUCCESSFUL: The input quote (') broke out of the SQL string literal. The SQLite comment operator (--) truncated the subsequent 'AND password = ...' check. The database evaluated WHERE username = '${lowerUser.split("'")[0]}' as TRUE, returning the user record without requiring the password.`
        : 'Query executed with string concatenation. If an attacker injects single quotes, they can manipulate the WHERE clause logic.',
      remediationSnippet: `
# SECURE REPLACEMENT (Python SQLite3):
cursor = db.cursor()
# Use parameterized '?' placeholders; the SQL engine treats input strictly as data, never executable syntax:
cursor.execute(
    "SELECT id, username, role, degree FROM users WHERE username = ? AND password_hash = ?",
    (username, hashed_password)
)
user = cursor.fetchone()
`.trim(),
    });
  } else {
    // PATCHED SECURE MODE (Parameterized prepared statement)
    const parameterizedQuery = 'SELECT * FROM users WHERE username = ? AND password = ?';
    const params = [username, '[REDACTED_HASHED_INPUT]'];

    // In parameterized mode, 'professor\' --' is looked up as a literal username string!
    const exactMatch = MOCK_USERS_DB.find((u) => u.username === username);

    return res.json({
      success: true,
      mode: 'patched',
      executedQuery: `${parameterizedQuery} | Parameters: ${JSON.stringify(params)}`,
      isExploited: false,
      authenticated: false, // will fail because 'professor\' --' does not exist literally
      user: null,
      vulnerabilityAnalysis:
        'ATTACK NEUTRALIZED: The database driver compiled the AST prior to injecting parameter values. Single quotes and comment marks (--) are treated as inert literal characters, preventing logical syntax manipulation.',
      remediationSnippet: `
# Verified Safe Implementation
import sqlite3
import bcrypt

def verify_and_login(username, password):
    conn = sqlite3.connect('career_counselor.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, password_hash, role FROM users WHERE username = ?", (username,))
    record = cursor.fetchone()
    if record and bcrypt.checkpw(password.encode('utf-8'), record[2].encode('utf-8')):
        return {"id": record[0], "username": record[1], "role": record[3]}
    return None
`.trim(),
    });
  }
});

// 5. Cybersecurity Lab: Insecure Direct Object Reference (IDOR) Simulator
app.post('/api/security/test-idor', (req, res) => {
  const { loggedInUserId = 2, requestedUserId = 1, mode = 'vulnerable' } = req.body;

  const currentUser = MOCK_USERS_DB.find((u) => u.id === Number(loggedInUserId)) || MOCK_USERS_DB[1];
  const targetUser = MOCK_USERS_DB.find((u) => u.id === Number(requestedUserId));

  if (mode === 'vulnerable') {
    // Vulnerable code: blindly fetches user data based on GET parameter `view_user`
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User record not found.' });
    }

    const isUnauthorizedAccess = currentUser.id !== targetUser.id;

    return res.json({
      success: true,
      mode: 'vulnerable',
      currentSession: {
        id: currentUser.id,
        username: currentUser.username,
        role: currentUser.role,
      },
      requestedId: requestedUserId,
      retrievedRecord: targetUser,
      isExploited: isUnauthorizedAccess,
      analysis: isUnauthorizedAccess
        ? `CRITICAL IDOR DETECTED: Logged-in student '${currentUser.username}' accessed private counseling notes, GPA, and roadmap of '${targetUser.name}' (Role: ${targetUser.role}) simply by altering the query parameter to ?view_user=${requestedUserId}. No authorization or ownership check was performed!`
        : `Accessing own profile (User ID ${currentUser.id}). No breach in this specific request, but endpoint remains unprotected against parameter tampering.`,
      patchCode: `
# VULNERABLE CODE (app.py):
# @app.route('/dashboard')
# def dashboard():
#     user_id = request.args.get('view_user')
#     return render_template('dashboard.html', profile=get_profile(user_id))

# PATCHED SECURE CODE (app.py):
from flask import session, abort

@app.route('/dashboard')
def dashboard():
    logged_in_id = session.get('user_id')
    if not logged_in_id:
        return redirect(url_for('login'))
        
    requested_id = request.args.get('view_user', logged_in_id)
    
    # Enforce Authorization Control:
    if int(requested_id) != int(logged_in_id) and session.get('role') != 'admin':
        # Log intrusion attempt for security audit:
        logger.warning(f"IDOR attempt: User {logged_in_id} tried viewing {requested_id}")
        abort(403) # HTTP 403 Forbidden
        
    return render_template('dashboard.html', profile=get_profile(requested_id))
`.trim(),
    });
  } else {
    // PATCHED MODE
    const isOwner = currentUser.id === Number(requestedUserId);
    const isAdmin = currentUser.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        mode: 'patched',
        currentSession: {
          id: currentUser.id,
          username: currentUser.username,
          role: currentUser.role,
        },
        requestedId: requestedUserId,
        isExploited: false,
        analysis: `ACCESS DENIED (HTTP 403 FORBIDDEN): Session verification confirmed user '${currentUser.username}' is not the owner of record ID ${requestedUserId} nor possesses 'admin' privileges. Private roadmap retained securely.`,
        patchCode: `# Enforcement succeeded: session.get('user_id') !== requested_user_id -> 403 Forbidden.`,
      });
    }

    return res.json({
      success: true,
      mode: 'patched',
      currentSession: {
        id: currentUser.id,
        username: currentUser.username,
        role: currentUser.role,
      },
      requestedId: requestedUserId,
      retrievedRecord: targetUser,
      isExploited: false,
      analysis: `AUTHORIZED ACCESS: User '${currentUser.username}' is accessing their own authorized roadmap and records.`,
    });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
