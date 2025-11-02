/**
 * Script to geocode existing listings
 * Updates all listings with proper latitude/longitude based on their addresses
 */

import { supabaseAdmin } from '../lib/supabase'
import { getCoordinates } from '../lib/geocoding'

async function geocodeListings() {
  console.log('🗺️  Starting geocoding process...\n')

  // Fetch all listings
  const { data: listings, error } = await supabaseAdmin
    .from('Listing')
    .select(`
      id,
      address,
      zip,
      city:City(name),
      state:State(name)
    `)
    .order('id')

  if (error) {
    console.error('❌ Error fetching listings:', error)
    return
  }

  if (!listings || listings.length === 0) {
    console.log('No listings found')
    return
  }

  console.log(`Found ${listings.length} listings to geocode\n`)

  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i]
    const progress = `[${i + 1}/${listings.length}]`

    try {
      console.log(`${progress} Geocoding: ${listing.address}, ${listing.city.name}, ${listing.state.name}`)

      const coords = await getCoordinates(
        listing.address,
        listing.city.name,
        listing.state.name,
        listing.zip
      )

      // Update the listing with coordinates
      const { error: updateError } = await supabaseAdmin
        .from('Listing')
        .update({
          latitude: coords.latitude,
          longitude: coords.longitude
        })
        .eq('id', listing.id)

      if (updateError) {
        console.error(`  ❌ Error updating listing ${listing.id}:`, updateError.message)
        errorCount++
      } else {
        console.log(`  ✅ Updated: ${coords.latitude}, ${coords.longitude}`)
        successCount++
      }

    } catch (error: any) {
      console.error(`  ❌ Error geocoding listing ${listing.id}:`, error.message)
      errorCount++
    }

    // Add a small delay to respect rate limits
    if (i < listings.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1100)) // 1.1 seconds between requests
    }
  }

  console.log(`\n✅ Geocoding complete!`)
  console.log(`   Success: ${successCount}`)
  console.log(`   Errors: ${errorCount}`)
}

// Run the script
geocodeListings()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
