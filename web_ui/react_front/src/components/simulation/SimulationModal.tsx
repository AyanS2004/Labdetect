'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Pause, Square, Zap, Shield, Target, Activity, BarChart3, AlertTriangle, CheckCircle, Clock, Database, Server, Eye, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface SimulationModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SimulationStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  duration: number
  technique?: string
  mitreId?: string
  detections?: number
}

interface TelemetryEvent {
  id: string
  timestamp: string
  source: string
  event_type: string
  technique: string
  mitre_id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  siem_status: 'pending' | 'sent' | 'detected' | 'failed'
}

export function SimulationModal({ isOpen, onClose }: SimulationModalProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [simulationProgress, setSimulationProgress] = useState(0)
  const [telemetryEvents, setTelemetryEvents] = useState<TelemetryEvent[]>([])
  const [selectedAptGroup, setSelectedAptGroup] = useState('APT29')
  const [selectedTargets, setSelectedTargets] = useState(['workstation-01', 'server-02', 'domain-controller'])
  const [siemIntegrations, setSiemIntegrations] = useState([
    { name: 'Splunk', status: 'connected', events: 0 },
    { name: 'Elastic', status: 'connected', events: 0 },
    { name: 'Grafana', status: 'connected', events: 0 }
  ])

  const simulationSteps: SimulationStep[] = [
    {
      id: 'init',
      name: 'Initialization',
      description: 'Setting up simulation environment and target validation',
      status: 'pending',
      progress: 0,
      duration: 30
    },
    {
      id: 'recon',
      name: 'Reconnaissance',
      description: 'Gathering target information and network mapping',
      status: 'pending',
      progress: 0,
      duration: 45,
      technique: 'Active Scanning',
      mitreId: 'T1595'
    },
    {
      id: 'access',
      name: 'Initial Access',
      description: 'Establishing foothold using phishing techniques',
      status: 'pending',
      progress: 0,
      duration: 60,
      technique: 'Phishing',
      mitreId: 'T1566'
    },
    {
      id: 'execution',
      name: 'Execution',
      description: 'Deploying payloads and executing commands',
      status: 'pending',
      progress: 0,
      duration: 90,
      technique: 'Command and Scripting Interpreter',
      mitreId: 'T1059'
    },
    {
      id: 'persistence',
      name: 'Persistence',
      description: 'Establishing persistent access mechanisms',
      status: 'pending',
      progress: 0,
      duration: 75,
      technique: 'Boot or Logon Autostart Execution',
      mitreId: 'T1547'
    },
    {
      id: 'privilege',
      name: 'Privilege Escalation',
      description: 'Elevating privileges and expanding access',
      status: 'pending',
      progress: 0,
      duration: 120,
      technique: 'Process Injection',
      mitreId: 'T1055'
    },
    {
      id: 'defense',
      name: 'Defense Evasion',
      description: 'Bypassing security controls and hiding activities',
      status: 'pending',
      progress: 0,
      duration: 90,
      technique: 'Obfuscated Files or Information',
      mitreId: 'T1027'
    },
    {
      id: 'collection',
      name: 'Collection',
      description: 'Gathering sensitive data and credentials',
      status: 'pending',
      progress: 0,
      duration: 60,
      technique: 'Credential Access',
      mitreId: 'T1003'
    },
    {
      id: 'exfiltration',
      name: 'Data Exfiltration',
      description: 'Transferring collected data to external systems',
      status: 'pending',
      progress: 0,
      duration: 45,
      technique: 'Exfiltration Over C2 Channel',
      mitreId: 'T1041'
    },
    {
      id: 'cleanup',
      name: 'Cleanup',
      description: 'Removing traces and covering tracks',
      status: 'pending',
      progress: 0,
      duration: 30,
      technique: 'Indicator Removal',
      mitreId: 'T1070'
    }
  ]

  const aptGroups = [
    { id: 'APT29', name: 'APT29 (Cozy Bear)', description: 'Russian state-sponsored group', techniques: 15 },
    { id: 'APT28', name: 'APT28 (Fancy Bear)', description: 'Russian military intelligence', techniques: 12 },
    { id: 'APT41', name: 'APT41 (BARIUM)', description: 'Chinese state-sponsored group', techniques: 18 },
    { id: 'Lazarus', name: 'Lazarus Group', description: 'North Korean cyber operations', techniques: 14 }
  ]

  const generateTelemetryEvent = (step?: SimulationStep): TelemetryEvent => {
    if (!step) {
      return {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        source: 'Unknown',
        event_type: 'unknown',
        technique: 'Unknown',
        mitre_id: 'T0000',
        severity: 'low',
        description: 'Unknown event',
        siem_status: 'pending'
      }
    }
    const eventTypes = ['process_creation', 'network_connection', 'file_access', 'registry_modification', 'dns_query']
    const sources = ['Sysmon', 'Security', 'Network', 'Endpoint']
    const severities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical']
    return {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      source: sources[Math.floor(Math.random() * sources.length)],
      event_type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      technique: step.technique || 'Unknown',
      mitre_id: step.mitreId || 'T0000',
      severity: severities[Math.floor(Math.random() * severities.length)],
      description: `${step.name} activity detected - ${step.description}`,
      siem_status: 'pending'
    }
  }

  const startSimulation = () => {
    setIsRunning(true)
    setCurrentStep(0)
    setSimulationProgress(0)
    setTelemetryEvents([])
    
    // Reset SIEM counters
    setSiemIntegrations(prev => prev.map(siem => ({ ...siem, events: 0 })))
  }

  const stopSimulation = () => {
    setIsRunning(false)
    setCurrentStep(0)
    setSimulationProgress(0)
  }

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        const newProgress = prev + 1
        const stepProgress = (newProgress % 100) / 100
        
        // Update current step
        if (newProgress % 100 === 0 && currentStep < simulationSteps.length - 1) {
          setCurrentStep(prev => prev + 1)
        }
        
        // Generate telemetry events
        if (Math.random() > 0.7) {
          const currentStepData = simulationSteps[currentStep] || undefined
          const newEvent = generateTelemetryEvent(currentStepData)
          setTelemetryEvents(prev => [newEvent, ...prev.slice(0, 49)]) // Keep last 50 events
          
          // Update SIEM counters
          setSiemIntegrations(prev => prev.map(siem => ({
            ...siem,
            events: siem.events + 1
          })))
        }
        
        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isRunning, currentStep, simulationSteps])

  if (!isOpen) return null

  const currentStepData = simulationSteps[currentStep] || null
  const completedSteps = simulationSteps.filter(step => step.status === 'completed').length
  const totalSteps = simulationSteps.length

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
                <Zap className="h-6 w-6 text-blue-400" />
                <div>
                  <CardTitle className="text-xl font-bold text-white">Breach Simulation</CardTitle>
                  <CardDescription className="text-slate-400">
                    MITRE ATT&CK mapped APT simulation with SIEM integration
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
              {/* Left Panel - Configuration & Progress */}
              <div className="w-96 border-r border-slate-700/50 p-6 overflow-y-auto">
                {/* APT Group Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">APT Group</h3>
                  <div className="space-y-2">
                    {aptGroups.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => setSelectedAptGroup(group.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedAptGroup === group.id
                            ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                            : 'border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{group.name}</div>
                            <div className="text-sm text-slate-500">{group.description}</div>
                          </div>
                          <Badge variant="secondary">{group.techniques} techniques</Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulation Controls */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Controls</h3>
                  <div className="flex space-x-2">
                    {!isRunning ? (
                      <Button
                        onClick={startSimulation}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Simulation
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => setIsRunning(false)}
                          variant="outline"
                          className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                        <Button
                          onClick={stopSimulation}
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-500/10"
                        >
                          <Square className="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Progress Overview */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Overall Progress</span>
                        <span className="text-white">{Math.round((simulationProgress / (totalSteps * 100)) * 100)}%</span>
                      </div>
                      <Progress value={(simulationProgress / (totalSteps * 100)) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Steps Completed</span>
                        <span className="text-white">{completedSteps}/{totalSteps}</span>
                      </div>
                      <Progress value={(completedSteps / totalSteps) * 100} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* SIEM Integration Status */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">SIEM Integration</h3>
                  <div className="space-y-3">
                    {siemIntegrations.map((siem) => (
                      <div key={siem.name} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            siem.status === 'connected' ? 'bg-green-400' : 'bg-red-400'
                          }`} />
                          <span className="text-white font-medium">{siem.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-400">{siem.events} events</div>
                          <div className="text-xs text-slate-500">{siem.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Panel - Simulation Steps & Telemetry */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full flex flex-col">
                  {/* Current Step */}
                  <div className="p-6 border-b border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                          {currentStepData?.name || 'Simulation Complete'}
                        </h2>
                        <p className="text-slate-400">
                          {currentStepData?.description || 'All simulation steps completed'}
                        </p>
                      </div>
                      {currentStepData && (
                        <div className="text-right">
                          <Badge className="mb-2" variant="outline">
                            {currentStepData.mitreId}
                          </Badge>
                          <div className="text-sm text-slate-400">{currentStepData.technique}</div>
                        </div>
                      )}
                    </div>
                    {currentStepData && (
                      <Progress value={simulationProgress % 100} className="h-3" />
                    )}
                  </div>

                  {/* Simulation Steps */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    <h3 className="text-lg font-semibold text-white mb-4">Attack Chain</h3>
                    <div className="space-y-3">
                      {simulationSteps.map((step, index) => (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-lg border transition-all ${
                            index === currentStep && isRunning
                              ? 'border-blue-500 bg-blue-500/10'
                              : index < currentStep
                              ? 'border-green-500 bg-green-500/10'
                              : 'border-slate-700 bg-slate-800/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                index === currentStep && isRunning
                                  ? 'bg-blue-500 text-white'
                                  : index < currentStep
                                  ? 'bg-green-500 text-white'
                                  : 'bg-slate-600 text-slate-400'
                              }`}>
                                {index < currentStep ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : index === currentStep && isRunning ? (
                                  <Activity className="h-4 w-4 animate-pulse" />
                                ) : (
                                  <span className="text-sm font-medium">{index + 1}</span>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-white">{step.name}</div>
                                <div className="text-sm text-slate-400">{step.description}</div>
                                {step.mitreId && (
                                  <div className="text-xs text-blue-400 mt-1">
                                    {step.mitreId} - {step.technique}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-slate-400">{step.duration}s</div>
                              {step.detections && (
                                <div className="text-xs text-green-400">{step.detections} detections</div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Telemetry Panel */}
              <div className="w-96 border-l border-slate-700/50 p-6 overflow-y-auto">
                <h3 className="text-lg font-semibold text-white mb-4">Live Telemetry</h3>
                <div className="space-y-3">
                  {telemetryEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg border ${
                        event.severity === 'critical' ? 'border-red-500 bg-red-500/10' :
                        event.severity === 'high' ? 'border-orange-500 bg-orange-500/10' :
                        event.severity === 'medium' ? 'border-yellow-500 bg-yellow-500/10' :
                        'border-slate-700 bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {event.mitre_id}
                          </Badge>
                          <Badge className={`text-xs ${
                            event.severity === 'critical' ? 'bg-red-500' :
                            event.severity === 'high' ? 'bg-orange-500' :
                            event.severity === 'medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}>
                            {event.severity}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-sm text-white font-medium mb-1">{event.event_type}</div>
                      <div className="text-xs text-slate-400 mb-2">{event.description}</div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Source: {event.source}</span>
                        <div className={`flex items-center space-x-1 ${
                          event.siem_status === 'detected' ? 'text-green-400' :
                          event.siem_status === 'sent' ? 'text-blue-400' :
                          'text-slate-500'
                        }`}>
                          <Server className="h-3 w-3" />
                          <span>{event.siem_status}</span>
                        </div>
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