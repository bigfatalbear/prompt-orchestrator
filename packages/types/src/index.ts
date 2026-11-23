/** Contratos de domínio do Prompt Orchestrator. */
export type Platform = 'web' | 'pwa' | 'desktop';
export type PowerLevel = 1 | 2 | 3 | 4 | 5;
export type DatabaseEngine = 'none' | 'indexeddb' | 'sqlite' | 'postgres' | 'supabase';
export type ExportFormat = 'txt' | 'md' | 'json' | 'yaml';

export interface Idea {
  name: string;
  description: string;
  audience: string;
  problem: string;
  features: string;
  similar: string;
}

export interface Engineering {
  git: boolean;
  conventionalCommits: boolean;
  modularArchitecture: boolean;
  tests: boolean;
  documentation: boolean;
  cicd: boolean;
  security: boolean;
  authentication: boolean;
  database: boolean;
  api: boolean;
  offline: boolean;
  pwa: boolean;
  desktop: boolean;
  observability: boolean;
  logs: boolean;
  audit: boolean;
  backup: boolean;
}

export interface DatabaseConfig {
  enabled: boolean;
  engine: DatabaseEngine;
}

export interface AuthenticationConfig {
  enabled: boolean;
  providers: string[];
  sessionStrategy: 'token' | 'session' | 'none';
}

export interface SecurityConfig {
  validation: boolean;
  sanitization: boolean;
  xssProtection: boolean;
  csp: boolean;
  secretManagement: boolean;
}

export interface ApiConfig {
  enabled: boolean;
  style: 'rest' | 'graphql' | 'none';
}

export interface PwaConfig {
  enabled: boolean;
  manifest: boolean;
  serviceWorker: boolean;
  cacheStrategy: boolean;
  https: boolean;
  installPrompt: boolean;
}

export interface DesktopConfig {
  enabled: boolean;
  runtime: 'tauri' | 'electron' | 'none';
  packaging: boolean;
  updater: boolean;
}

export interface TestingConfig {
  enabled: boolean;
  unit: boolean;
  integration: boolean;
  e2e: boolean;
}

export interface DeploymentConfig {
  cicd: boolean;
  target: 'none' | 'github-pages' | 'vercel' | 'cloudflare' | 'server';
  artifacts: boolean;
}

export interface GitConfig {
  enabled: boolean;
  conventionalCommits: boolean;
  provider: 'github' | 'gitlab' | 'none';
}

export interface AiConfig {
  provider: 'deterministic' | 'openai-compatible';
  endpoint?: string;
  model?: string;
}

export interface ValidationIssue {
  path: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface Dependency {
  id: string;
  label: string;
  description: string;
  from: string;
  required: boolean;
  satisfied: boolean;
}

export interface CoherenceWarning {
  id: string;
  title: string;
  message: string;
  severity: 'warning' | 'error';
  suggestedLevel?: PowerLevel;
  actions: Array<{ id: string; label: string }>;
}

export interface CoherenceReport {
  warnings: CoherenceWarning[];
  dependencies: Dependency[];
  recommendations: string[];
  coherent: boolean;
}

export interface Specification {
  project: { name: string; description: string; level: PowerLevel };
  idea: Idea;
  users: string[];
  platforms: Platform[];
  engineering: Engineering;
  architecture: { style: string; modules: string[]; patterns: string[] };
  database: DatabaseConfig;
  authentication: AuthenticationConfig;
  security: SecurityConfig;
  api: ApiConfig;
  pwa: PwaConfig;
  desktop: DesktopConfig;
  testing: TestingConfig;
  deployment: DeploymentConfig;
  git: GitConfig;
  ai: AiConfig;
  dependencies: Dependency[];
  coherence: CoherenceReport;
  validation: ValidationIssue[];
  generatedAt: string;
}

export interface ProjectVersion {
  id: string;
  projectId: string;
  version: number;
  createdAt: string;
  label: string;
  state: ProjectState;
}

export interface ProjectSummary {
  id: string;
  name: string;
  description: string;
  level: PowerLevel;
  platforms: Platform[];
  status: 'draft' | 'review' | 'done';
  updatedAt: string;
  createdAt: string;
}

export interface ProjectState {
  id: string;
  project: { name: string; description: string; level: PowerLevel };
  idea: Idea;
  users: string[];
  platforms: Platform[];
  engineering: Engineering;
  architecture: { style: string; modules: string[]; patterns: string[] };
  database: DatabaseConfig;
  authentication: AuthenticationConfig;
  security: SecurityConfig;
  api: ApiConfig;
  pwa: PwaConfig;
  desktop: DesktopConfig;
  testing: TestingConfig;
  deployment: DeploymentConfig;
  git: GitConfig;
  ai: AiConfig;
  validation: ValidationIssue[];
  generatedSpecification: Specification | null;
  generatedPrompt: string;
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
    step: number;
    status: 'draft' | 'review' | 'done';
  };
}

export interface WizardStep {
  id: number;
  key: 'idea' | 'platform' | 'engineering' | 'power' | 'review' | 'result';
  title: string;
  description: string;
}

export interface Example {
  id: string;
  category: string;
  title: string;
  idea: Idea;
  platforms: Platform[];
  level: PowerLevel;
  engineering: Partial<Engineering>;
}
