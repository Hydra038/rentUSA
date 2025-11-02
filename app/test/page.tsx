/**
 * Test Page - Verify Data Display
 * Simple page to test if listings are being fetched and displayed
 */

import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function TestPage() {
  const { data: listings, error } = await supabase
    .from('Listing')
    .select('*, city:City(*), state:State(*), photos:Photo(*)')
    .eq('featured', true)
    .eq('published', true)
    .limit(12)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Database Test Page</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Query Results</h2>
          <p className="text-gray-600 mb-2">
            <strong>Featured Listings Found:</strong> {listings?.length || 0}
          </p>
          <p className="text-gray-600">
            <strong>Error:</strong> {error ? 'Yes' : 'No'}
          </p>
        </div>

        {listings && listings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow overflow-hidden">
                {listing.photos && listing.photos.length > 0 && (
                  <img
                    src={listing.photos[0].url}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {listing.city?.name}, {listing.state?.code?.toUpperCase()}
                  </p>
                  <p className="text-green-600 font-bold">
                    ${listing.price?.toLocaleString()}/mo
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    {listing.bedrooms} bed • {listing.bathrooms} bath
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Featured: {listing.featured ? 'Yes' : 'No'}
                    </span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Published: {listing.published ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {(!listings || listings.length === 0) && !error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p><strong>No listings found!</strong></p>
            <p className="text-sm mt-2">This could mean:</p>
            <ul className="list-disc ml-6 text-sm">
              <li>Row Level Security is blocking reads</li>
              <li>No listings marked as featured AND published</li>
              <li>Database connection issue</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
