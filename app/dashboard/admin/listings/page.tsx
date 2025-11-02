/**
 * Admin Manage Listings Page
 * View, edit, and manage all listings
 */

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import ListingActions from '@/components/admin/ListingActions'
import ListingStatusBadge from '@/components/admin/ListingStatusBadge'

export default async function ManageListingsPage() {
  const session = await getServerSession(authOptions)

  // Check authentication and role
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  // Fetch all listings
  const { data: listings, error } = await supabaseAdmin
    .from('Listing')
    .select(`
      *,
      city:City(name, state:State(name, code)),
      photos:Photo(url, isPrimary)
    `)
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Error fetching listings:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Listings</h1>
              <p className="mt-2 text-gray-600">
                View and manage all property listings
              </p>
            </div>
            <Link
              href="/dashboard/admin/add-property"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Property
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Listings</p>
            <p className="text-2xl font-bold text-gray-900">{listings?.length || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Published</p>
            <p className="text-2xl font-bold text-green-600">
              {listings?.filter(l => l.published).length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Drafts</p>
            <p className="text-2xl font-bold text-gray-600">
              {listings?.filter(l => !l.published).length || 0}
            </p>
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Listing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {listings && listings.length > 0 ? (
                  listings.map((listing) => {
                    const primaryPhoto = listing.photos?.find((p: any) => p.isPrimary) || listing.photos?.[0]
                    const cityName = listing.city?.name || 'Unknown'
                    const stateName = listing.city?.state?.name || 'Unknown'
                    
                    return (
                      <tr key={listing.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {primaryPhoto && (
                              <img
                                src={primaryPhoto.url}
                                alt={listing.title}
                                className="h-10 w-10 rounded object-cover mr-3"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {listing.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {listing.bedrooms} bed • {listing.bathrooms} bath
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{cityName}</div>
                          <div className="text-sm text-gray-500">{stateName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${listing.price.toLocaleString()}/mo
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ListingStatusBadge
                            listingId={listing.id}
                            currentStatus={listing.status || 'AVAILABLE'}
                            published={listing.published}
                            featured={listing.featured}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(listing.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <ListingActions 
                            listingId={listing.id}
                            published={listing.published}
                            featured={listing.featured}
                          />
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No listings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination (placeholder) */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{listings?.length || 0}</span> of{' '}
            <span className="font-medium">{listings?.length || 0}</span> results
          </p>
        </div>
      </div>
    </div>
  )
}
