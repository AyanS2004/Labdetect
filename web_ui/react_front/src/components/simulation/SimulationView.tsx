'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  PlayCircle, 
  StopCircle, 
  Settings,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  Shield
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const aptProfiles = [
  { id: 'apt1', name: 'APT1 (Comment Crew)', sophistication: 'High', region: 'China', techniques: ['T1566', 'T1055', 'T1003'] },
  { id: 'apt29', name: 'APT29 (Cozy Bear)', sophistication: 'Very High', region: 'Russia', techniques: ['T1078', 'T1027', 'T1071'] },
  { id: 'lazarus', name: 'Lazarus Group', sophistication: 'Very High', region: 'North Korea', techniques: ['T1190', 'T1059', 'T1105'] },
  { id: 'apt40', name: 'APT40 (Leviathan)', sophistication: 'High', region: 'China', techniques: ['T1566', 'T1133', 'T1082'] }
]

const recentSimulations = [
  { id: '1', aptProfile: 'APT29', status: 'completed', duration: '23m 45s', techniques: 12, detected: 10, timestamp: '2 hours ago' },
  { id: '2', aptProfile: 'Lazarus Group', status: 'running', duration: '8m 12s', techniques: 7, detected: 5, timestamp: 'Now' },
  { id: '3', aptProfile: 'APT1', status: 'failed', duration: '15m 32s', techniques: 8, detected: 3, timestamp: '1 day ago' },
]

export function SimulationView() {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const startSimulation = () => {
    if (selectedProfile) {
      setIsRunning(true)
      // Simulate stopping after a delay
      setTimeout(() => setIsRunning(false), 5000)
    }
  }

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col space-y-3"
      >
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            <PlayCircle className="h-10 w-10 text-green-400" />
            APT Attack Simulation
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Run realistic Advanced Persistent Threat attack scenarios to test your detection capabilities
          </p>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* APT Profile Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-5"
        >
          <Card className="glass-effect border-slate-700/40">
            <CardHeader>
              <CardTitle className="text-xl text-white font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-red-400" />
                Select APT Profile
              </CardTitle>
              <CardDescription className="text-slate-400">
                Choose an adversary profile for simulation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {aptProfiles.map((profile) => (
                <motion.button
                  key={profile.id}
                  onClick={() => setSelectedProfile(profile.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                    selectedProfile === profile.id
                      ? 'bg-blue-600/15 border-blue-500/25 text-blue-400'
                      : 'bg-slate-800/30 border-slate-700/30 text-slate-300 hover:bg-slate-800/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{profile.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {profile.sophistication}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500">Region: {profile.region}</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.techniques.map((technique) => (
                        <Badge key={technique} variant="secondary" className="text-xs font-mono">
                          {technique}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.button>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Simulation Control */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Control Panel */}
          <Card className="glass-effect border-slate-700/40">
            <CardHeader>
              <CardTitle className="text-xl text-white font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-400" />
                Simulation Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {selectedProfile ? aptProfiles.find(p => p.id === selectedProfile)?.name : 'No profile selected'}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {isRunning ? 'Simulation in progress...' : 'Ready to simulate'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={startSimulation}
                    disabled={!selectedProfile || isRunning}
                    className="flex items-center gap-2"
                    variant={isRunning ? "destructive" : "default"}
                  >
                    {isRunning ? (
                      <>
                        <StopCircle className="h-4 w-4" />
                        Stop
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-4 w-4" />
                        Start Simulation
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {isRunning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-900/10 border border-green-600/20 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-green-400 animate-pulse" />
                    <span className="text-green-400 font-semibold">Simulation Running</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Duration</p>
                      <p className="text-white">8m 42s</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Techniques</p>
                      <p className="text-white">7/12</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Detected</p>
                      <p className="text-white">5/7</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Recent Simulations */}
          <Card className="glass-effect border-slate-700/40">
            <CardHeader>
              <CardTitle className="text-xl text-white font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-400" />
                Recent Simulations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSimulations.map((sim) => (
                  <div key={sim.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{sim.aptProfile}</span>
                        <Badge 
                          variant={sim.status === 'completed' ? 'default' : sim.status === 'running' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {sim.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400">{sim.timestamp}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm text-white">{sim.duration}</p>
                      <p className="text-xs text-slate-400">{sim.detected}/{sim.techniques} detected</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 