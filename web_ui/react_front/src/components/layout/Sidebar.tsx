'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { 
  BarChart3, 
  Shield, 
  PlayCircle, 
  FileText, 
  Map, 
  Menu,
  Settings,
  HelpCircle,
  Home,
  Brain,
  LayoutDashboard,
  Activity,
  Search,
  Target
} from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    description: 'Overview & metrics'
  },
  {
    id: 'simulation',
    label: 'Run Simulation',
    icon: PlayCircle,
    description: 'APT attack simulation'
  },
  {
    id: 'detection',
    label: 'Detection Results',
    icon: Shield,
    description: 'Analysis & validation'
  },
  {
    id: 'rule-evaluation',
    label: 'Rule Evaluations',
    icon: Brain,
    description: 'LLM rule analysis'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    description: 'Generated reports'
  },
  {
    id: 'mitre',
    label: 'MITRE Heatmap',
    icon: Map,
    description: 'Coverage visualization'
  }
]

const bottomItems = [
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    description: 'App configuration'
  },
  {
    id: 'help',
    label: 'Help',
    icon: HelpCircle,
    description: 'Documentation'
  }
]

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, activeTab, setActiveTab, showDocumentation, setShowDocumentation } = useAppStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex h-full flex-col glass-effect border-r border-slate-700/30">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-700/30">
        <motion.div
          initial={false}
          animate={{ opacity: sidebarCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center space-x-3"
        >
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Shield className="h-6 w-6 text-blue-400" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Detection Lab</span>
              <span className="text-xs text-slate-400">AI-Powered</span>
            </div>
          )}
        </motion.div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-3">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <motion.div
              key={item.id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "relative flex w-full items-center rounded-xl px-3 py-3 text-left text-sm transition-all duration-200",
                  "hover:bg-slate-800/40 focus:outline-none focus:bg-slate-800/40",
                  isActive 
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/25 shadow-lg shadow-blue-500/10" 
                    : "text-slate-300 hover:text-white border border-transparent",
                  sidebarCollapsed ? "justify-center" : "space-x-3"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  isActive ? "bg-blue-500/20 text-blue-400" : "text-slate-400 group-hover:text-white"
                )}>
                  <Icon className="h-4 w-4 flex-shrink-0" />
                </div>
                
                {!sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col space-y-0.5"
                  >
                    <span className="font-medium text-sm">{item.label}</span>
                    <span className="text-xs text-slate-500">{item.description}</span>
                  </motion.div>
                )}

                {mounted && isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/5 to-blue-600/10"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            </motion.div>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-slate-700/30 p-3 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon
          
          const handleClick = () => {
            if (item.id === 'settings') {
              // Open app config modal through global state
              const { setShowAppConfig } = useAppStore.getState()
              setShowAppConfig(true)
            } else if (item.id === 'help') {
              // Open documentation modal
              setShowDocumentation(true)
            }
          }
          
          return (
            <motion.div
              key={item.id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={handleClick}
                className={cn(
                  "flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200",
                  "text-slate-400 hover:text-white hover:bg-slate-800/40 focus:outline-none focus:bg-slate-800/40",
                  sidebarCollapsed ? "justify-center" : "space-x-3"
                )}
              >
                <div className="p-1.5 rounded-lg text-slate-500">
                  <Icon className="h-4 w-4 flex-shrink-0" />
                </div>
                {!sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col space-y-0.5"
                  >
                    <span className="font-medium text-sm">{item.label}</span>
                    <span className="text-xs text-slate-500">{item.description}</span>
                  </motion.div>
                )}
              </button>
            </motion.div>
          )
        })}
      </div>
      
    </div>
  )
} 