'use client'

import { motion } from 'framer-motion'
import { 
  Activity, 
  Shield, 
  Clock, 
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const kpiData = [
  {
    title: 'Total Simulations',
    value: '247',
    change: '+12%',
    trend: 'up',
    icon: Activity,
    description: 'APT attacks simulated',
    color: 'text-blue-500'
  },
  {
    title: 'Detection Success Rate',
    value: '87.3%',
    change: '+2.4%',
    trend: 'up',
    icon: Shield,
    description: 'Coverage efficiency',
    color: 'text-green-500'
  },
  {
    title: 'Avg Response Time',
    value: '3.2min',
    change: '-8s',
    trend: 'down',
    icon: Clock,
    description: 'Mean time to detect',
    color: 'text-amber-500'
  },
  {
    title: 'Techniques Covered',
    value: '94/120',
    change: '+7',
    trend: 'up',
    icon: Target,
    description: 'MITRE ATT&CK coverage',
    color: 'text-purple-500'
  }
]

const recentActivity = [
  {
    id: 1,
    type: 'simulation',
    title: 'APT29 Simulation Completed',
    description: 'Cozy Bear attack chain executed successfully',
    time: '2 minutes ago',
    status: 'success',
    icon: CheckCircle
  },
  {
    id: 2,
    type: 'detection',
    title: 'T1055 Process Injection Detected',
    description: '94% confidence level validation',
    time: '8 minutes ago',
    status: 'warning',
    icon: AlertTriangle
  },
  {
    id: 3,
    type: 'failure',
    title: 'T1090 Proxy Detection Failed',
    description: 'Coverage gap identified in network monitoring',
    time: '15 minutes ago',
    status: 'error',
    icon: XCircle
  },
  {
    id: 4,
    type: 'report',
    title: 'Weekly Analysis Report Generated',
    description: 'Comprehensive coverage analysis available',
    time: '1 hour ago',
    status: 'success',
    icon: CheckCircle
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success':
      return 'text-green-500 bg-green-500/10'
    case 'warning':
      return 'text-amber-500 bg-amber-500/10'
    case 'error':
      return 'text-red-500 bg-red-500/10'
    default:
      return 'text-gray-500 bg-gray-500/10'
  }
}

export function DashboardView() {
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
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Detection Engineering Dashboard
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Monitor APT simulations, detection coverage, and security metrics in real-time
          </p>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="group"
            >
              <Card className="glass-effect border-slate-700/40 hover:border-blue-500/30 transition-all duration-300 h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-slate-300 leading-none">
                    {kpi.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-slate-800/50 group-hover:bg-slate-700/50 transition-colors`}>
                    <Icon className={`h-5 w-5 ${kpi.color} group-hover:scale-110 transition-transform duration-200`} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-baseline space-x-3">
                    <div className="text-3xl font-bold text-white tracking-tight">
                      {kpi.value}
                    </div>
                    <Badge 
                      variant={kpi.trend === 'up' ? 'success' : 'secondary'}
                      className="text-xs font-medium"
                    >
                      {kpi.change}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {kpi.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Telemetry Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-8"
        >
          <Card className="glass-effect border-slate-700/40 h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl text-white font-semibold">Real-time Telemetry</CardTitle>
                  <CardDescription className="text-slate-400">
                    Incoming security events and detection alerts
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="status-indicator status-green"></div>
                  <span className="text-sm text-slate-400">Live</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border-2 border-dashed border-slate-600/30 rounded-xl bg-slate-800/20">
                <div className="text-center space-y-3">
                  <div className="p-4 rounded-full bg-slate-700/30 mx-auto w-fit">
                    <TrendingUp className="h-8 w-8 text-blue-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-300 font-medium">Live telemetry chart</p>
                    <p className="text-sm text-slate-500">Connected to real-time data stream</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Feed & Coverage */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glass-effect border-slate-700/40">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg text-white font-semibold">Recent Activity</CardTitle>
                    <CardDescription className="text-slate-400">
                      Latest simulation results and detections
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      className="flex items-start space-x-3 p-3 rounded-xl hover:bg-slate-800/30 transition-all duration-200 border border-transparent hover:border-slate-700/50"
                    >
                      <div className={`p-2 rounded-lg ${getStatusColor(activity.status)} shadow-sm`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-sm font-medium text-white leading-tight">
                          {activity.title}
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {activity.description}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Coverage Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="glass-effect border-slate-700/40">
              <CardHeader className="pb-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg text-white font-semibold">Detection Coverage</CardTitle>
                  <CardDescription className="text-slate-400">
                    MITRE ATT&CK technique coverage breakdown
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-600/30 rounded-xl bg-slate-800/20">
                  <div className="text-center space-y-3">
                    <div className="p-4 rounded-full bg-slate-700/30 mx-auto w-fit">
                      <Target className="h-8 w-8 text-purple-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-300 font-medium">Coverage donut chart</p>
                      <p className="text-sm text-slate-500">Full/Partial/None breakdown</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 