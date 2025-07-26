'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Bell, Palette, Shield, Save, Camera } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useAppStore } from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

type SettingsTab = 'profile' | 'notifications' | 'preferences' | 'security'

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [isLoading, setIsLoading] = useState(false)
  const { user, setUser } = useAuthStore()
  const { theme, setTheme } = useAppStore()

  // Local state for form data
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'analyst'
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    securityAlerts: true,
    systemUpdates: false,
    weeklyReports: true
  })

  const [preferences, setPreferences] = useState({
    primaryColor: theme.primaryColor,
    radius: theme.radius,
    autoRefresh: true,
    compactMode: false,
    showAdvancedFeatures: true
  })

  if (!isOpen) return null

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUser({ ...user!, ...profileData })
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePreferences = async () => {
    setIsLoading(true)
    try {
      // Update theme
      setTheme({
        primaryColor: preferences.primaryColor,
        radius: preferences.radius
      })
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield }
  ] as const

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20 ring-4 ring-slate-700/50">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-xl font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-slate-700 hover:bg-slate-600 border-2 border-slate-900"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{user?.name}</h3>
                <p className="text-slate-400">{user?.email}</p>
                <Badge variant="secondary" className="mt-1 capitalize">
                  {user?.role}
                </Badge>
              </div>
            </div>

            {/* Profile Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Role</label>
                <select
                  value={profileData.role}
                  onChange={(e) => setProfileData(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                >
                  <option value="viewer">Viewer</option>
                  <option value="analyst">Analyst</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {Object.entries(notificationSettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <p className="text-xs text-slate-400 mt-1">
                      {getNotificationDescription(key)}
                    </p>
                  </div>
                  <button
                    onClick={() => setNotificationSettings(prev => ({ ...prev, [key]: !value }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-blue-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <Button
              onClick={handleSaveNotifications}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Notifications'}
            </Button>
          </div>
        )

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Primary Color</label>
                <div className="flex space-x-2">
                  {['blue', 'green', 'purple', 'red', 'orange'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setPreferences(prev => ({ ...prev, primaryColor: color }))}
                      className={`w-8 h-8 rounded-full border-2 ${
                        preferences.primaryColor === color ? 'border-white' : 'border-slate-600'
                      }`}
                      style={{ backgroundColor: getColorValue(color) }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Border Radius</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.25"
                  value={preferences.radius}
                  onChange={(e) => setPreferences(prev => ({ ...prev, radius: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <div className="text-xs text-slate-400">{preferences.radius}rem</div>
              </div>

              {Object.entries(preferences).filter(([key]) => !['primaryColor', 'radius'].includes(key)).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <p className="text-xs text-slate-400 mt-1">
                      {getPreferenceDescription(key)}
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, [key]: !value }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-blue-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <Button
              onClick={handleSavePreferences}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Active Sessions
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-400 hover:text-red-300">
                Delete Account
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md modal-overlay modal-settings"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden modal-content"
        >
          <Card className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-700/50">
              <div>
                <CardTitle className="text-xl font-bold text-white">Settings</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your account and preferences
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>

            <div className="flex h-[600px]">
              {/* Sidebar */}
              <div className="w-48 border-r border-slate-700/50 p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderTabContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Helper functions
function getNotificationDescription(key: string): string {
  const descriptions: Record<string, string> = {
    emailNotifications: 'Receive notifications via email',
    pushNotifications: 'Receive browser push notifications',
    securityAlerts: 'Get notified about security events',
    systemUpdates: 'Receive system maintenance updates',
    weeklyReports: 'Get weekly summary reports'
  }
  return descriptions[key] || ''
}

function getPreferenceDescription(key: string): string {
  const descriptions: Record<string, string> = {
    autoRefresh: 'Automatically refresh data every 30 seconds',
    compactMode: 'Use a more compact layout',
    showAdvancedFeatures: 'Display advanced features and options'
  }
  return descriptions[key] || ''
}

function getColorValue(color: string): string {
  const colors: Record<string, string> = {
    blue: '#3b82f6',
    green: '#10b981',
    purple: '#8b5cf6',
    red: '#ef4444',
    orange: '#f97316'
  }
  return colors[color] || '#3b82f6'
} 