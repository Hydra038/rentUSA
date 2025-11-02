/**
 * State Listings Page
 * Display all listings for a specific state
 */

import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import BackButton from '@/components/BackButton'
import ListingCard from '@/components/ListingCard'
import ListingFilters from '@/components/ListingFilters'
import Pagination from '@/components/Pagination'
import { getPaginationMeta } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// All US states + DC
const STATES = [
  { name: "Alabama", code: "al" },{ name: "Alaska", code: "ak" },{ name: "Arizona", code: "az" },
  { name: "Arkansas", code: "ar" },{ name: "California", code: "ca" },{ name: "Colorado", code: "co" },
  { name: "Connecticut", code: "ct" },{ name: "Delaware", code: "de" },{ name: "District of Columbia", code: "dc" },
  { name: "Florida", code: "fl" },{ name: "Georgia", code: "ga" },{ name: "Hawaii", code: "hi" },
  { name: "Idaho", code: "id" },{ name: "Illinois", code: "il" },{ name: "Indiana", code: "in" },
  { name: "Iowa", code: "ia" },{ name: "Kansas", code: "ks" },{ name: "Kentucky", code: "ky" },
  { name: "Louisiana", code: "la" },{ name: "Maine", code: "me" },{ name: "Maryland", code: "md" },
  { name: "Massachusetts", code: "ma" },{ name: "Michigan", code: "mi" },{ name: "Minnesota", code: "mn" },
  { name: "Mississippi", code: "ms" },{ name: "Missouri", code: "mo" },{ name: "Montana", code: "mt" },
  { name: "Nebraska", code: "ne" },{ name: "Nevada", code: "nv" },{ name: "New Hampshire", code: "nh" },
  { name: "New Jersey", code: "nj" },{ name: "New Mexico", code: "nm" },{ name: "New York", code: "ny" },
  { name: "North Carolina", code: "nc" },{ name: "North Dakota", code: "nd" },{ name: "Ohio", code: "oh" },
  { name: "Oklahoma", code: "ok" },{ name: "Oregon", code: "or" },{ name: "Pennsylvania", code: "pa" },
  { name: "Rhode Island", code: "ri" },{ name: "South Carolina", code: "sc" },{ name: "South Dakota", code: "sd" },
  { name: "Tennessee", code: "tn" },{ name: "Texas", code: "tx" },{ name: "Utah", code: "ut" },
  { name: "Vermont", code: "vt" },{ name: "Virginia", code: "va" },{ name: "Washington", code: "wa" },
  { name: "West Virginia", code: "wv" },{ name: "Wisconsin", code: "wi" },{ name: "Wyoming", code: "wy" }
]

interface PageProps {
  params: { state: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: { params: { state: string } }) {
  const stateInfo = STATES.find(s => s.code === params.state.toLowerCase())
  
  if (!stateInfo) {
    return { title: 'State Not Found' }
  }

  return {
    title: `Apartments & Rentals in ${stateInfo.name} | RentUSA`,
    description: `Find your next rental home in ${stateInfo.name}. Browse apartments, houses, and condos for rent.`,
  }
}

export default async function StatePage({ params, searchParams }: PageProps) {
  const stateCode = params.state.toLowerCase()
  const page = Number(searchParams.page) || 1
  const limit = 20

  // Find state in database
  const { data: state } = await supabaseAdmin
    .from('State')
    .select('*')
    .eq('code', stateCode)
    .single()

  if (!state) {
    notFound()
  }

  // Build query
  let query = supabaseAdmin
    .from('Listing')
    .select(`
      *,
      city:City(*),
      state:State(*),
      photos:Photo(*)
    `, { count: 'exact' })
    .eq('stateId', state.id)
    .eq('published', true)
    .order('createdAt', { ascending: false })

  // Apply filters
  if (searchParams.minPrice) {
    query = query.gte('price', Number(searchParams.minPrice))
  }
  if (searchParams.maxPrice) {
    query = query.lte('price', Number(searchParams.maxPrice))
  }
  if (searchParams.bedrooms) {
    query = query.gte('bedrooms', Number(searchParams.bedrooms))
  }
  if (searchParams.bathrooms) {
    query = query.gte('bathrooms', Number(searchParams.bathrooms))
  }
  if (searchParams.petsAllowed === 'true') {
    query = query.eq('petsAllowed', true)
  }

  // Pagination
  query = query.range((page - 1) * limit, page * limit - 1)

  const { data: listings, error, count } = await query

  // Debug logging
  console.log(`\n🔍 State Page Query for ${stateCode.toUpperCase()}:`)
  console.log(`   State ID: ${state.id}`)
  console.log(`   Count returned: ${count}`)
  console.log(`   Listings array length: ${listings?.length || 0}`)
  console.log(`   Error: ${error ? error.message : 'none'}`)
  if (listings && listings.length > 0) {
    console.log(`   First listing: ${listings[0].title}`)
    console.log(`   Has city: ${!!listings[0].city}`)
    console.log(`   Has state: ${!!listings[0].state}`)
    console.log(`   Has photos: ${!!listings[0].photos}`)
  }

  if (error) {
    console.error('❌ Error fetching listings:', error)
    notFound()
  }

  const total = count || 0
  const pagination = getPaginationMeta(total, page, limit)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-4">
            <BackButton />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Rentals in {state.name}
          </h1>
          <p className="mt-2 text-gray-600">
            {total.toLocaleString()} properties available
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ListingFilters />
          </div>

          {/* Listings Grid */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            {listings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No listings found matching your criteria.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {listings.map((listing: any) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  hasNextPage={pagination.hasNextPage}
                  hasPrevPage={pagination.hasPrevPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
