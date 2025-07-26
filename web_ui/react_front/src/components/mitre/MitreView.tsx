'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Map, 
  Target,
  Filter,
  Download,
  RefreshCw,
  Info,
  Eye,
  BarChart3,
  TrendingUp,
  Shield
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const tactics = [
  'Initial Access',
  'Execution',
  'Persistence',
  'Privilege Escalation',
  'Defense Evasion',
  'Credential Access',
  'Discovery',
  'Lateral Movement',
  'Collection',
  'Command and Control',
  'Exfiltration',
  'Impact'
]

const techniques = [
  { id: 'T1566', name: 'Phishing', tactic: 'Initial Access', coverage: 95, detections: 12 },
  { id: 'T1059', name: 'Command and Scripting Interpreter', tactic: 'Execution', coverage: 87, detections: 8 },
  { id: 'T1055', name: 'Process Injection', tactic: 'Defense Evasion', coverage: 65, detections: 4 },
  { id: 'T1003', name: 'OS Credential Dumping', tactic: 'Credential Access', coverage: 92, detections: 15 },
  { id: 'T1082', name: 'System Information Discovery', tactic: 'Discovery', coverage: 73, detections: 6 },
  { id: 'T1021', name: 'Remote Services', tactic: 'Lateral Movement', coverage: 45, detections: 3 },
  { id: 'T1005', name: 'Data from Local System', tactic: 'Collection', coverage: 38, detections: 2 },
  { id: 'T1071', name: 'Application Layer Protocol', tactic: 'Command and Control', coverage: 82, detections: 9 },
  { id: 'T1041', name: 'Exfiltration Over C2 Channel', tactic: 'Exfiltration', coverage: 67, detections: 5 },
  { id: 'T1486', name: 'Data Encrypted for Impact', tactic: 'Impact', coverage: 89, detections: 11 }
]

const getCoverageColor = (coverage: number) => {
  if (coverage >= 90) return 'bg-green-500'
  if (coverage >= 70) return 'bg-yellow-500'
  if (coverage >= 50) return 'bg-orange-500'
  return 'bg-red-500'
}

const getCoverageTextColor = (coverage: number) => {
  if (coverage >= 90) return 'text-green-400'
  if (coverage >= 70) return 'text-yellow-400'
  if (coverage >= 50) return 'text-orange-400'
  return 'text-red-400'
}

const stats = {
  totalTechniques: 120,
  coveredTechniques: 94,
  highCoverage: techniques.filter(t => t.coverage >= 90).length,
  lowCoverage: techniques.filter(t => t.coverage < 50).length,
  averageCoverage: Math.round(techniques.reduce((sum, t) => sum + t.coverage, 0) / techniques.length)
}

export function MitreView() {
  const [selectedTactic, setSelectedTactic] = useState<string>('all')
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null)

  const filteredTechniques = selectedTactic === 'all' 
    ? techniques 
    : techniques.filter(t => t.tactic === selectedTactic)

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              <Map className="h-10 w-10 text-cyan-400" />
              MITRE ATT&CK Heatmap
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
              Visualize detection coverage across MITRE ATT&CK techniques and tactics
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Coverage Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-6 md:grid-cols-5"
      >
        <Card className="glass-effect border-slate-700/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Techniques</p>
                <p className="text-2xl font-bold text-white">{stats.totalTechniques}</p>
              </div>
              <Target className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Covered</p>
                <p className="text-2xl font-bold text-cyan-400">{stats.coveredTechniques}</p>
              </div>
              <Shield className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">High Coverage</p>
                <p className="text-2xl font-bold text-green-400">{stats.highCoverage}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Low Coverage</p>
                <p className="text-2xl font-bold text-red-400">{stats.lowCoverage}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Avg Coverage</p>
                <p className="text-2xl font-bold text-blue-400">{stats.averageCoverage}%</p>
              </div>
              <Eye className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Tactic Filter */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <Card className="glass-effect border-slate-700/40">
            <CardHeader>
              <CardTitle className="text-lg text-white font-semibold flex items-center gap-2">
                <Filter className="h-5 w-5 text-purple-400" />
                Filter by Tactic
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={selectedTactic === 'all' ? 'default' : 'ghost'}
                className="w-full justify-start text-sm"
                onClick={() => setSelectedTactic('all')}
              >
                All Tactics
              </Button>
              {tactics.map((tactic) => {
                const techniqueCount = techniques.filter(t => t.tactic === tactic).length
                return (
                  <Button
                    key={tactic}
                    variant={selectedTactic === tactic ? 'default' : 'ghost'}
                    className="w-full justify-between text-sm"
                    onClick={() => setSelectedTactic(tactic)}
                  >
                    <span>{tactic}</span>
                    <Badge variant="secondary" className="text-xs">
                      {techniqueCount}
                    </Badge>
                  </Button>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Heatmap Visualization */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-9"
        >
          <Card className="glass-effect border-slate-700/40">
            <CardHeader>
              <CardTitle className="text-lg text-white font-semibold flex items-center gap-2">
                <Map className="h-5 w-5 text-cyan-400" />
                Coverage Heatmap
              </CardTitle>
              <CardDescription className="text-slate-400">
                {filteredTechniques.length} technique{filteredTechniques.length !== 1 ? 's' : ''} shown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Legend */}
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-400">Coverage:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-slate-300">Low (&lt;50%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-slate-300">Medium (50-69%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-slate-300">Good (70-89%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-slate-300">Excellent (≥90%)</span>
                  </div>
                </div>

                {/* Technique Grid */}
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {filteredTechniques.map((technique, index) => (
                    <motion.div
                      key={technique.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                        selectedTechnique === technique.id
                          ? 'border-blue-500/50 bg-blue-600/10'
                          : 'border-slate-700/30 bg-slate-800/30 hover:bg-slate-800/50'
                      }`}
                      onClick={() => setSelectedTechnique(
                        selectedTechnique === technique.id ? null : technique.id
                      )}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs font-mono">
                            {technique.id}
                          </Badge>
                          <div className={`w-3 h-3 rounded ${getCoverageColor(technique.coverage)}`}></div>
                        </div>
                        <h3 className="font-medium text-white text-sm">{technique.name}</h3>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">{technique.tactic}</span>
                          <span className={`font-mono ${getCoverageTextColor(technique.coverage)}`}>
                            {technique.coverage}%
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {technique.detections} detection{technique.detections !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 