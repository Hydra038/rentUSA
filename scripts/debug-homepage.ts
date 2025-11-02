/**
 * Debug Homepage Featured Listings
 * Check what IDs are being returned for featured listings
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugHomepageListings() {
  console.log('🔍 Checking featured listings (homepage query)...\n')

  // Same query as homepage
  const { data: listings, error } = await supabase
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

  if (error) {
    console.error('❌ Error:', error)
    return
  }

  console.log(`📊 Found ${listings.length} featured listings\n`)

  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i]
    console.log(`${i + 1}. ${listing.title}`)
    console.log(`   ID: ${listing.id}`)
    console.log(`   Published: ${listing.published}`)
    console.log(`   Featured: ${listing.featured}`)
    console.log(`   Has City: ${!!listing.city}`)
    console.log(`   Has State: ${!!listing.state}`)
    console.log(`   Photos: ${listing.photos?.length || 0}`)
    console.log(`   URL: http://localhost:3000/listing/${listing.id}`)
    
    // Now try to fetch this specific listing like the detail page does
    const { data: detailListing, error: detailError } = await supabase
      .from('Listing')
      .select(`
        *,
        city:City(*),
        state:State(*),
        photos:Photo(*),
        listedBy:User!Listing_listedByUserId_fkey(id, name, email)
      `)
      .eq('id', listing.id)
      .single()

    if (detailError) {
      console.log(`   ❌ Detail fetch ERROR: ${detailError.message}`)
    } else if (!detailListing) {
      console.log(`   ❌ Detail fetch returned NULL`)
    } else if (!detailListing.published) {
      console.log(`   ❌ Not published in detail fetch`)
    } else {
      console.log(`   ✅ Detail fetch works!`)
    }
    console.log()
  }
}

debugHomepageListings()
  .then(() => {
    console.log('✨ Debug complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Debug failed:', error)
    process.exit(1)
  })
