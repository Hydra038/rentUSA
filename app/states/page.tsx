/**
 * All States Page
 * Shows a comprehensive grid of all US states with listing counts
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'
import BackButton from '@/components/BackButton'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Browse Rentals by State | RentUSA',
  description: 'Explore rental properties across all 50 US states and Washington DC. Find apartments, houses, and condos in your preferred location.',
}

interface StateWithCount {
  id: string
  name: string
  code: string
  listingCount: number
}

async function getAllStates(): Promise<StateWithCount[]> {
  // Fetch all states with their listing counts
  const { data: states, error } = await supabaseAdmin
    .from('State')
    .select(`
      id,
      name,
      code,
      listings:Listing(count)
    `)
    .order('name')

  if (error) {
    console.error('Error fetching states:', error)
    return []
  }

  // Transform the data to include listing count
  return states.map(state => ({
    id: state.id,
    name: state.name,
    code: state.code,
    listingCount: state.listings?.[0]?.count || 0,
  }))
}

export default async function AllStatesPage() {
  const states = await getAllStates()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-4">
            <BackButton />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Browse Rentals by State
          </h1>
          <p className="mt-2 text-gray-600">
            Explore rental properties across all 50 US states and Washington DC
          </p>
        </div>
      </div>

      {/* States Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {states.map((state) => (
            <Link
              key={state.id}
              href={`/state/${state.code}`}
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 hover:border-primary-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {state.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {state.listingCount} {state.listingCount === 1 ? 'property' : 'properties'}
                  </p>
                </div>
                <div className="text-2xl font-bold text-gray-300 group-hover:text-primary-500 transition-colors">
                  {state.code.toUpperCase()}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {states.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No states found</p>
          </div>
        )}

        {/* Stats Summary */}
        {states.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-primary-600">
                  {states.length}
                </p>
                <p className="text-sm text-gray-600 mt-1">States Available</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-600">
                  {states.reduce((sum, state) => sum + state.listingCount, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total Properties</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-600">
                  {states.filter(s => s.listingCount > 0).length}
                </p>
                <p className="text-sm text-gray-600 mt-1">States with Listings</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
