/**
 * Test Listing IDs
 * Quick script to check what listing IDs exist and their published status
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function testListingIds() {
  console.log('🔍 Checking listing IDs and status...\n')

  // Get featured listings (what shows on homepage)
  const { data: featured, error: featuredError } = await supabase
    .from('Listing')
    .select('id, title, published, featured')
    .eq('published', true)
    .eq('featured', true)
    .limit(5)

  if (featuredError) {
    console.error('❌ Error fetching featured listings:', featuredError)
    return
  }

  console.log(`📊 Featured Listings on Homepage (${featured.length}):`)
  featured.forEach((listing, i) => {
    console.log(`${i + 1}. ${listing.title}`)
    console.log(`   ID: ${listing.id}`)
    console.log(`   Published: ${listing.published}`)
    console.log(`   Featured: ${listing.featured}`)
    console.log(`   URL: http://localhost:3000/listing/${listing.id}`)
    console.log()
  })

  // Try to fetch one of these listings with all relations
  if (featured.length > 0) {
    const testId = featured[0].id
    console.log(`\n🧪 Testing fetch for listing: ${testId}\n`)

    const { data: fullListing, error: fullError } = await supabase
      .from('Listing')
      .select(`
        *,
        city:City(*),
        state:State(*),
        photos:Photo(*),
        listedBy:User!Listing_listedByUserId_fkey(id, name, email)
      `)
      .eq('id', testId)
      .single()

    if (fullError) {
      console.error('❌ Error fetching full listing:', fullError)
    } else {
      console.log('✅ Full listing data retrieved successfully!')
      console.log(`   Title: ${fullListing.title}`)
      console.log(`   City: ${fullListing.city?.name || 'N/A'}`)
      console.log(`   State: ${fullListing.state?.name || 'N/A'}`)
      console.log(`   Photos: ${fullListing.photos?.length || 0}`)
      console.log(`   Listed by: ${fullListing.listedBy?.name || 'N/A'}`)
    }
  }
}

testListingIds()
  .then(() => {
    console.log('\n✨ Test complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  })
