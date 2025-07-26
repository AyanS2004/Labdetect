'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Settings, Database, Server, Shield, Palette, Save, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AppConfigModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AppConfigModal({ isOpen, onClose }: AppConfigModalProps) {
  const [config, setConfig] = useState({
    // Database Settings
    mongoUri: 'mongodb://localhost:27017/',
    database: 'detection_lab',
    connectionPoolSize: 10,
    
    // Authentication Settings
    jwtSecret: 'detection-lab-secret-key',
    tokenExpiry: 60, // minutes
    refreshTokenExpiry: 7, // days
    
    // API Settings
    apiPort: 5000,
    corsOrigins: 'http://localhost:3000',
    rateLimitRequests: 100,
    rateLimitWindow: 15, // minutes
    
    // Security Settings
    passwordMinLength: 8,
    maxLoginAttempts: 5,
    lockoutDuration: 30, // minutes
    
    // Application Settings
    logLevel: 'info',
    enableDebugMode: false,
    enableAuditLogs: true,
    sessionTimeout: 480, // minutes (8 hours)
    
    // UI Settings
    defaultTheme: 'dark',
    compactMode: false,
    showAdvancedFeatures: true,
    autoSave: true
  })

  const [isLoading, setIsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('database')

  if (!isOpen) return null

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to save configuration
      await new Promise(resolve => setTimeout(resolve, 1500))
      // Show success message
      console.log('Configuration saved:', config)
    } catch (error) {
      // Show error message
      console.error('Failed to save configuration:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    // Reset to default values
    setConfig({
      mongoUri: 'mongodb://localhost:27017/',
      database: 'detection_lab',
      connectionPoolSize: 10,
      jwtSecret: 'detection-lab-secret-key',
      tokenExpiry: 60,
      refreshTokenExpiry: 7,
      apiPort: 5000,
      corsOrigins: 'http://localhost:3000',
      rateLimitRequests: 100,
      rateLimitWindow: 15,
      passwordMinLength: 8,
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      logLevel: 'info',
      enableDebugMode: false,
      enableAuditLogs: true,
      sessionTimeout: 480,
      defaultTheme: 'dark',
      compactMode: false,
      showAdvancedFeatures: true,
      autoSave: true
    })
  }

  const sections = [
    { id: 'database', label: 'Database', icon: Database },
    { id: 'auth', label: 'Authentication', icon: Shield },
    { id: 'api', label: 'API & Security', icon: Server },
    { id: 'app', label: 'Application', icon: Settings },
    { id: 'ui', label: 'Interface', icon: Palette }
  ]

  const renderSection = () => {
    switch (activeSection) {
      case 'database':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">MongoDB URI</label>
              <input
                type="text"
                value={config.mongoUri}
                onChange={(e) => setConfig(prev => ({ ...prev, mongoUri: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="mongodb://localhost:27017/"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Database Name</label>
              <input
                type="text"
                value={config.database}
                onChange={(e) => setConfig(prev => ({ ...prev, database: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Connection Pool Size</label>
              <input
                type="number"
                value={config.connectionPoolSize}
                onChange={(e) => setConfig(prev => ({ ...prev, connectionPoolSize: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                min="1" max="50"
              />
            </div>
          </div>
        )

      case 'auth':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">JWT Secret</label>
              <input
                type="password"
                value={config.jwtSecret}
                onChange={(e) => setConfig(prev => ({ ...prev, jwtSecret: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <p className="text-xs text-slate-500">Use a strong, random key for production</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Token Expiry (minutes)</label>
                <input
                  type="number"
                  value={config.tokenExpiry}
                  onChange={(e) => setConfig(prev => ({ ...prev, tokenExpiry: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  min="5" max="1440"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Refresh Token Expiry (days)</label>
                <input
                  type="number"
                  value={config.refreshTokenExpiry}
                  onChange={(e) => setConfig(prev => ({ ...prev, refreshTokenExpiry: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  min="1" max="365"
                />
              </div>
            </div>
          </div>
        )

      case 'api':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">API Port</label>
                <input
                  type="number"
                  value={config.apiPort}
                  onChange={(e) => setConfig(prev => ({ ...prev, apiPort: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  min="1000" max="65535"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Rate Limit (requests/window)</label>
                <input
                  type="number"
                  value={config.rateLimitRequests}
                  onChange={(e) => setConfig(prev => ({ ...prev, rateLimitRequests: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  min="10" max="1000"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">CORS Origins</label>
              <input
                type="text"
                value={config.corsOrigins}
                onChange={(e) => setConfig(prev => ({ ...prev, corsOrigins: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="http://localhost:3000"
              />
            </div>
          </div>
        )

      case 'app':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Log Level</label>
              <select
                value={config.logLevel}
                onChange={(e) => setConfig(prev => ({ ...prev, logLevel: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="error">Error</option>
                <option value="warn">Warning</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
              </select>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white">Debug Mode</label>
                  <p className="text-xs text-slate-500">Enable detailed logging and error messages</p>
                </div>
                <button
                  onClick={() => setConfig(prev => ({ ...prev, enableDebugMode: !prev.enableDebugMode }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.enableDebugMode ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.enableDebugMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white">Audit Logs</label>
                  <p className="text-xs text-slate-500">Track user actions and system events</p>
                </div>
                <button
                  onClick={() => setConfig(prev => ({ ...prev, enableAuditLogs: !prev.enableAuditLogs }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.enableAuditLogs ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.enableAuditLogs ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )

      case 'ui':
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white">Compact Mode</label>
                  <p className="text-xs text-slate-500">Use smaller spacing and condensed layout</p>
                </div>
                <button
                  onClick={() => setConfig(prev => ({ ...prev, compactMode: !prev.compactMode }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.compactMode ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.compactMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white">Advanced Features</label>
                  <p className="text-xs text-slate-500">Show developer and power user features</p>
                </div>
                <button
                  onClick={() => setConfig(prev => ({ ...prev, showAdvancedFeatures: !prev.showAdvancedFeatures }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.showAdvancedFeatures ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.showAdvancedFeatures ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white">Auto Save</label>
                  <p className="text-xs text-slate-500">Automatically save changes</p>
                </div>
                <button
                  onClick={() => setConfig(prev => ({ ...prev, autoSave: !prev.autoSave }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.autoSave ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.autoSave ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md modal-overlay modal-app-config"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[95vh] overflow-hidden modal-content"
        >
          <Card className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-700/50">
              <div className="flex items-center space-x-3">
                <Settings className="h-6 w-6 text-blue-400" />
                <div>
                  <CardTitle className="text-xl font-bold text-white">App Configuration</CardTitle>
                  <CardDescription className="text-slate-400">
                    System settings and application configuration
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-slate-400 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            <div className="flex h-[70vh]">
              {/* Sidebar */}
              <div className="w-56 border-r border-slate-700/50 p-4 overflow-y-auto">
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeSection === section.id
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{section.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderSection()}
                  </motion.div>
                </AnimatePresence>
                
                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Configuration'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 