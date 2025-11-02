/**
 * Listing Actions Component
 * Client-side component for edit, delete, and status management
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react'

interface Props {
  listingId: string
  published: boolean
  featured: boolean
}

// Rental listing statuses
const LISTING_STATUSES = [
  { value: 'AVAILABLE', label: 'Available', color: 'bg-green-100 text-green-800' },
  { value: 'PENDING', label: 'Application Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'RESERVED', label: 'Reserved', color: 'bg-blue-100 text-blue-800' },
  { value: 'RENTED', label: 'Rented', color: 'bg-gray-100 text-gray-800' },
  { value: 'UNAVAILABLE', label: 'Unavailable', color: 'bg-red-100 text-red-800' },
]

export default function ListingActions({ listingId, published, featured }: Props) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/listings/${listingId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete listing')
      }

      router.refresh()
    } catch (error) {
      console.error('Error deleting listing:', error)
      alert('Failed to delete listing')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleTogglePublished = async () => {
    try {
      const response = await fetch(`/api/admin/listings/${listingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          published: !published,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update listing')
      }

      router.refresh()
      setShowMenu(false)
    } catch (error) {
      console.error('Error updating listing:', error)
      alert('Failed to update listing')
    }
  }

  const handleToggleFeatured = async () => {
    try {
      const response = await fetch(`/api/admin/listings/${listingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featured: !featured,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update listing')
      }

      router.refresh()
      setShowMenu(false)
    } catch (error) {
      console.error('Error updating listing:', error)
      alert('Failed to update listing')
    }
  }

  return (
    <div className="flex items-center justify-end space-x-2">
      {/* View */}
      <Link
        href={`/listing/${listingId}`}
        className="text-primary-600 hover:text-primary-900 p-1"
        title="View Listing"
      >
        <Eye className="h-4 w-4" />
      </Link>

      {/* Edit */}
      <Link
        href={`/dashboard/admin/edit-property/${listingId}`}
        className="text-gray-600 hover:text-gray-900 p-1"
        title="Edit Listing"
      >
        <Edit className="h-4 w-4" />
      </Link>

      {/* More Actions Menu */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-gray-600 hover:text-gray-900 p-1"
          title="More Actions"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
              <div className="py-1">
                <button
                  onClick={handleTogglePublished}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={handleToggleFeatured}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {featured ? 'Remove from Featured' : 'Mark as Featured'}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Listing'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
