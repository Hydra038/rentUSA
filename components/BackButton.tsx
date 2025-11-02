/**
 * Back Button Component
 * Navigates user back to previous page or to homepage
 */

'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  fallbackUrl?: string
  label?: string
}

export default function BackButton({ 
  fallbackUrl = '/', 
  label = 'Back to Listings' 
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    // Try to go back in browser history
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      // If no history, go to fallback URL
      router.push(fallbackUrl)
    }
  }

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
    >
      <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
      <span className="font-medium">{label}</span>
    </button>
  )
}
