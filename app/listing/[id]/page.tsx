/**
 * Listing Detail Page
 * Full property details with gallery, map, and inquiry form
 */

import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import BackButton from '@/components/BackButton'
import ListingGallery from '@/components/ListingGallery'
import MapView from '@/components/MapView'
import InquiryForm from '@/components/InquiryForm'
import SaveButton from '@/components/SaveButton'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Bed, Bath, Square, MapPin, Calendar, PawPrint, Mail, Phone } from 'lucide-react'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps) {
  const { data: listing } = await supabaseAdmin
    .from('Listing')
    .select('title, description')
    .eq('id', params.id)
    .single()

  if (!listing) {
    return { title: 'Listing Not Found' }
  }

  return {
    title: `${listing.title} | RentUSA`,
    description: listing.description.slice(0, 160),
  }
}

export default async function ListingDetailPage({ params }: PageProps) {
  console.log('🔍 Fetching listing with ID:', params.id)
  
  // Get current session to check if user is admin
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'ADMIN'
  
  const { data: listing, error } = await supabaseAdmin
    .from('Listing')
    .select(`
      *,
      city:City(*),
      state:State(*),
      photos:Photo(*),
      listedBy:User!Listing_listedByUserId_fkey(id, name, email)
    `)
    .eq('id', params.id)
    .single()

  console.log('📊 Listing fetch result:', {
    found: !!listing,
    published: listing?.published,
    error: error?.message || null,
    hasPhotos: listing?.photos?.length || 0,
    hasCity: !!listing?.city,
    hasState: !!listing?.state,
  })

  if (error) {
    console.error('❌ Error fetching listing:', error)
    notFound()
  }

  if (!listing) {
    console.error('❌ Listing not found for ID:', params.id)
    notFound()
  }

  // Only allow unpublished listings to be viewed by admins
  if (!listing.published && !isAdmin) {
    console.error('❌ Listing not published:', params.id)
    notFound()
  }

  const amenities = listing.amenities as string[] || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Back Button and Status */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <BackButton />
          
          <div className="flex items-center gap-3 flex-wrap">
            {/* Save Button */}
            <SaveButton listingId={listing.id} showText={true} size="md" />
            
            {/* Status Badge - Only visible to admins or for unpublished listings */}
            {isAdmin && (
              <>
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-sm ${
                    listing.published
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  }`}
                >
                  {listing.published ? '✓ Published' : '⏳ Pending Review'}
                </span>
                {listing.featured && (
                  <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary-100 text-primary-800 border border-primary-200 shadow-sm">
                    ⭐ Featured
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Gallery */}
        <ListingGallery photos={listing.photos} title={listing.title} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mt-6 sm:mt-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {listing.title}
                  </h1>
                  <div className="flex items-start text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">
                      {listing.address}, {listing.city.name}, {listing.state.code} {listing.zip}
                    </span>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-primary-600">
                    {formatCurrency(Number(listing.price))}
                    <span className="text-base sm:text-lg text-gray-500">/mo</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-4 sm:gap-6 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2" />
                  <span className="text-sm sm:text-base text-gray-900 font-medium">{listing.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2" />
                  <span className="text-sm sm:text-base text-gray-900 font-medium">{Number(listing.bathrooms)} Bathrooms</span>
                </div>
                {listing.sqft && (
                  <div className="flex items-center">
                    <Square className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2" />
                    <span className="text-sm sm:text-base text-gray-900 font-medium">{listing.sqft.toLocaleString()} sqft</span>
                  </div>
                )}
                {listing.petsAllowed && (
                  <div className="flex items-center">
                    <PawPrint className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2" />
                    <span className="text-sm sm:text-base text-gray-900 font-medium">Pets Allowed</span>
                  </div>
                )}
                {listing.availableDate && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2" />
                    <span className="text-sm sm:text-base text-gray-900 font-medium">
                      Available {formatDate(listing.availableDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Description</h2>
              <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <div className="h-2 w-2 bg-primary-600 rounded-full mr-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {listing.latitude && listing.longitude && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
                <MapView
                  listings={[
                    {
                      id: listing.id,
                      title: listing.title,
                      latitude: listing.latitude,
                      longitude: listing.longitude,
                      price: Number(listing.price),
                    },
                  ]}
                  center={[listing.latitude, listing.longitude]}
                  zoom={13}
                  height="400px"
                />
              </div>
            )}
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-1">
            <InquiryForm listingId={listing.id} listedBy={listing.listedBy} />
          </div>
        </div>
      </div>
    </div>
  )
}
