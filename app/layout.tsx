/**
 * Root Layout
 * Main layout with NextAuth session provider, navigation, and footer
 */

import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AuthProvider from '@/components/AuthProvider'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

// Safe URL creation for metadata
const getMetadataBase = () => {
  const url = process.env.NEXTAUTH_URL || process.env.VERCEL_URL
  if (url) {
    try {
      return new URL(url.startsWith('http') ? url : `https://${url}`)
    } catch {
      return undefined
    }
  }
  return undefined
}

export const metadata = {
  title: {
    default: 'RentUSA - Find Your Perfect Rental Home',
    template: '%s | RentUSA'
  },
  description: 'Discover rental homes across all 50 states and the District of Columbia. Search apartments, houses, and more with RentUSA.',
  keywords: 'rent, apartments, houses, real estate, rentals, USA, properties',
  metadataBase: getMetadataBase(),
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' }
    ],
    shortcut: '/icon.svg'
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'RentUSA'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'RentUSA',
    title: 'RentUSA - Find Your Perfect Rental Home',
    description: 'Discover rental homes across all 50 states and the District of Columbia. Search apartments, houses, condos and more.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'RentUSA - Find Your Perfect Rental Home'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RentUSA - Find Your Perfect Rental Home',
    description: 'Discover rental homes across all 50 states and the District of Columbia.',
    images: ['/og-image.svg']
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
