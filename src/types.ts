export interface RoadmapRequest {
  degree: string;
  year: string;
  interests: string;
  targetCareer: string;
  cgpa: string;
  budget: string;
  promptMode: 'advanced_cot' | 'naive';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface RAGChunk {
  docTitle: string;
  category: string;
  chunk: string;
  score: number;
}

export interface RAGQueryResponse {
  success: boolean;
  query: string;
  topMatches: RAGChunk[];
  groundedAnswer: string;
  contextChunkCount: number;
  retrievalLatencyMs: number;
}

export interface SQLiResult {
  success: boolean;
  mode: 'vulnerable' | 'patched';
  executedQuery: string;
  isExploited: boolean;
  authenticated: boolean;
  user: {
    id: number;
    username: string;
    name: string;
    role: string;
    degree: string;
    career_goal: string;
    private_notes: string;
  } | null;
  vulnerabilityAnalysis: string;
  remediationSnippet: string;
}

export interface IDORResult {
  success: boolean;
  mode: 'vulnerable' | 'patched';
  currentSession: {
    id: number;
    username: string;
    role: string;
  };
  requestedId: number;
  retrievedRecord?: {
    id: number;
    username: string;
    name: string;
    role: string;
    degree: string;
    cgpa: number;
    career_goal: string;
    private_notes: string;
    roadmap_summary: string;
  };
  isExploited: boolean;
  analysis: string;
  patchCode: string;
}
