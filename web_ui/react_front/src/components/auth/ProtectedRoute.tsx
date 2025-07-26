'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { AuthModal } from './AuthModal'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, checkAuth } = useAuthStore()
  const [showAuth, setShowAuth] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const isLoggedIn = checkAuth()
    setShowAuth(!isLoggedIn)
    setIsChecking(false)
  }, [checkAuth])

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Show auth modal if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        {fallback || (
          <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <AuthModal 
              isOpen={showAuth || !isAuthenticated} 
              onClose={() => setShowAuth(false)}
            />
          </div>
        )}
      </>
    )
  }

  return <>{children}</>
} 