/**
 * Home Page - Using Supabase JS (Alternative to Prisma)
 * Landing page with hero section, featured listings, and search
 */

import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import ListingCard from '@/components/ListingCard'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Fetch featured listings using Supabase JS (server-side with admin key)
  let featuredListings: any[] = []
  let states: any[] = []
  
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('⚠️ Supabase not configured, running with empty data')
    } else {
      // Fetch featured listings
      const { data: listings, error: listingsError } = await supabaseAdmin
        .from('Listing')
        .select(`
          *,
          city:City(*),
          state:State(*),
          photos:Photo(*)
        `)
        .eq('published', true)
        .eq('featured', true)
        .order('createdAt', { ascending: false })
        .limit(8)

      console.log('🔍 Listings fetch result:', {
        count: listings?.length || 0,
        error: listingsError,
        hasData: !!listings
      })

      if (listingsError) {
        console.error('❌ Listings error:', listingsError)
      }

      if (!listingsError && listings) {
        featuredListings = listings
        console.log('✅ Featured listings loaded:', featuredListings.length)
      }

      // Fetch states
      const { data: statesData, error: statesError } = await supabaseAdmin
        .from('State')
        .select('*')
        .order('name', { ascending: true})

      console.log('🔍 States fetch result:', {
        count: statesData?.length || 0,
        error: statesError,
        hasData: !!statesData
      })

      if (!statesError && statesData) {
        states = statesData
        console.log('✅ States loaded:', states.length)
      }
    }
  } catch (error) {
    console.error('Database connection error:', error)
    // Continue with empty arrays - pages will render without data
  }

  return (
    <div>
      {/* Hero Section - Apartments.com Style with Background */}
      <section className="relative min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        </div>

        {/* Content - Centered */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 w-full text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 text-white drop-shadow-2xl">
            Explore Rentals in the US
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-8 sm:mb-12 mx-auto max-w-3xl drop-shadow-lg px-4">
            Find your perfect home from thousands of apartments across all 50 states
          </p>
          
          {/* Search Bar */}
          <div className="flex justify-center px-4">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Featured Listings
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8">Discover your new home</p>
          
          {featuredListings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                No featured listings available yet.
              </p>
              <p className="text-gray-400">
                Run the setup script to populate the database with sample listings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Browse by State */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Popular Cities
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8">Find apartments in top locations</p>
          
          {states.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading states...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {states.slice(0, 12).map((state) => (
                  <Link
                    key={state.code}
                    href={`/state/${state.code}`}
                    className="p-4 sm:p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center border border-gray-200"
                  >
                    <div className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                      {state.name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">{state.code.toUpperCase()}</div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-6 sm:mt-8">
                <Link
                  href="/states"
                  className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
                >
                  View All States
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
