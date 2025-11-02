/**
 * Edit Property Form Component
 * Client-side form for editing properties
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react'

interface State {
  id: string
  name: string
  code: string
}

interface City {
  id: string
  name: string
  stateId: string
  state: {
    name: string
    code: string
  }
}

interface Photo {
  id: string
  url: string
  isPrimary: boolean
  order: number
}

interface Listing {
  id: string
  title: string
  description: string
  price: number
  address: string
  cityId: string
  stateId: string
  zip: string
  bedrooms: number
  bathrooms: number
  sqft: number | null
  amenities: string[]
  petsAllowed: boolean
  availableDate: string | null
  published: boolean
  featured: boolean
  photos: Photo[]
}

interface Props {
  listing: Listing
  states: State[]
  cities: City[]
}

export default function EditPropertyForm({ listing, states, cities }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [existingPhotos, setExistingPhotos] = useState(listing.photos || [])
  const [newImages, setNewImages] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: listing.title,
    description: listing.description,
    price: listing.price.toString(),
    address: listing.address,
    cityId: listing.cityId,
    stateId: listing.stateId,
    zipCode: listing.zip,
    bedrooms: listing.bedrooms.toString(),
    bathrooms: listing.bathrooms.toString(),
    squareFeet: listing.sqft?.toString() || '',
    amenities: listing.amenities || [],
    petPolicy: listing.petsAllowed ? 'CATS_AND_DOGS' : 'NO_PETS',
    availableFrom: listing.availableDate?.split('T')[0] || '',
    published: listing.published,
    featured: listing.featured,
  })

  const filteredCities = formData.stateId
    ? cities.filter(city => city.stateId === formData.stateId)
    : []

  const handleNewImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setNewImages([...newImages, ...files])
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setNewImagePreviews([...newImagePreviews, ...newPreviews])
  }

  const removeExistingPhoto = (photoId: string) => {
    setExistingPhotos(existingPhotos.filter(p => p.id !== photoId))
  }

  const removeNewImage = (index: number) => {
    const newImgs = newImages.filter((_, i) => i !== index)
    const newPrevs = newImagePreviews.filter((_, i) => i !== index)
    URL.revokeObjectURL(newImagePreviews[index])
    setNewImages(newImgs)
    setNewImagePreviews(newPrevs)
  }

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Upload new images if any
      let uploadedImageUrls: string[] = []
      if (newImages.length > 0) {
        uploadedImageUrls = await uploadImages(newImages)
      }

      // Update the listing
      const response = await fetch(`/api/admin/listings/${listing.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          address: formData.address,
          cityId: formData.cityId,
          stateId: formData.stateId,
          zip: formData.zipCode,
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseFloat(formData.bathrooms),
          sqft: formData.squareFeet ? parseInt(formData.squareFeet) : null,
          amenities: formData.amenities,
          petsAllowed: formData.petPolicy !== 'NO_PETS',
          availableDate: formData.availableFrom || null,
          published: formData.published,
          featured: formData.featured,
          existingPhotoIds: existingPhotos.map(p => p.id),
          newImages: uploadedImageUrls,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update listing')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/listing/${listing.id}`)
      }, 2000)

    } catch (err: any) {
      setError(err.message || 'Failed to update listing')
    } finally {
      setLoading(false)
    }
  }

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const imagePromises = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    })

    return await Promise.all(imagePromises)
  }

  const amenitiesList = [
    'Air Conditioning',
    'Heating',
    'Washer/Dryer',
    'Dishwasher',
    'Gym/Fitness Center',
    'Swimming Pool',
    'Balcony/Patio',
    'Hardwood Floors',
    'Walk-in Closets',
    'Stainless Steel Appliances',
  ]

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-sm text-green-800">
            Property updated successfully! Redirecting...
          </p>
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Rent ($) *
          </label>
          <input
            type="number"
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Location</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
            <select
              required
              value={formData.stateId}
              onChange={(e) => setFormData({ ...formData, stateId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <select
              required
              value={formData.cityId}
              onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select City</option>
              {filteredCities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Property Details</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms *</label>
            <input
              type="number"
              required
              min="0"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms *</label>
            <input
              type="number"
              required
              min="0"
              step="0.5"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Square Feet</label>
            <input
              type="number"
              min="0"
              value={formData.squareFeet}
              onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pet Policy</label>
          <select
            value={formData.petPolicy}
            onChange={(e) => setFormData({ ...formData, petPolicy: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="NO_PETS">No Pets</option>
            <option value="CATS_ONLY">Cats Only</option>
            <option value="DOGS_ONLY">Dogs Only</option>
            <option value="CATS_AND_DOGS">Cats and Dogs</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
          <input
            type="date"
            value={formData.availableFrom}
            onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {amenitiesList.map(amenity => (
            <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Images</h3>
        
        {/* Existing Photos */}
        {existingPhotos.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Existing Photos</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingPhotos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.url}
                    alt="Property"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingPhoto(photo.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {photo.isPrimary && (
                    <span className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Photos */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleNewImageSelect}
            className="hidden"
            id="new-image-upload"
          />
          <label htmlFor="new-image-upload" className="cursor-pointer flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Add more images</p>
          </label>
        </div>

        {newImagePreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {newImagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img src={preview} alt={`New ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Publishing Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Publishing Options</h3>
        <div className="flex items-center space-x-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Published</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Featured</span>
          </label>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t">
        <Link
          href="/dashboard/admin/listings"
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Updating...' : 'Update Property'}
        </button>
      </div>
    </form>
  )
}
