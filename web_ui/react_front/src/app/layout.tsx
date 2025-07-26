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
  title: 'Detection Lab | Automated Breach Simulation & Multi-SIEM Detection Platform',
  description: 'Next-generation cybersecurity platform for running automated, MITRE-mapped breach simulations, streaming real-time telemetry to multiple SIEMs, and converting detection rules across SIEM formats.',
  keywords: 'cybersecurity, APT simulation, MITRE ATT&CK, SIEM integration, breach simulation, detection engineering, PySigma, Splunk, Elastic, Grafana',
  authors: [{ name: 'Detection Lab Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: '/apple-touch-icon.png'
  },
  openGraph: {
    title: 'Detection Lab',
    description: 'Automated Breach Simulation & Multi-SIEM Detection Platform',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Detection Lab Dashboard'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Detection Lab',
    description: 'Automated Breach Simulation & Multi-SIEM Detection Platform',
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