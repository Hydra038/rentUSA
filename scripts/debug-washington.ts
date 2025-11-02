/**
 * Debug Washington State Listings
 * Check listings in Washington and test if they can be accessed
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugWashingtonListings() {
  console.log('🔍 Checking Washington state listings...\n')

  // Get Washington state
  const { data: waState } = await supabase
    .from('State')
    .select('id, name, code')
    .eq('code', 'wa')
    .single()

  if (!waState) {
    console.error('❌ Washington state not found')
    return
  }

  console.log(`📍 Found: ${waState.name} (${waState.code})\n`)

  // Get Washington listings (like state page does)
  const { data: listings, error } = await supabase
    .from('Listing')
    .select(`
      *,
      city:City(*),
      state:State(*),
      photos:Photo(*)
    `)
    .eq('stateId', waState.id)
    .eq('published', true)
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('❌ Error fetching listings:', error)
    return
  }

  console.log(`📊 Found ${listings.length} Washington listings\n`)

  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i]
    console.log(`${i + 1}. ${listing.title}`)
    console.log(`   ID: ${listing.id}`)
    console.log(`   City: ${listing.city?.name || 'N/A'}`)
    console.log(`   Published: ${listing.published}`)
    console.log(`   Has Photos: ${listing.photos?.length || 0}`)
    console.log(`   URL: http://localhost:3000/listing/${listing.id}`)
    
    // Test detail page fetch (with listedBy relation)
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
      console.log(`   ❌ DETAIL ERROR: ${detailError.message}`)
      console.log(`      Code: ${detailError.code}`)
      console.log(`      Details: ${detailError.details}`)
    } else if (!detailListing) {
      console.log(`   ❌ Detail returned NULL`)
    } else if (!detailListing.listedBy) {
      console.log(`   ⚠️  Missing listedBy user!`)
    } else {
      console.log(`   ✅ Detail fetch works - Listed by: ${detailListing.listedBy.name}`)
    }
    console.log()
  }

  // Check if any listings are missing the listedBy user
  console.log('\n🔍 Checking for orphaned listings (missing user)...')
  const { data: orphaned } = await supabase
    .from('Listing')
    .select('id, title, listedByUserId')
    .eq('stateId', waState.id)
    .is('listedByUserId', null)

  if (orphaned && orphaned.length > 0) {
    console.log(`❌ Found ${orphaned.length} listings without a user:`)
    orphaned.forEach(l => console.log(`   - ${l.title} (${l.id})`))
  } else {
    console.log('✅ All listings have a valid user')
  }
}

debugWashingtonListings()
  .then(() => {
    console.log('\n✨ Debug complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Debug failed:', error)
    process.exit(1)
  })
