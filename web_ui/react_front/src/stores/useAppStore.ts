import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { 
  APTProfile, 
  SimulationStatus, 
  DetectionResult, 
  Report, 
  KPIMetrics, 
  SystemStatus, 
  User, 
  ThemeConfig 
} from '@/types'

interface AppState {
  // Theme
  theme: ThemeConfig
  setTheme: (theme: Partial<ThemeConfig>) => void
  
  // User
  user: User | null
  setUser: (user: User | null) => void
  
  // Sidebar
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  
  // Simulation
  currentSimulation: SimulationStatus | null
  simulations: SimulationStatus[]
  setCurrentSimulation: (simulation: SimulationStatus | null) => void
  addSimulation: (simulation: SimulationStatus) => void
  updateSimulation: (id: string, updates: Partial<SimulationStatus>) => void
  
  // Detection Results
  detectionResults: DetectionResult[]
  setDetectionResults: (results: DetectionResult[]) => void
  updateDetectionResult: (techniqueId: string, updates: Partial<DetectionResult>) => void
  
  // Reports
  reports: Report[]
  setReports: (reports: Report[]) => void
  addReport: (report: Report) => void
  
  // Metrics
  metrics: KPIMetrics | null
  setMetrics: (metrics: KPIMetrics) => void
  
  // System Status
  systemStatus: SystemStatus | null
  setSystemStatus: (status: SystemStatus) => void
  
  // APT Profiles
  aptProfiles: APTProfile[]
  setAPTProfiles: (profiles: APTProfile[]) => void
  
  // UI State
  activeTab: string
  setActiveTab: (tab: string) => void
  showSettings: boolean
  setShowSettings: (show: boolean) => void
  showAppConfig: boolean
  setShowAppConfig: (show: boolean) => void
  showNotifications: boolean
  setShowNotifications: (show: boolean) => void
  showDocumentation: boolean
  setShowDocumentation: (show: boolean) => void
  
  // Loading States
  loading: {
    simulations: boolean
    detections: boolean
    reports: boolean
    metrics: boolean
  }
  setLoading: (key: keyof AppState['loading'], value: boolean) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Theme (dark mode only)
        theme: {
          mode: 'dark' as const,
          primaryColor: 'blue',
          radius: 0.75
        },
        setTheme: (theme) => 
          set((state) => ({ theme: { ...state.theme, ...theme } }), false, 'setTheme'),
        
        // User
        user: null,
        setUser: (user) => set({ user }, false, 'setUser'),
        
        // Sidebar
        sidebarCollapsed: false,
        setSidebarCollapsed: (collapsed) => 
          set({ sidebarCollapsed: collapsed }, false, 'setSidebarCollapsed'),
        
        // Simulation
        currentSimulation: null,
        simulations: [],
        setCurrentSimulation: (simulation) => 
          set({ currentSimulation: simulation }, false, 'setCurrentSimulation'),
        addSimulation: (simulation) => 
          set((state) => ({ 
            simulations: [simulation, ...state.simulations].slice(0, 10) 
          }), false, 'addSimulation'),
        updateSimulation: (id, updates) => 
          set((state) => ({
            simulations: state.simulations.map(sim => 
              sim.id === id ? { ...sim, ...updates } : sim
            ),
            currentSimulation: state.currentSimulation?.id === id 
              ? { ...state.currentSimulation, ...updates } 
              : state.currentSimulation
          }), false, 'updateSimulation'),
        
        // Detection Results
        detectionResults: [],
        setDetectionResults: (results) => 
          set({ detectionResults: results }, false, 'setDetectionResults'),
        updateDetectionResult: (techniqueId, updates) => 
          set((state) => ({
            detectionResults: state.detectionResults.map(result => 
              result.techniqueId === techniqueId ? { ...result, ...updates } : result
            )
          }), false, 'updateDetectionResult'),
        
        // Reports
        reports: [],
        setReports: (reports) => set({ reports }, false, 'setReports'),
        addReport: (report) => 
          set((state) => ({ reports: [report, ...state.reports] }), false, 'addReport'),
        
        // Metrics
        metrics: null,
        setMetrics: (metrics) => set({ metrics }, false, 'setMetrics'),
        
        // System Status
        systemStatus: null,
        setSystemStatus: (status) => set({ systemStatus: status }, false, 'setSystemStatus'),
        
        // APT Profiles
        aptProfiles: [],
        setAPTProfiles: (profiles) => set({ aptProfiles: profiles }, false, 'setAPTProfiles'),
        
        // UI State
        activeTab: 'dashboard',
        setActiveTab: (tab) => set({ activeTab: tab }, false, 'setActiveTab'),
        showSettings: false,
        setShowSettings: (show) => set({ showSettings: show }, false, 'setShowSettings'),
        showAppConfig: false,
        setShowAppConfig: (show) => set({ showAppConfig: show }, false, 'setShowAppConfig'),
        showNotifications: false,
        setShowNotifications: (show) => set({ showNotifications: show }, false, 'setShowNotifications'),
        showDocumentation: false,
        setShowDocumentation: (show) => set({ showDocumentation: show }, false, 'setShowDocumentation'),
        
        // Loading States
        loading: {
          simulations: false,
          detections: false,
          reports: false,
          metrics: false
        },
        setLoading: (key, value) => 
          set((state) => ({ 
            loading: { ...state.loading, [key]: value } 
          }), false, 'setLoading'),
      }),
      {
        name: 'detection-lab-store',
        partialize: (state) => ({
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
          activeTab: state.activeTab,
          user: state.user
        })
      }
    ),
    { name: 'detection-lab-store' }
  )
) 