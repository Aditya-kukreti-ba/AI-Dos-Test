export type AttackType = 'prompt-flood' | 'token-exhaustion' | 'batch-attack' | 'model-exploit';

export type AttackMode = 'auto' | 'manual';

export interface ModelInfo {
  id: string;
  name: string;
  pipeline_tag?: string;
  provider?: string;
}

export interface AttackConfig {
  attackType: AttackType;
  mode: AttackMode;
  targetModel: string;
  attackerModel?: string;
  prompts: string[];
  requestCount: number;
  batchSize?: number;
  delayMs?: number;
}

export interface AttackMetrics {
  totalRequests: number;
  completedRequests: number;
  failedRequests: number;
  timedOutRequests: number;
  avgResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  totalTokensUsed: number;
  avgTokensPerRequest: number;
  responseTimes: number[];
  errors: string[];
  startTime: number;
  endTime?: number;
}

export interface TestResult {
  id: string;
  timestamp: number;
  attackType: AttackType;
  mode: AttackMode;
  targetModel: string;
  attackerModel?: string;
  config: AttackConfig;
  metrics: AttackMetrics;
  prompts: string[];
  responses: ResponseLog[];
}

export interface ResponseLog {
  prompt: string;
  response?: string;
  responseTime: number;
  tokensUsed: number;
  error?: string;
  status: 'success' | 'error' | 'timeout';
}

export interface AppState {
  apiKey: string;
  results: TestResult[];
}
