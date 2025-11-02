/**
 * Renter Dashboard
 * View saved listings and inquiries
 */

import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { Heart, MessageSquare } from 'lucide-react'

export default async function RenterDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'RENTER') {
    redirect('/auth/signin')
  }

  // Fetch user's saved listings
  let savedListings: any[] = []
  let inquiries: any[] = []

  try {
    const [savedListingsResult, inquiriesResult] = await Promise.all([
      supabaseAdmin
        .from('SavedListing')
        .select(`
          id,
          createdAt,
          listing:Listing(
            id,
            title,
            price,
            city:City(name),
            state:State(code),
            photos:Photo(url, isPrimary)
          )
        `)
        .eq('userId', session.user.id)
        .order('createdAt', { ascending: false }),
      supabaseAdmin
        .from('Inquiry')
        .select(`
          id,
          message,
          status,
          createdAt,
          listing:Listing(
            id,
            title
          )
        `)
        .or(`userId.eq.${session.user.id},email.eq."${session.user.email}"`)
        .order('createdAt', { ascending: false })
        .limit(10),
    ])

    savedListings = savedListingsResult.data || []
    inquiries = inquiriesResult.data || []

    // Log errors if any
    if (savedListingsResult.error) {
      console.error('Saved listings error:', savedListingsResult.error)
    }
    if (inquiriesResult.error) {
      console.error('Inquiries error:', inquiriesResult.error)
    }

    console.log('📊 Renter Dashboard Data:')
    console.log('  User ID:', session.user.id)
    console.log('  User Email:', session.user.email)
    console.log('  Saved Listings:', savedListings.length)
    console.log('  Inquiries:', inquiries.length)
    if (inquiries.length > 0) {
      console.log('  First inquiry:', inquiries[0])
    }

    // Filter primary photos for each saved listing
    if (savedListings.length > 0) {
      savedListings = savedListings.map(saved => ({
        ...saved,
        listing: {
          ...saved.listing,
          photos: saved.listing?.photos?.filter((p: any) => p.isPrimary) || []
        }
      }))
    }
  } catch (error) {
    console.error('Dashboard error:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Renter Dashboard</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600 truncate">
            Welcome back, {session.user.name || session.user.email}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="text-xs sm:text-sm text-gray-600 mb-1">Saved Listings</div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{savedListings.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="text-xs sm:text-sm text-gray-600 mb-1">Inquiries Sent</div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{inquiries.length}</div>
          </div>
        </div>

        {/* Saved Listings */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <Heart className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-red-500" />
            Saved Listings
          </h2>
          <div className="bg-white rounded-lg shadow">
            {savedListings.length === 0 ? (
              <div className="text-center py-8 sm:py-12 px-4">
                <Heart className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-500">No saved listings yet</p>
                <Link
                  href="/search"
                  className="mt-3 sm:mt-4 inline-block text-sm sm:text-base text-primary-600 hover:text-primary-500"
                >
                  Browse listings
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {savedListings.slice(0, 5).map((saved) => (
                  <Link
                    key={saved.id}
                    href={`/listing/${saved.listing.id}`}
                    className="block p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                          {saved.listing.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 truncate">
                          {saved.listing.city.name}, {saved.listing.state.code.toUpperCase()}
                        </p>
                        <p className="text-base sm:text-lg font-bold text-primary-600 mt-1 sm:mt-2">
                          ${Number(saved.listing.price).toLocaleString()}/mo
                        </p>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                        Saved {new Date(saved.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary-600" />
            Recent Inquiries
          </h2>
          <div className="bg-white rounded-lg shadow">
            {inquiries.length === 0 ? (
              <div className="text-center py-8 sm:py-12 px-4">
                <MessageSquare className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-500">No inquiries sent yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <Link
                        href={`/listing/${inquiry.listing.id}`}
                        className="flex-1 hover:text-primary-600 transition-colors min-w-0"
                      >
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                          {inquiry.listing.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <span
                          className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                            inquiry.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : inquiry.status === 'RESPONDED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {inquiry.status}
                        </span>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                      {inquiry.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
