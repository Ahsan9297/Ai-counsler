export const CODE_SNIPPETS = {
  app_py: `"""
AI Career Counseling Bot - Production Flask Application
Demonstrates Hybrid AI (Local Ollama Llama 3 + Google Gemini Fallback)
Includes Secured Session Auth and Parameterized Database Operations
"""
from flask import Flask, request, jsonify, render_template, session, redirect, url_for, abort
import requests
import json
import logging
import database as db

app = Flask(__name__)
app.secret_key = "CHANGE_IN_PROD_USE_OS_URANDOM_32_BYTES"

# Ollama Local Endpoint (Air-Gapped University Presentation Mode)
OLLAMA_ENDPOINT = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("CareerBot")

def call_local_ollama(system_prompt, user_prompt):
    """
    Sends inference request to local Ollama instance running Llama 3.
    Ensures 100% offline functionality without internet connectivity.
    """
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\\n{system_prompt}<|eot_id|>"
                  f"<|start_header_id|>user<|end_header_id|>\\n{user_prompt}<|eot_id|>"
                  f"<|start_header_id|>assistant<|end_header_id|>\\n",
        "stream": False,
        "options": {
            "temperature": 0.3,
            "top_p": 0.9,
            "num_predict": 1024
        }
    }
    try:
        response = requests.post(OLLAMA_ENDPOINT, json=payload, timeout=45)
        response.raise_for_status()
        return response.json().get("response", "Error: No response generated.")
    except requests.exceptions.RequestException as e:
        logger.error(f"Local Ollama inference failed: {e}")
        return None

# ==========================================
# 1. AUTHENTICATION (SECURED VS VULNERABLE)
# ==========================================

# [PATCHED SECURE ROUTE]
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json() if request.is_json else request.form
    username = data.get('username', '').strip()
    password = data.get('password', '')

    # Patched: Uses parameterized prepared statements in database.py
    user = db.authenticate_user_secure(username, password)
    
    if user:
        session['user_id'] = user['id']
        session['username'] = user['username']
        session['role'] = user['role']
        return jsonify({"success": True, "message": f"Welcome {user['username']}", "role": user['role']})
    
    return jsonify({"success": False, "message": "Invalid username or password"}), 401

# [VULNERABLE ROUTE FOR DEFENSE DEMONSTRATION ONLY]
@app.route('/login-vulnerable', methods=['POST'])
def login_vulnerable():
    data = request.get_json() if request.is_json else request.form
    username = data.get('username', '')
    password = data.get('password', '')

    # Vulnerability: Raw f-string injection point
    user = db.authenticate_user_vulnerable_sqli(username, password)
    if user:
        session['user_id'] = user['id']
        session['username'] = user['username']
        session['role'] = user['role']
        return jsonify({"success": True, "exploited": True, "user": user})
    return jsonify({"success": False, "message": "Auth failed"}), 401

# ==========================================
# 2. DASHBOARD & ROADMAP (IDOR MITIGATION)
# ==========================================

# [PATCHED SECURE DASHBOARD]
@app.route('/dashboard')
def dashboard():
    logged_in_id = session.get('user_id')
    if not logged_in_id:
        return redirect(url_for('login'))

    # Retrieve requested user ID from query param, default to logged in user
    requested_id = request.args.get('view_user', logged_in_id, type=int)

    # Security Check: Prevent Insecure Direct Object Reference (IDOR)
    if requested_id != logged_in_id and session.get('role') != 'admin':
        logger.warning(f"IDOR attempt: User {logged_in_id} tried viewing {requested_id}")
        abort(403) # Forbidden

    profile = db.get_user_profile(requested_id)
    roadmaps = db.get_user_roadmaps(requested_id)
    chat_history = db.get_user_chat_history(requested_id)
    return jsonify({"profile": profile, "roadmaps": roadmaps, "chats": chat_history})

# ==========================================
# 3. AI ROADMAP GENERATION & CHAT
# ==========================================

@app.route('/api/generate-roadmap', methods=['POST'])
def generate_roadmap():
    if not session.get('user_id'):
        return jsonify({"error": "Unauthorized"}), 401
        
    data = request.json
    degree = data.get("degree")
    interests = data.get("interests")
    target_career = data.get("target_career")
    cgpa = data.get("cgpa", "3.5")

    system_prompt = (
        "You are a Senior Academic & Tech Career Strategist. "
        "Formulate a structured 4-phase academic and industry roadmap including: "
        "1. Required Coursework & CGPA targets. 2. Capstone project suggestions. "
        "3. High-impact GitHub portfolio specs. 4. Tactical interview prep."
    )
    user_prompt = f"Degree: {degree}, CGPA: {cgpa}, Interests: {interests}, Career Goal: {target_career}."

    # Execute inference via offline Ollama
    roadmap_text = call_local_ollama(system_prompt, user_prompt)
    if not roadmap_text:
        # Fallback to canned structured response or cloud Gemini
        roadmap_text = "Fallback roadmap generated locally."

    # Persist in SQLite
    roadmap_id = db.save_roadmap(session['user_id'], degree, target_career, roadmap_text)
    return jsonify({"success": True, "roadmap_id": roadmap_id, "content": roadmap_text})

if __name__ == '__main__':
    db.init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)
`,

  database_py: `"""
Database Access Layer with SQLite3
Demonstrates both the deliberately vulnerable functions (for university defense)
and the production-grade parameterized secure implementations.
"""
import sqlite3
import os

DB_PATH = 'career_counselor.db'

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                name TEXT NOT NULL,
                role TEXT DEFAULT 'student',
                degree TEXT,
                cgpa REAL,
                career_goal TEXT,
                private_notes TEXT
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS roadmaps (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                degree TEXT,
                career_goal TEXT,
                roadmap_content TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chat_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                sender TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ''')
        # Seed test accounts for defense demonstration
        cursor.execute("SELECT COUNT(*) FROM users")
        if cursor.fetchone()[0] == 0:
            cursor.execute("""
                INSERT INTO users (username, password_hash, name, role, degree, cgpa, career_goal, private_notes)
                VALUES 
                ('professor', 'faculty_secret_pass', 'Dr. Evelyn Martinez', 'professor', 'Ph.D. CS', 3.98, 'Grant Research', 'CONFIDENTIAL: Defense grading rubric'),
                ('student_ahsan', 'student_pass_123', 'Ahsan Nawaz', 'student', 'BS Computer Science', 3.82, 'AI Architect', 'Capstone defense prep')
            """)
        conn.commit()

# -------------------------------------------------------------
# 1. VULNERABLE SQL INJECTION FUNCTION (For Presentation Defense)
# -------------------------------------------------------------
def authenticate_user_vulnerable_sqli(username, password):
    """
    WARNING: Insecure raw f-string SQL query.
    Allows authentication bypass using: professor' --
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        # Vulnerable string concatenation
        query = f"SELECT * FROM users WHERE username = '{username}' AND password_hash = '{password}'"
        print(f"[DEBUG EXPLOIT QUERY]: {query}")
        cursor.execute(query)
        row = cursor.fetchone()
        return dict(row) if row else None

# -------------------------------------------------------------
# 2. PATCHED SECURE AUTHENTICATION (Parameterized Queries)
# -------------------------------------------------------------
def authenticate_user_secure(username, password):
    """
    SECURE: Uses parameterized queries with '?' placeholders.
    The database engine compiles the SQL AST first; input is treated strictly as literal data.
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, username, name, role, degree, cgpa FROM users WHERE username = ? AND password_hash = ?",
            (username, password)
        )
        row = cursor.fetchone()
        return dict(row) if row else None

# -------------------------------------------------------------
# 3. USER PROFILE & ROADMAPS
# -------------------------------------------------------------
def get_user_profile(user_id):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, username, name, role, degree, cgpa, career_goal, private_notes FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

def get_user_roadmaps(user_id):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM roadmaps WHERE user_id = ? ORDER BY id DESC", (user_id,))
        return [dict(r) for r in cursor.fetchall()]

def get_user_chat_history(user_id):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM chat_history WHERE user_id = ? ORDER BY id ASC", (user_id,))
        return [dict(r) for r in cursor.fetchall()]

def save_roadmap(user_id, degree, career_goal, content):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO roadmaps (user_id, degree, career_goal, roadmap_content) VALUES (?, ?, ?, ?)",
            (user_id, degree, career_goal, content)
        )
        conn.commit()
        return cursor.lastrowid
`,

  rag_pipeline_py: `"""
Offline RAG (Retrieval-Augmented Generation) Pipeline
Uses ChromaDB for vector storage and SentenceTransformers for local embedding.
100% Offline execution without external API keys or cloud dependencies.
"""
import chromadb
from chromadb.utils import embedding_functions
from pypdf import PdfReader
import requests
import os

class UniversityOfflineRAG:
    def __init__(self, persist_dir="./chroma_db"):
        # 1. Initialize persistent local ChromaDB vector database
        self.client = chromadb.PersistentClient(path=persist_dir)
        
        # 2. Local offline embedding function (all-MiniLM-L6-v2)
        # Runs fully on local CPU/GPU without internet
        self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        
        # 3. Get or create collection
        self.collection = self.client.get_or_create_collection(
            name="university_handbook",
            embedding_function=self.embedding_fn,
            metadata={"hnsw:space": "cosine"} # Cosine similarity
        )

    def ingest_pdf(self, pdf_path, doc_category="General"):
        """
        Extracts text from PDF, splits into semantic chunks with overlap, and stores in ChromaDB.
        """
        reader = PdfReader(pdf_path)
        full_text = ""
        for page_idx, page in enumerate(reader.pages):
            full_text += page.extract_text() + "\\n"

        chunks = self._chunk_text(full_text, chunk_size=400, overlap=50)
        
        ids = [f"{os.path.basename(pdf_path)}_chunk_{i}" for i in range(len(chunks))]
        metadatas = [{"source": os.path.basename(pdf_path), "category": doc_category} for _ in chunks]

        self.collection.add(
            documents=chunks,
            ids=ids,
            metadatas=metadatas
        )
        print(f"Successfully indexed {len(chunks)} chunks from {pdf_path}")

    def _chunk_text(self, text, chunk_size=400, overlap=50):
        words = text.split()
        chunks = []
        for i in range(0, len(words), chunk_size - overlap):
            chunk = " ".join(words[i:i + chunk_size])
            if chunk.strip():
                chunks.append(chunk)
        return chunks

    def query_rag(self, query_text, top_k=3):
        """
        Retrieves top-k closest vector chunks from ChromaDB.
        """
        results = self.collection.query(
            query_texts=[query_text],
            n_results=top_k
        )
        return results

    def generate_grounded_answer(self, query_text):
        """
        Feeds retrieved context chunks into local Ollama (Llama 3) with zero-hallucination constraint.
        """
        results = self.query_rag(query_text, top_k=3)
        retrieved_chunks = results['documents'][0]
        
        context_str = "\\n---\\n".join(retrieved_chunks)
        
        system_prompt = (
            "You are an official University Academic Registrar assistant. "
            "Answer the student query strictly and solely based on the provided retrieved excerpts below. "
            "If the information is not present, state: 'The provided university documents do not mention this.'"
        )
        user_prompt = f"Context:\\n{context_str}\\n\\nStudent Question: {query_text}"

        # Call local Ollama Llama 3
        response = requests.post("http://localhost:11434/api/generate", json={
            "model": "llama3",
            "prompt": f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\\n{system_prompt}<|eot_id|>"
                      f"<|start_header_id|>user<|end_header_id|>\\n{user_prompt}<|eot_id|>"
                      f"<|start_header_id|>assistant<|end_header_id|>\\n",
            "stream": False
        })
        return {
            "answer": response.json().get("response"),
            "sources": results['metadatas'][0],
            "chunks": retrieved_chunks
        }
`,

  system_prompts_py: `"""
Advanced Prompt Engineering Module for Career Roadmapping
Provides Chain-of-Thought (CoT), Socratic Advisory, and JSON-Constrained Prompts
"""

ADVANCED_COT_ROADMAP_PROMPT = """
You are an elite University Academic Dean and Senior Principal Tech Recruiter.
Generate an exhaustive, highly tailored academic and career roadmap based on student parameters.

### INPUT PARAMETERS:
- Degree: {degree} ({year})
- Current CGPA: {cgpa}
- Core Skills & Interests: {interests}
- Target Career Milestone: {target_career}
- Financial & Resource Constraints: {budget}

### REASONING & CHAIN-OF-THOUGHT DIRECTIVES:
1. Feasibility Analysis: Evaluate whether the target career is realistic given their current year and CGPA. Identify immediate deficit areas.
2. Academic Fortification: Recommend core university subjects to prioritize (e.g. Operating Systems, Distributed Systems, Linear Algebra).
3. Practical Portfolio Engineering: Specify 2 distinct production-ready capstone/side project specifications with concrete architectural stacks (not generic 'to-do list' apps).
4. Industry Placement Strategy: Detail target internships, hiring cycles, networking playbooks, and specific technical certifications to acquire.
5. Mock Interview Syllabus: 3 technical question patterns (LeetCode data structures, System Design bottlenecks, and Behavioral STAR scenarios).

### STRICT FORMATTING:
Output clean Markdown with numbered phases, bold technological identifiers, tables for course timelines, and zero conversational filler.
"""

JSON_SCHEMA_OUTPUT_PROMPT = """
Return your career assessment strictly as a valid JSON object matching this schema:
{
  "executive_summary": "string",
  "feasibility_score": "number (1-100)",
  "phases": [
    {
      "phase_number": 1,
      "title": "string",
      "duration_months": "string",
      "academic_goals": ["string"],
      "technical_skills": ["string"],
      "milestone_project": {
        "name": "string",
        "tech_stack": ["string"],
        "architecture_summary": "string"
      }
    }
  ],
  "recommended_certifications": ["string"],
  "interview_topics": ["string"]
}
"""
`,

  defense_walkthrough: `# University Capstone Defense Walkthrough Guide
**Project:** AI Career Counseling Bot with Hybrid Inference & Cybersecurity Defense Lab
**Presenter:** Ahsan Nawaz (Lead Full-Stack & Security Engineer)

---

## 1. Opening Pitch (1 Minute)
"Respected Panel Members, 
Our capstone addresses two critical realities in modern computing:
1. Students lack continuous, personalized academic and career counseling aligned with both university curricula and current tech hiring bars.
2. Cloud AI dependencies fail during on-campus presentations or air-gapped environments.

We developed an **AI Career Counseling Platform** powered by a **Hybrid AI Architecture**:
- Offline local inference via **Ollama (Llama 3)** with zero cloud reliance.
- Augmented by **ChromaDB Vector Retrieval (RAG)** to index university fee structures and degree handbooks.
- Tested against deliberate real-world attack vectors to prove architectural hardening."

---

## 2. Live Cybersecurity Demonstration (3 Minutes)
### A. Attack Vector 1: SQL Injection (Auth Bypass)
- **Vulnerability:** Unsanitized string concatenation in the login query:
  \`SELECT * FROM users WHERE username = '\` + input + \`' AND password = '...'\`
- **Live Exploit:** Input \`professor' --\` into the username field with any arbitrary password.
- **Result:** The SQLite comment operator (\`--\`) eliminates the password check. The engine evaluates \`WHERE username = 'professor'\` as TRUE, granting unauthorized access to the professor's account.
- **The Fix:** Parameterized prepared statements:
  \`cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (user, pass))\`

### B. Attack Vector 2: Insecure Direct Object Reference (IDOR)
- **Vulnerability:** Blind reliance on client-controlled URL parameter: \`?view_user=1\`
- **Live Exploit:** Logged in as student (ID 2), change URL to \`?view_user=1\`. The dashboard exposes confidential faculty notes and student disciplinary records.
- **The Fix:** Session-bound authorization check:
  \`if requested_id != session.get('user_id') and session.get('role') != 'admin': abort(403)\`

---

## 3. Offline RAG Demonstration (2 Minutes)
- Show query: *"What is the tuition fee per credit hour for BS Computer Science and the CGPA required for merit scholarships?"*
- Explain vector embeddings via \`all-MiniLM-L6-v2\` and cosine similarity ranking in **ChromaDB**.
- Highlight that the LLM response is strictly constrained to the retrieved PDF excerpts, eliminating hallucinations.

---

## 4. Architectural Summary
- **Local Resilience:** Runs 100% offline on a standard laptop with Llama 3 quantized to 4-bit.
- **Persistent Memory:** Complete conversation and roadmap tracking in SQLite.
- **Hardened Security:** Zero SQLi vulnerability, strict session validation, and principle of least privilege.
`,
};
