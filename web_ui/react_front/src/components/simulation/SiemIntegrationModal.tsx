'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Database, Server, Eye, Download, Share2, Code, CheckCircle, AlertTriangle, Clock, Zap, BarChart3, Settings, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface SiemIntegrationModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SiemConnection {
  id: string
  name: string
  type: 'splunk' | 'elastic' | 'grafana' | 'qradar' | 'splunk-es'
  status: 'connected' | 'connecting' | 'disconnected' | 'error'
  events_sent: number
  events_received: number
  rules_converted: number
  last_sync: string
  endpoint: string
}

interface DetectionRule {
  id: string
  name: string
  description: string
  mitre_id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'converting' | 'converted' | 'deployed' | 'error'
  siem_versions: {
    splunk: string
    elastic: string
    qradar: string
    sigma: string
  }
  conversion_progress: number
}

export function SiemIntegrationModal({ isOpen, onClose }: SiemIntegrationModalProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [selectedSiem, setSelectedSiem] = useState<string | null>(null)
  const [conversionProgress, setConversionProgress] = useState(0)

  const siemConnections: SiemConnection[] = [
    {
      id: 'splunk',
      name: 'Splunk Enterprise',
      type: 'splunk',
      status: 'connected',
      events_sent: 1247,
      events_received: 1247,
      rules_converted: 45,
      last_sync: '2024-01-15T14:30:00Z',
      endpoint: 'https://splunk.company.com:8089'
    },
    {
      id: 'elastic',
      name: 'Elastic Security',
      type: 'elastic',
      status: 'connected',
      events_sent: 1247,
      events_received: 1247,
      rules_converted: 45,
      last_sync: '2024-01-15T14:30:00Z',
      endpoint: 'https://elastic.company.com:9200'
    },
    {
      id: 'grafana',
      name: 'Grafana Loki',
      type: 'grafana',
      status: 'connected',
      events_sent: 1247,
      events_received: 1247,
      rules_converted: 45,
      last_sync: '2024-01-15T14:30:00Z',
      endpoint: 'https://grafana.company.com:3100'
    },
    {
      id: 'qradar',
      name: 'IBM QRadar',
      type: 'qradar',
      status: 'connecting',
      events_sent: 0,
      events_received: 0,
      rules_converted: 0,
      last_sync: 'Never',
      endpoint: 'https://qradar.company.com:443'
    }
  ]

  const detectionRules: DetectionRule[] = [
    {
      id: 'rule_001',
      name: 'Process Injection Detection',
      description: 'Detects common process injection techniques used by APT groups',
      mitre_id: 'T1055',
      severity: 'high',
      status: 'deployed',
      siem_versions: {
        splunk: 'splunk_rule_001.spl',
        elastic: 'elastic_rule_001.yml',
        qradar: 'qradar_rule_001.xml',
        sigma: 'sigma_rule_001.yml'
      },
      conversion_progress: 100
    },
    {
      id: 'rule_002',
      name: 'Credential Dumping',
      description: 'Detects attempts to extract credentials from memory',
      mitre_id: 'T1003',
      severity: 'critical',
      status: 'converting',
      siem_versions: {
        splunk: '',
        elastic: '',
        qradar: '',
        sigma: 'sigma_rule_002.yml'
      },
      conversion_progress: 75
    },
    {
      id: 'rule_003',
      name: 'Lateral Movement',
      description: 'Detects network-based lateral movement activities',
      mitre_id: 'T1021',
      severity: 'high',
      status: 'converted',
      siem_versions: {
        splunk: 'splunk_rule_003.spl',
        elastic: 'elastic_rule_003.yml',
        qradar: 'qradar_rule_003.xml',
        sigma: 'sigma_rule_003.yml'
      },
      conversion_progress: 100
    },
    {
      id: 'rule_004',
      name: 'Data Exfiltration',
      description: 'Detects large data transfers to external destinations',
      mitre_id: 'T1041',
      severity: 'medium',
      status: 'pending',
      siem_versions: {
        splunk: '',
        elastic: '',
        qradar: '',
        sigma: ''
      },
      conversion_progress: 0
    }
  ]

  const startTelemetryStream = () => {
    setIsStreaming(true)
  }

  const stopTelemetryStream = () => {
    setIsStreaming(false)
  }

  const convertRules = () => {
    setConversionProgress(0)
    const interval = setInterval(() => {
      setConversionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  useEffect(() => {
    if (isStreaming) {
      // Simulate telemetry streaming
      const interval = setInterval(() => {
        // Update SIEM connection stats
        // This would be handled by the backend in real implementation
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isStreaming])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md modal-overlay"
        style={{ zIndex: 999999 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-7xl max-h-[95vh] overflow-hidden modal-content"
          style={{ zIndex: 1000000 }}
        >
          <Card className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-700/50 px-6 py-4">
              <div className="flex items-center space-x-3">
                <Database className="h-6 w-6 text-blue-400" />
                <div>
                  <CardTitle className="text-xl font-bold text-white">SIEM Integration</CardTitle>
                  <CardDescription className="text-slate-400">
                    Multi-SIEM rule conversion and telemetry streaming
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
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

            <div className="flex h-[calc(95vh-8rem)]">
              {/* Left Panel - SIEM Connections */}
              <div className="w-96 border-r border-slate-700/50 p-6 overflow-y-auto">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">SIEM Connections</h3>
                  <div className="space-y-3">
                    {siemConnections.map((siem) => (
                      <motion.div
                        key={siem.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedSiem === siem.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
                        }`}
                        onClick={() => setSelectedSiem(siem.id)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              siem.status === 'connected' ? 'bg-green-400' :
                              siem.status === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                              siem.status === 'error' ? 'bg-red-400' :
                              'bg-slate-500'
                            }`} />
                            <div>
                              <div className="font-medium text-white">{siem.name}</div>
                              <div className="text-sm text-slate-400">{siem.endpoint}</div>
                            </div>
                          </div>
                          <Badge className={
                            siem.status === 'connected' ? 'bg-green-500' :
                            siem.status === 'connecting' ? 'bg-yellow-500' :
                            siem.status === 'error' ? 'bg-red-500' :
                            'bg-slate-500'
                          }>
                            {siem.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-slate-400">Events Sent</div>
                            <div className="text-white font-medium">{siem.events_sent.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Events Received</div>
                            <div className="text-white font-medium">{siem.events_received.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Rules Converted</div>
                            <div className="text-white font-medium">{siem.rules_converted}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Last Sync</div>
                            <div className="text-white font-medium">
                              {siem.last_sync === 'Never' ? 'Never' : 
                               new Date(siem.last_sync).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Telemetry Controls */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Telemetry Streaming</h3>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      {!isStreaming ? (
                        <Button
                          onClick={startTelemetryStream}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Streaming
                        </Button>
                      ) : (
                        <Button
                          onClick={stopTelemetryStream}
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-500/10"
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Stop Streaming
                        </Button>
                      )}
                    </div>
                    
                    {isStreaming && (
                      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex items-center space-x-2 text-green-400">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-sm font-medium">Live streaming active</span>
                        </div>
                        <div className="text-xs text-green-300 mt-1">
                          Sending telemetry events to all connected SIEMs
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rule Conversion */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Rule Conversion</h3>
                  <div className="space-y-3">
                    <Button
                      onClick={convertRules}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Convert All Rules
                    </Button>
                    
                    {conversionProgress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Conversion Progress</span>
                          <span className="text-white">{conversionProgress}%</span>
                        </div>
                        <Progress value={conversionProgress} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Panel - Detection Rules */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Detection Rules</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export All
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Rules
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {detectionRules.map((rule) => (
                    <motion.div
                      key={rule.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-lg border border-slate-700 bg-slate-800/30"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-white">{rule.name}</h4>
                            <Badge className={
                              rule.severity === 'critical' ? 'bg-red-500' :
                              rule.severity === 'high' ? 'bg-orange-500' :
                              rule.severity === 'medium' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }>
                              {rule.severity}
                            </Badge>
                            <Badge variant="outline">{rule.mitre_id}</Badge>
                          </div>
                          <p className="text-slate-400 mb-3">{rule.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-2">
                              {rule.status === 'deployed' ? (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              ) : rule.status === 'converting' ? (
                                <Clock className="h-4 w-4 text-yellow-400 animate-spin" />
                              ) : rule.status === 'error' ? (
                                <AlertTriangle className="h-4 w-4 text-red-400" />
                              ) : (
                                <Clock className="h-4 w-4 text-slate-400" />
                              )}
                              <span className={
                                rule.status === 'deployed' ? 'text-green-400' :
                                rule.status === 'converting' ? 'text-yellow-400' :
                                rule.status === 'error' ? 'text-red-400' :
                                'text-slate-400'
                              }>
                                {rule.status.charAt(0).toUpperCase() + rule.status.slice(1)}
                              </span>
                            </div>
                            
                            {rule.status === 'converting' && (
                              <div className="flex items-center space-x-2">
                                <Progress value={rule.conversion_progress} className="w-20 h-2" />
                                <span className="text-slate-400">{rule.conversion_progress}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* SIEM Versions */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(rule.siem_versions).map(([siem, filename]) => (
                          <div key={siem} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-white capitalize">{siem}</span>
                              {filename ? (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              ) : (
                                <Clock className="h-4 w-4 text-slate-400" />
                              )}
                            </div>
                            <div className="text-xs text-slate-400 truncate">
                              {filename || 'Pending conversion'}
                            </div>
                            {filename && (
                              <Button size="sm" variant="ghost" className="mt-2 w-full text-xs">
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 