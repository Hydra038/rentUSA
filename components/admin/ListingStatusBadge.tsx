/**
 * Listing Status Badge Component
 * Shows current rental status with appropriate styling
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

interface Props {
  listingId: string
  currentStatus: 'AVAILABLE' | 'PENDING' | 'RESERVED' | 'RENTED' | 'UNAVAILABLE'
  published: boolean
  featured: boolean
}

const STATUSES = [
  { value: 'AVAILABLE', label: 'Available', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'RESERVED', label: 'Reserved', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'RENTED', label: 'Rented', color: 'bg-gray-100 text-gray-800 border-gray-200' },
  { value: 'UNAVAILABLE', label: 'Unavailable', color: 'bg-red-100 text-red-800 border-red-200' },
]

export default function ListingStatusBadge({ listingId, currentStatus, published, featured }: Props) {
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const currentStatusObj = STATUSES.find(s => s.value === currentStatus) || STATUSES[0]

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/listings/${listingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      router.refresh()
      setShowDropdown(false)
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Rental Status Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={isUpdating}
          className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${currentStatusObj.color} hover:opacity-80 transition-opacity disabled:opacity-50`}
        >
          {currentStatusObj.label}
          <ChevronDown className="h-3 w-3 ml-1" />
        </button>

        {showDropdown && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute left-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
              <div className="py-1">
                {STATUSES.map(status => (
                  <button
                    key={status.value}
                    onClick={() => handleStatusChange(status.value)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      status.value === currentStatus ? 'bg-gray-50 font-semibold' : ''
                    }`}
                  >
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${status.color}`}>
                      {status.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Published Badge */}
      {!published && (
        <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-200">
          Draft
        </span>
      )}

      {/* Featured Badge */}
      {featured && (
        <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-200">
          ⭐ Featured
        </span>
      )}
    </div>
  )
}
