/**
 * Diagnostic Page
 * Test listing display and data fetching
 */

import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function DiagnosticPage() {
  // Get a few featured listings
  const { data: listings, error } = await supabaseAdmin
    .from('Listing')
    .select('id, title, published, featured, city:City(name), state:State(code)')
    .eq('published', true)
    .eq('featured', true)
    .limit(5)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Diagnostic Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Featured Listings Test</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <p className="text-red-800 font-semibold">Error:</p>
              <pre className="text-sm text-red-600 mt-2">{JSON.stringify(error, null, 2)}</pre>
            </div>
          )}
          
          {listings && listings.length > 0 ? (
            <div className="space-y-4">
              <p className="text-green-600 font-semibold">✅ Found {listings.length} featured listings</p>
              
              {listings.map((listing) => (
                <div key={listing.id} className="border border-gray-200 rounded p-4">
                  <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>ID:</strong> {listing.id}</p>
                    <p><strong>Published:</strong> {listing.published ? 'Yes' : 'No'}</p>
                    <p><strong>Featured:</strong> {listing.featured ? 'Yes' : 'No'}</p>
                    <p><strong>City:</strong> {listing.city?.name || 'N/A'}</p>
                    <p><strong>State:</strong> {listing.state?.code || 'N/A'}</p>
                    <a 
                      href={`/listing/${listing.id}`}
                      className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View Listing →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No listings found</p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Click "View Listing" on any listing above</li>
            <li>If you see "Page Not Found" or "no product", check the terminal logs</li>
            <li>The logs will show what's happening during the fetch</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
