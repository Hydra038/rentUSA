'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SaveButtonProps {
  listingId: string
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function SaveButton({ 
  listingId, 
  className = '', 
  showText = true,
  size = 'md'
}: SaveButtonProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Size classes
  const sizeClasses = {
    sm: {
      button: 'px-3 py-1.5 text-sm',
      icon: 'h-4 w-4',
    },
    md: {
      button: 'px-4 py-2 text-base',
      icon: 'h-5 w-5',
    },
    lg: {
      button: 'px-5 py-3 text-lg',
      icon: 'h-6 w-6',
    },
  }

  // Check initial save status when user is logged in
  useEffect(() => {
    if (session?.user) {
      checkSaveStatus()
    } else {
      setIsSaved(false)
    }
  }, [session, listingId])

  const checkSaveStatus = async () => {
    try {
      const response = await fetch(`/api/listings/${listingId}/save`)
      if (response.ok) {
        const data = await response.json()
        setIsSaved(data.saved)
      }
    } catch (error) {
      console.error('Error checking save status:', error)
    }
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent parent link navigation
    e.stopPropagation() // Stop event bubbling

    // Redirect to sign in if not authenticated
    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname))
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/listings/${listingId}/save`, {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setIsSaved(data.saved)
        
        // Optional: Show toast notification
        const message = data.saved ? '❤️ Added to favorites' : 'Removed from favorites'
        console.log(message)
      } else {
        alert(data.error || 'Failed to save listing')
      }
    } catch (error) {
      console.error('Error saving listing:', error)
      alert('Failed to save listing. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSave}
      disabled={isLoading || status === 'loading'}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all
        ${sizeClasses[size].button}
        ${isSaved 
          ? 'bg-red-50 text-red-600 border-2 border-red-300 hover:bg-red-100 hover:border-red-400' 
          : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
        }
        ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
        ${status === 'loading' ? 'opacity-50' : ''}
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-sm hover:shadow-md
        ${className}
      `}
      title={isSaved ? 'Remove from favorites' : 'Save to favorites'}
    >
      <Heart 
        className={`
          ${sizeClasses[size].icon}
          ${isSaved ? 'fill-red-600 stroke-red-600' : 'stroke-current'}
          transition-all
        `}
      />
      {showText && (
        <span>
          {isLoading ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  )
}
