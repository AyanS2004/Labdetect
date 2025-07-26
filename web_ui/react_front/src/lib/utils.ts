import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(timestamp: string | Date): string {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

export function getCoverageColor(coverage: string): string {
  switch (coverage?.toLowerCase()) {
    case 'full':
      return 'text-green-500 bg-green-500/10 border-green-500/20'
    case 'partial':
      return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    case 'none':
      return 'text-red-500 bg-red-500/10 border-red-500/20'
    default:
      return 'text-gray-500 bg-gray-500/10 border-gray-500/20'
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return 'text-red-600 bg-red-600/10 border-red-600/20'
    case 'high':
      return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
    case 'medium':
      return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
    case 'low':
      return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    default:
      return 'text-gray-500 bg-gray-500/10 border-gray-500/20'
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
} 