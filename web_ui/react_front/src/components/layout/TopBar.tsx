'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Bell, Settings, User, LogOut, ChevronDown } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { Button } from '@/components/ui/button'


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export function TopBar() {
  const { user, systemStatus, setActiveTab, setShowSettings, setShowNotifications } = useAppStore()
  const { logout } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500'
      case 'warning':
        return 'bg-amber-500'
      case 'critical':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'All Systems Operational'
      case 'warning':
        return 'Minor Issues Detected'
      case 'critical':
        return 'Critical System Error'
      default:
        return 'Status Unknown'
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-700/30 bg-slate-900/30 backdrop-blur-xl px-6">
      {/* Left section - Status indicator */}
      <div className="flex items-center space-x-6">
        {mounted && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center space-x-3"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`status-indicator ${getStatusColor(systemStatus?.overall || 'healthy')}`}
              />
              <span className="text-sm font-medium text-slate-300">
                {getStatusText(systemStatus?.overall || 'healthy')}
              </span>
              <Badge variant="secondary" className="bg-slate-800/60 text-slate-300 border border-slate-700/30">
                v2.1.0
              </Badge>
            </div>
          </motion.div>
        )}
      </div>

      {/* Right section - Actions and user menu */}
      <div className="flex items-center space-x-2">


        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowNotifications(true)}
          className="relative h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-all duration-200"
        >
          <Bell className="h-4 w-4" />
          {mounted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 shadow-lg shadow-red-500/50"
            />
          )}
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-3 px-3 py-2 h-10 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-all duration-200"
            >
              <Avatar className="h-8 w-8 ring-2 ring-slate-700/50">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-xs font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium leading-none">
                  {user?.name || 'User'}
                </span>
                <span className="text-xs text-slate-500 capitalize mt-1">
                  {user?.role || 'analyst'}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            align="end" 
            className="w-56 bg-slate-800/95 backdrop-blur-xl border-slate-700/50 shadow-xl"
          >
            <DropdownMenuLabel className="text-slate-300 font-medium px-3 py-2">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700/50" />
            
            <DropdownMenuItem 
              onClick={() => setShowSettings(true)}
              className="text-slate-300 hover:bg-slate-700/50 focus:bg-slate-700/50 rounded-md mx-1 my-0.5 cursor-pointer"
            >
              <Settings className="mr-3 h-4 w-4 text-slate-400" />
              Settings
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => setShowNotifications(true)}
              className="text-slate-300 hover:bg-slate-700/50 focus:bg-slate-700/50 rounded-md mx-1 my-0.5 cursor-pointer"
            >
              <Bell className="mr-3 h-4 w-4 text-slate-400" />
              Notifications
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-slate-700/50 my-2" />
            
            <DropdownMenuItem 
              onClick={logout}
              className="text-red-400 hover:bg-red-900/30 focus:bg-red-900/30 rounded-md mx-1 my-0.5 cursor-pointer"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </header>
  )
} 