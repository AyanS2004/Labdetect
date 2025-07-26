export interface APTProfile {
  id: string
  name: string
  country: string
  sophistication: 'Low' | 'Medium' | 'High' | 'Very High'
  targets: string
  description: string
  color: string
  techniques: string[]
}

export interface SimulationRequest {
  aptProfile: string
  sector?: string
  intensity?: 'low' | 'medium' | 'high'
  customTechniques?: string[]
  options?: {
    duration?: number
    stealth?: boolean
    verbose?: boolean
  }
}

export interface SimulationStatus {
  id: string
  status: 'running' | 'completed' | 'failed' | 'stopped'
  progress: number
  currentPhase: string
  startTime: string
  endTime?: string
  logs: LogEntry[]
  aptProfile: string
}

export interface LogEntry {
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'success'
  message: string
  techniqueId?: string
}

export interface DetectionResult {
  techniqueId: string
  techniqueName: string
  tactic: string
  coverage: 'Full' | 'Partial' | 'None'
  confidence: number
  firstDetected?: string
  lastDetected?: string
  evidenceCount: number
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  status: 'detected' | 'missed' | 'pending'
  validatedByLLM?: boolean
  llmConfidence?: number
}

export interface Report {
  id: string
  title: string
  type: 'apt-analysis' | 'coverage-report' | 'mitre-heatmap' | 'intelligence-brief'
  generatedAt: string
  format: 'markdown' | 'pdf' | 'json'
  size: number
  description: string
  tags: string[]
  downloadUrl: string
  previewUrl?: string
}

export interface KPIMetrics {
  totalSimulations: number
  detectionSuccessRate: number
  averageResponseTime: number
  techniquesCovered: number
  falsePositiveRate: number
  lastUpdated: string
}

export interface TelemetryEvent {
  timestamp: string
  eventType: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
  count: number
}

export interface MITREHeatmapData {
  techniques: Array<{
    techniqueID: string
    score: number
    color: string
    metadata?: Record<string, any>
  }>
  domain: string
  version: string
  description: string
}

export interface SystemStatus {
  overall: 'healthy' | 'warning' | 'critical'
  components: {
    api: 'up' | 'down' | 'degraded'
    database: 'up' | 'down' | 'degraded'
    llm: 'up' | 'down' | 'degraded'
    simulation: 'up' | 'down' | 'degraded'
  }
  lastCheck: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'analyst' | 'viewer'
}

export interface ThemeConfig {
  mode: 'dark'
  primaryColor: string
  radius: number
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  refreshToken: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

// API Response types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Rule Evaluation types
export interface MitreMapping {
  tactic: string
  techniques: string[]
}

export interface RawRule {
  title: string
  logsource: {
    category: string
    product: string
  }
  detection: {
    selection: Record<string, any>
    condition: string
  }
  level: string
  [key: string]: any
}

export interface RuleEvaluation {
  rule_id: string
  summary: string
  gap_analysis: string
  llm_recommendation: string
  mitre_mapping: MitreMapping[]
  raw_rule: RawRule
  // Legacy fields for backward compatibility
  evaluation?: string
  timestamp?: string
  confidence_score?: number
}

export interface RuleEvaluationListItem {
  id: string
  name: string
  status: 'evaluated' | 'pending' | 'failed'
  last_updated: string
} 