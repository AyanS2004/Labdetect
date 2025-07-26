'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Download,
  Eye,
  Calendar,
  Filter,
  Search,
  Plus,
  BarChart3,
  PieChart,
  Map
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const reportTypes = [
  { id: 'apt-analysis', name: 'APT Analysis', icon: BarChart3, color: 'text-blue-400' },
  { id: 'coverage-report', name: 'Coverage Report', icon: PieChart, color: 'text-green-400' },
  { id: 'mitre-heatmap', name: 'MITRE Heatmap', icon: Map, color: 'text-purple-400' },
  { id: 'intelligence-brief', name: 'Intelligence Brief', icon: FileText, color: 'text-amber-400' }
]

const reports = [
  {
    id: '1',
    title: 'APT29 Attack Campaign Analysis',
    type: 'apt-analysis',
    generatedAt: '2024-01-25T10:30:00Z',
    format: 'pdf',
    size: '2.4 MB',
    description: 'Comprehensive analysis of APT29 attack techniques and detection coverage',
    tags: ['APT29', 'Russia', 'Cozy Bear'],
    status: 'ready'
  },
  {
    id: '2',
    title: 'Q4 2024 Detection Coverage Report',
    type: 'coverage-report',
    generatedAt: '2024-01-24T14:15:00Z',
    format: 'pdf',
    size: '1.8 MB',
    description: 'Quarterly overview of MITRE ATT&CK technique coverage and gaps',
    tags: ['Q4 2024', 'Coverage', 'MITRE'],
    status: 'ready'
  },
  {
    id: '3',
    title: 'MITRE ATT&CK Heatmap - January 2024',
    type: 'mitre-heatmap',
    generatedAt: '2024-01-23T09:45:00Z',
    format: 'json',
    size: '456 KB',
    description: 'Visual representation of technique coverage and detection effectiveness',
    tags: ['Heatmap', 'January', 'Visualization'],
    status: 'ready'
  },
  {
    id: '4',
    title: 'Threat Intelligence Brief - Week 4',
    type: 'intelligence-brief',
    generatedAt: '2024-01-22T16:20:00Z',
    format: 'markdown',
    size: '89 KB',
    description: 'Weekly threat landscape summary and emerging attack patterns',
    tags: ['Week 4', 'Intelligence', 'Threats'],
    status: 'generating'
  }
]

const formatFileSize = (size: string) => size

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

export function ReportsView() {
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredReports = reports.filter(report => {
    const matchesType = selectedType === 'all' || report.type === selectedType
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesType && matchesSearch
  })

  const getTypeIcon = (type: string) => {
    const typeConfig = reportTypes.find(t => t.id === type)
    if (!typeConfig) return FileText
    return typeConfig.icon
  }

  const getTypeColor = (type: string) => {
    const typeConfig = reportTypes.find(t => t.id === type)
    return typeConfig?.color || 'text-slate-400'
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
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              <FileText className="h-10 w-10 text-emerald-400" />
              Reports
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
              Generate and manage comprehensive security analysis reports
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </motion.div>

      {/* Report Type Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-6 md:grid-cols-4"
      >
        {reportTypes.map((type, index) => {
          const Icon = type.icon
          const count = reports.filter(r => r.type === type.id).length
          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Card className="glass-effect border-slate-700/40 hover:border-slate-600/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">{type.name}</p>
                      <p className="text-2xl font-bold text-white">{count}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${type.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between"
      >
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('all')}
          >
            All Types
          </Button>
          {reportTypes.map((type) => (
            <Button
              key={type.id}
              variant={selectedType === type.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type.id)}
              className="capitalize"
            >
              {type.name}
            </Button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
      </motion.div>

      {/* Reports List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="glass-effect border-slate-700/40">
          <CardHeader>
            <CardTitle className="text-xl text-white font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-400" />
              Generated Reports
            </CardTitle>
            <CardDescription className="text-slate-400">
              {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReports.map((report, index) => {
                const TypeIcon = getTypeIcon(report.type)
                return (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <TypeIcon className={`h-5 w-5 ${getTypeColor(report.type)}`} />
                          <div>
                            <h3 className="font-semibold text-white">{report.title}</h3>
                            <p className="text-sm text-slate-400">{report.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {report.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-400">Generated</p>
                            <p className="text-white">{formatDate(report.generatedAt)}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Format</p>
                            <p className="text-white uppercase">{report.format}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Size</p>
                            <p className="text-white">{report.size}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Preview
                        </Button>
                        <Button 
                          variant={report.status === 'ready' ? 'default' : 'secondary'} 
                          size="sm" 
                          className="flex items-center gap-1"
                          disabled={report.status !== 'ready'}
                        >
                          <Download className="h-3 w-3" />
                          {report.status === 'ready' ? 'Download' : 'Generating...'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 