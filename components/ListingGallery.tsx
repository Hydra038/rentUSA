/**
 * ListingGallery Component
 * Image gallery with lightbox for listing detail page
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Photo {
  id: string
  url: string
  isPrimary: boolean
}

interface ListingGalleryProps {
  photos: Photo[]
  title: string
}

export default function ListingGallery({ photos, title }: ListingGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">No images available</p>
      </div>
    )
  }

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedIndex(null)
    document.body.style.overflow = 'auto'
  }

  const nextImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % photos.length)
    }
  }

  const prevImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedIndex === null) return
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'ArrowLeft') prevImage()
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown as any)
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-4 gap-2 h-96 rounded-lg overflow-hidden">
        {/* Main Image */}
        <div
          className="col-span-4 md:col-span-2 row-span-2 relative cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={photos[0].url}
            alt={`${title} - Photo 1`}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Additional Images */}
        {photos.slice(1, 5).map((photo, index) => (
          <div
            key={photo.id}
            className="col-span-2 md:col-span-1 relative cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => openLightbox(index + 1)}
          >
            <Image
              src={photo.url}
              alt={`${title} - Photo ${index + 2}`}
              fill
              className="object-cover"
            />
          </div>
        ))}

        {/* View All Button */}
        {photos.length > 5 && (
          <button
            onClick={() => openLightbox(0)}
            className="absolute bottom-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors shadow-lg"
          >
            View all {photos.length} photos
          </button>
        )}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="absolute left-4 text-white hover:text-gray-300 z-10"
          >
            <ChevronLeft className="h-12 w-12" />
          </button>

          {/* Image */}
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center p-4">
            <Image
              src={photos[selectedIndex].url}
              alt={`${title} - Photo ${selectedIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-4 text-white hover:text-gray-300 z-10"
          >
            <ChevronRight className="h-12 w-12" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg">
            {selectedIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  )
}
