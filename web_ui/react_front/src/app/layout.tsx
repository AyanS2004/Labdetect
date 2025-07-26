import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { cn } from '@/lib/utils'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'AI Detection Engineering Lab | Advanced Threat Simulation',
  description: 'Professional cybersecurity platform for APT simulation, detection analysis, and MITRE ATT&CK mapping',
  keywords: 'cybersecurity, APT simulation, MITRE ATT&CK, threat detection, security analysis',
  authors: [{ name: 'Detection Engineering Lab Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ],
  openGraph: {
    title: 'AI Detection Engineering Lab',
    description: 'Advanced Threat Simulation & Detection Analysis Platform',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Detection Engineering Lab Dashboard'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Detection Engineering Lab',
    description: 'Advanced Threat Simulation & Detection Analysis Platform',
    images: ['/og-image.png']
  },
  robots: {
    index: false,
    follow: false
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body 
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
        suppressHydrationWarning
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
} 