'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="glass-effect border-red-700/40 max-w-md mx-auto">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <CardTitle className="text-lg text-white font-semibold">
                Something went wrong
              </CardTitle>
            </div>
            <CardDescription className="text-slate-400">
              An error occurred while rendering this component
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {this.state.error && (
              <div className="bg-red-900/10 border border-red-600/20 rounded-lg p-3">
                <p className="text-sm text-red-300 font-mono">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <Button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="w-full flex items-center gap-2"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
} 