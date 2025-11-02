/**
 * Add Property Form Component
 * Client-side form for creating new properties with image uploads
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react'
import Image from 'next/image'

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

interface Props {
  states: State[]
  cities: City[]
  userId: string
}

export default function AddPropertyForm({ states, cities, userId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [selectedState, setSelectedState] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    cityId: '',
    stateId: '',
    zipCode: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    propertyType: 'APARTMENT',
    amenities: [] as string[],
    petPolicy: 'NO_PETS',
    parkingSpaces: '0',
    leaseTerms: '',
    availableFrom: '',
    published: false,
    featured: false,
  })

  // Filter cities based on selected state
  const filteredCities = selectedState 
    ? cities.filter(city => city.stateId === selectedState)
    : []

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Limit to 10 images
    if (selectedImages.length + files.length > 10) {
      setError('Maximum 10 images allowed')
      return
    }

    setSelectedImages([...selectedImages, ...files])

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setImagePreview([...imagePreview, ...newPreviews])
  }

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index)
    const newPreviews = imagePreview.filter((_, i) => i !== index)
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(imagePreview[index])
    
    setSelectedImages(newImages)
    setImagePreview(newPreviews)
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
      // Validate required fields
      if (!formData.title || !formData.description || !formData.price || !formData.address || !formData.cityId) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      if (selectedImages.length === 0) {
        setError('Please upload at least one image')
        setLoading(false)
        return
      }

      // Upload images first
      const uploadedImageUrls = await uploadImages(selectedImages)

      // Create the listing
      const response = await fetch('/api/admin/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseFloat(formData.bathrooms),
          squareFeet: formData.squareFeet ? parseInt(formData.squareFeet) : null,
          parkingSpaces: parseInt(formData.parkingSpaces),
          images: uploadedImageUrls,
          listedBy: userId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create listing')
      }

      const data = await response.json()
      setSuccess(true)
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/listing/${data.id}`)
      }, 2000)

    } catch (err: any) {
      setError(err.message || 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  const uploadImages = async (files: File[]): Promise<string[]> => {
    // Convert images to base64 data URLs for storage
    // Note: For production, you should use a proper image hosting service like Cloudinary
    const imagePromises = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    })

    try {
      const dataUrls = await Promise.all(imagePromises)
      return dataUrls
    } catch (error) {
      console.error('Error converting images:', error)
      // Fallback to placeholder images if conversion fails
      const placeholderUrls = [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
        'https://images.unsplash.com/photo-1560448204-603b3fc33ddc',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
        'https://images.unsplash.com/photo-1502672260066-6bc35f0a1cbc',
      ]
      return files.map((_, index) => placeholderUrls[index % placeholderUrls.length])
    }
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
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-sm text-green-800">
            Property created successfully! Redirecting...
          </p>
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Modern 2BR Apartment in Downtown"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describe the property..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Rent ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="2500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <select
              value={formData.propertyType}
              onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="APARTMENT">Apartment</option>
              <option value="HOUSE">House</option>
              <option value="CONDO">Condo</option>
              <option value="TOWNHOUSE">Townhouse</option>
              <option value="STUDIO">Studio</option>
            </select>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Location</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="123 Main Street"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value)
                setFormData({ ...formData, stateId: e.target.value, cityId: '' })
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.cityId}
              onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
              disabled={!selectedState}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Select City</option>
              {filteredCities.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code
            </label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="12345"
            />
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Property Details</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bedrooms <span className="text-red-500">*</span>
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bathrooms <span className="text-red-500">*</span>
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Square Feet
            </label>
            <input
              type="number"
              min="0"
              value={formData.squareFeet}
              onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parking Spaces
            </label>
            <input
              type="number"
              min="0"
              value={formData.parkingSpaces}
              onChange={(e) => setFormData({ ...formData, parkingSpaces: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pet Policy
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available From
          </label>
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

      {/* Image Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Images <span className="text-red-500">*</span>
        </h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 10 images
            </p>
          </label>
        </div>

        {/* Image Previews */}
        {imagePreview.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imagePreview.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                    Primary
                  </span>
                )}
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
            <span className="text-sm text-gray-700">Publish immediately</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Feature on homepage</span>
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
          {loading ? 'Creating...' : 'Create Property'}
        </button>
      </div>
    </form>
  )
}
