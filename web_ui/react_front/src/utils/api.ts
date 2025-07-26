import axios from 'axios'
import type { RuleEvaluation, APIResponse } from '@/types'

// ✅ Update this to your Ngrok tunnel URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://079b3a0fbe03.ngrok-free.app'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (auth store persists it there)
    const authStore = localStorage.getItem('auth-store')
    if (authStore) {
      try {
        const parsed = JSON.parse(authStore)
        const token = parsed.state?.token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (e) {
        console.warn('Failed to parse auth store:', e)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Try to refresh token
      try {
        const authStore = localStorage.getItem('auth-store')
        if (authStore) {
          const parsed = JSON.parse(authStore)
          const refreshToken = parsed.state?.refreshToken
          
          if (refreshToken) {
            // Import auth API dynamically to avoid circular dependency
            const { authAPI } = await import('./auth-api')
            const response = await authAPI.refreshToken(refreshToken)
            
            if (response.success && response.data) {
              const { token } = response.data
              // Update stored token
              parsed.state.token = token
              localStorage.setItem('auth-store', JSON.stringify(parsed))
              
              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${token}`
              return api(originalRequest)
            }
          }
        }
      } catch (refreshError) {
        // Refresh failed, clear auth data
        localStorage.removeItem('auth-store')
        window.location.reload()
        return Promise.reject(refreshError)
      }
    }

    console.error('API Error:', error)
    throw error
  }
)

// Rule Evaluation API functions
export const ruleEvaluationApi = {
  // Get list of available rules
  listRules: async (): Promise<string[]> => {
    try {
      const response = await api.get('/list_results')
      return response.data
    } catch (error) {
      // Fallback to mock data if API is not available
      console.warn('API not available, using mock data')
      return [
        'suspicious-powershell',
        'malware-download',
        'credential-dumping',
        'persistence-registry',
        'lateral-movement-wmi',
        'data-exfiltration'
      ]
    }
  },

  // Get specific rule evaluation
  getRuleEvaluation: async (ruleId: string): Promise<RuleEvaluation> => {
    try {
      const response = await api.get(`/get_result/${ruleId}`)
      return response.data
    } catch (error) {
      // Fallback to mock data if API is not available
      console.warn('API not available, using mock data')
      return {
        rule_id: ruleId,
        summary: `This Sigma rule detects suspicious ${ruleId.replace(/_/g, ' ')} activity typically associated with privilege escalation or lateral movement.`,
        gap_analysis: `The rule lacks conditions to detect encoded command patterns and does not cover obfuscated executions for ${ruleId.replace(/_/g, ' ')}.`,
        llm_recommendation: `Include regex to match encoded commands (e.g., Base64) and monitor child process spawning. Consider adding correlation with network traffic patterns.`,
        mitre_mapping: [
          {
            tactic: "Execution",
            techniques: ["T1059.001", "T1059.003"]
          },
          {
            tactic: "Privilege Escalation", 
            techniques: ["T1548.002"]
          }
        ],
        raw_rule: {
          title: `Suspicious ${ruleId.replace(/_/g, ' ').replace(/\.yml$/, '')} Activity`,
          logsource: {
            category: "process_creation",
            product: "windows"
          },
          detection: {
            selection: {
              Image: "*\\\\powershell.exe",
              "CommandLine|contains": "Invoke-Expression"
            },
            condition: "selection"
          },
          level: "high"
        },
        timestamp: new Date().toISOString(),
        confidence_score: 85
      }
    }
  },

  // Create new rule evaluation (if endpoint exists)
  createEvaluation: async (ruleId: string): Promise<APIResponse> => {
    try {
      const response = await api.post('/evaluate_rule', { rule_id: ruleId })
      return response.data
    } catch (error) {
      console.warn('API not available, using mock response')
      return { success: true, message: 'Mock evaluation created' }
    }
  },
}

// Simulation API functions (placeholder for future integration)
export const simulationApi = {
  getSimulations: async () => {
    // Mock for now - replace with actual endpoint
    return []
  },

  createSimulation: async (data: any) => {
    // Mock for now - replace with actual endpoint
    return { success: true }
  },
}

// Detection API functions (placeholder for future integration)
export const detectionApi = {
  getDetections: async () => {
    // Mock for now - replace with actual endpoint
    return []
  },

  validateDetection: async (techniqueId: string) => {
    // Mock for now - replace with actual endpoint
    return { success: true }
  },
} 