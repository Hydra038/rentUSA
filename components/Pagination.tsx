/**
 * Pagination Component
 * Page navigation for search results
 */

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
}: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/search?${params.toString()}`)
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-2 my-8">
      {/* Previous Button */}
      <button
        onClick={() => navigateToPage(currentPage - 1)}
        disabled={!hasPrevPage}
        className={`
          flex items-center px-3 py-2 rounded-md border
          ${hasPrevPage
            ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
            : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {getPageNumbers().map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => navigateToPage(page)}
              className={`
                px-4 py-2 rounded-md border font-medium
                ${currentPage === page
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-2 text-gray-500">
              {page}
            </span>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => navigateToPage(currentPage + 1)}
        disabled={!hasNextPage}
        className={`
          flex items-center px-3 py-2 rounded-md border
          ${hasNextPage
            ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
            : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4 ml-1" />
      </button>
    </div>
  )
}
