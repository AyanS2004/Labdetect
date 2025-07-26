'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, CheckCircle, AlertTriangle, XCircle, Info, Trash2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

interface NotificationsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Authentication Successful',
      message: 'You have successfully logged into the Detection Lab platform.',
      timestamp: '2 minutes ago',
      read: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Password Expiry Warning',
      message: 'Your password will expire in 7 days. Please update it in your profile settings.',
      timestamp: '1 hour ago',
      read: false
    },
    {
      id: '3',
      type: 'info',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance on Sunday 2:00 AM - 4:00 AM UTC. Some features may be unavailable.',
      timestamp: '3 hours ago',
      read: true
    },
    {
      id: '4',
      type: 'error',
      title: 'Failed Login Attempt',
      message: 'Multiple failed login attempts detected from IP 192.168.1.100. Account temporarily locked.',
      timestamp: '1 day ago',
      read: false
    },
    {
      id: '5',
      type: 'success',
      title: 'Detection Rule Updated',
      message: 'APT29 detection rule has been updated with improved accuracy.',
      timestamp: '2 days ago',
      read: true
    },
    {
      id: '6',
      type: 'info',
      title: 'New Report Available',
      message: 'Weekly security analysis report is now available for download.',
      timestamp: '3 days ago',
      read: true
    }
  ])

  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  if (!isOpen) return null

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-400" />
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'error':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'info':
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    }
  }

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md modal-overlay modal-notifications"
        onClick={onClose}
        style={{ zIndex: 999999 }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden modal-content"
          style={{ zIndex: 1000000 }}
        >
          <Card className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-700/50">
              <div className="flex items-center space-x-3">
                <Bell className="h-6 w-6 text-blue-400" />
                <div>
                  <CardTitle className="text-xl font-bold text-white">
                    Notifications
                    {unreadCount > 0 && (
                      <Badge className="ml-2 bg-red-500/20 text-red-300 border-red-500/30">
                        {unreadCount} new
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    System alerts and important updates
                  </CardDescription>
                </div>
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

            <div className="p-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant={filter === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('all')}
                    className="text-xs"
                  >
                    All ({notifications.length})
                  </Button>
                  <Button
                    variant={filter === 'unread' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('unread')}
                    className="text-xs"
                  >
                    Unread ({unreadCount})
                  </Button>
                </div>
                
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark all read
                  </Button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[60vh]">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-12 w-12 text-slate-600 mb-4" />
                  <h3 className="text-lg font-medium text-slate-400 mb-2">
                    {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {filter === 'unread' 
                      ? 'All caught up! Check back later for new updates.'
                      : 'You don\'t have any notifications yet.'
                    }
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700/30">
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 hover:bg-slate-800/40 transition-colors ${
                        !notification.read ? 'bg-slate-800/20' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-white mb-1">
                                {notification.title}
                                {!notification.read && (
                                  <span className="ml-2 w-2 h-2 bg-blue-400 rounded-full inline-block"></span>
                                )}
                              </h4>
                              <p className="text-sm text-slate-400 mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Badge className={getBadgeColor(notification.type)}>
                                    {notification.type}
                                  </Badge>
                                  <span className="text-xs text-slate-500">
                                    {notification.timestamp}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-4">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-8 w-8 text-slate-500 hover:text-blue-400"
                                  title="Mark as read"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-8 w-8 text-slate-500 hover:text-red-400"
                                title="Delete notification"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 