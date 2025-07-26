'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Eye,
  Filter,
  Search,
  TrendingUp,
  Target,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const detectionResults = [
  { 
    id: '1', 
    technique: 'T1566.001', 
    name: 'Spearphishing Attachment', 
    tactic: 'Initial Access',
    status: 'detected', 
    confidence: 95, 
    severity: 'high',
    timestamp: '2 minutes ago',
    evidence: 'Malicious email attachment detected',
    source: 'Email Gateway'
  },
  { 
    id: '2', 
    technique: 'T1055.012', 
    name: 'Process Hollowing', 
    tactic: 'Defense Evasion',
    status: 'missed', 
    confidence: 0, 
    severity: 'critical',
    timestamp: '15 minutes ago',
    evidence: 'No detection rule triggered',
    source: 'EDR'
  },
  { 
    id: '3', 
    technique: 'T1003.001', 
    name: 'LSASS Memory', 
    tactic: 'Credential Access',
    status: 'detected', 
    confidence: 87, 
    severity: 'critical',
    timestamp: '1 hour ago',
    evidence: 'Suspicious LSASS access detected',
    source: 'Sysmon'
  },
  { 
    id: '4', 
    technique: 'T1071.001', 
    name: 'Web Protocols', 
    tactic: 'Command and Control',
    status: 'partial', 
    confidence: 65, 
    severity: 'medium',
    timestamp: '2 hours ago',
    evidence: 'Suspicious HTTP traffic patterns',
    source: 'Network Monitor'
  }
]

const severityColors = {
  critical: 'text-red-400 bg-red-900/20 border-red-600/30',
  high: 'text-orange-400 bg-orange-900/20 border-orange-600/30',
  medium: 'text-amber-400 bg-amber-900/20 border-amber-600/30',
  low: 'text-blue-400 bg-blue-900/20 border-blue-600/30'
}

const statusIcons = {
  detected: <CheckCircle className="h-4 w-4 text-green-400" />,
  missed: <XCircle className="h-4 w-4 text-red-400" />,
  partial: <AlertTriangle className="h-4 w-4 text-amber-400" />
}

export function DetectionView() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'detected' | 'missed' | 'partial'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredResults = detectionResults.filter(result => {
    const matchesFilter = selectedFilter === 'all' || result.status === selectedFilter
    const matchesSearch = result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.technique.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: detectionResults.length,
    detected: detectionResults.filter(r => r.status === 'detected').length,
    missed: detectionResults.filter(r => r.status === 'missed').length,
    partial: detectionResults.filter(r => r.status === 'partial').length
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
            <Shield className="h-10 w-10 text-blue-400" />
            Detection Results
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Analysis and validation of attack technique detections across your security stack
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-6 md:grid-cols-4"
      >
        <Card className="glass-effect border-slate-700/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Techniques</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Target className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Detected</p>
                <p className="text-2xl font-bold text-green-400">{stats.detected}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Missed</p>
                <p className="text-2xl font-bold text-red-400">{stats.missed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Detection Rate</p>
                <p className="text-2xl font-bold text-blue-400">
                  {Math.round((stats.detected / stats.total) * 100)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between"
      >
        <div className="flex gap-2">
          {['all', 'detected', 'missed', 'partial'].map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(filter as any)}
              className="capitalize"
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search techniques..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
      </motion.div>

      {/* Detection Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="glass-effect border-slate-700/40">
          <CardHeader>
            <CardTitle className="text-xl text-white font-semibold flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-400" />
              Detection Analysis
            </CardTitle>
            <CardDescription className="text-slate-400">
              {filteredResults.length} technique{filteredResults.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        {statusIcons[result.status as keyof typeof statusIcons]}
                        <div>
                          <h3 className="font-semibold text-white">{result.name}</h3>
                          <p className="text-sm text-slate-400 font-mono">{result.technique}</p>
                        </div>
                        <Badge variant="outline" className="ml-auto">
                          {result.tactic}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Evidence</p>
                          <p className="text-white">{result.evidence}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Source</p>
                          <p className="text-white">{result.source}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Timestamp</p>
                          <p className="text-white">{result.timestamp}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <Badge 
                        className={`${severityColors[result.severity as keyof typeof severityColors]} text-xs`}
                      >
                        {result.severity}
                      </Badge>
                      {result.confidence > 0 && (
                        <div className="text-sm">
                          <p className="text-slate-400">Confidence</p>
                          <p className="text-white font-mono">{result.confidence}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 