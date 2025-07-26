'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/stores/useAppStore'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { sidebarCollapsed } = useAppStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="cyber-grid min-h-screen">
        <div className="flex h-screen overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={sidebarCollapsed ? 'collapsed' : 'expanded'}
              initial={{ width: sidebarCollapsed ? 80 : 280 }}
              animate={{ width: sidebarCollapsed ? 80 : 280 }}
              exit={{ width: sidebarCollapsed ? 80 : 280 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="relative z-30"
            >
              <Sidebar />
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-1 flex-col overflow-hidden">
            <TopBar />
            
            <main 
              className={cn(
                "flex-1 overflow-y-auto relative z-10",
                "bg-gradient-to-br from-slate-900/20 to-slate-800/10"
              )}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="h-full"
              >
                {children}
              </motion.div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
} 