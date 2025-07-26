'use client'

import { useEffect, useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardView } from '@/components/dashboard/DashboardView'
import { RuleEvaluationView } from '@/components/rule-evaluation/RuleEvaluationView'
import { SimulationView } from '@/components/simulation/SimulationView'
import { DetectionView } from '@/components/detection/DetectionView'
import { ReportsView } from '@/components/reports/ReportsView'
import { MitreView } from '@/components/mitre/MitreView'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { AuthModal } from '@/components/auth/AuthModal'
import { SettingsModal } from '@/components/settings/SettingsModal'
import { AppConfigModal } from '@/components/settings/AppConfigModal'
import { DocumentationModal } from '@/components/settings/DocumentationModal'
import { NotificationsModal } from '@/components/notifications/NotificationsModal'
import { useAppStore } from '@/stores/useAppStore'
import { useAuthStore } from '@/stores/useAuthStore'

export default function HomePage() {
  const { activeTab, setUser, showSettings, setShowSettings, showAppConfig, setShowAppConfig, showNotifications, setShowNotifications, showDocumentation, setShowDocumentation } = useAppStore()
  const { isAuthenticated, user, checkAuth } = useAuthStore()
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    // Check authentication on app load
    const isLoggedIn = checkAuth()
    if (!isLoggedIn) {
      setShowAuth(true)
    } else if (user) {
      // Sync authenticated user to app store
      setUser(user)
    }
  }, [checkAuth, user, setUser])

  useEffect(() => {
    // Hide auth modal when user becomes authenticated
    if (isAuthenticated && user) {
      setShowAuth(false)
      setUser(user)
    }
  }, [isAuthenticated, user, setUser])

  // Show auth modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <AuthModal 
          isOpen={showAuth || !isAuthenticated} 
          onClose={() => setShowAuth(false)}
        />
      </div>
    )
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />
      case 'simulation':
        return (
          <ErrorBoundary>
            <SimulationView />
          </ErrorBoundary>
        )
      case 'detection':
        return (
          <ErrorBoundary>
            <DetectionView />
          </ErrorBoundary>
        )
      case 'rule-evaluation':
        return (
          <ErrorBoundary>
            <RuleEvaluationView />
          </ErrorBoundary>
        )
      case 'reports':
        return (
          <ErrorBoundary>
            <ReportsView />
          </ErrorBoundary>
        )
      case 'mitre':
        return (
          <ErrorBoundary>
            <MitreView />
          </ErrorBoundary>
        )
      default:
        return <DashboardView />
    }
  }

  return (
    <>
      <AppShell>
        <div className="flex-1">
          {renderActiveView()}
        </div>
      </AppShell>
      
      {/* Global Modals - Outside layout to prevent z-index issues */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
      
      <AppConfigModal 
        isOpen={showAppConfig} 
        onClose={() => setShowAppConfig(false)} 
      />
      
      {/* Global Notifications Modal - Highest z-index */}
      <NotificationsModal 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
      
      <DocumentationModal 
        isOpen={showDocumentation} 
        onClose={() => setShowDocumentation(false)} 
      />
    </>
  )
} 