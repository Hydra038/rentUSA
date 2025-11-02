/**
 * Check Alaska Listings
 * Verify Alaska state and city setup
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAlaska() {
  console.log('🔍 Checking Alaska data...\n')

  // 1. Check State
  const { data: state, error: stateError } = await supabase
    .from('State')
    .select('*')
    .eq('code', 'ak')
    .single()

  if (stateError || !state) {
    console.log('❌ Alaska state not found!')
    return
  }

  console.log('✅ State found:', state.name, `(${state.code})`)
  console.log(`   ID: ${state.id}\n`)

  // 2. Check Cities
  const { data: cities, error: citiesError } = await supabase
    .from('City')
    .select('*')
    .eq('stateId', state.id)

  console.log(`📍 Found ${cities?.length || 0} cities in Alaska:`)
  cities?.forEach(city => {
    console.log(`   - ${city.name} (ID: ${city.id})`)
  })
  console.log()

  // 3. Check Listings
  const { data: listings, error: listingsError } = await supabase
    .from('Listing')
    .select(`
      id,
      title,
      price,
      bedrooms,
      bathrooms,
      published,
      city:City(name, stateId),
      photos:Photo(url)
    `)
    .eq('city.stateId', state.id)
    .eq('published', true)

  console.log(`🏠 Found ${listings?.length || 0} published Alaska listings:\n`)
  
  listings?.forEach((listing, i) => {
    console.log(`${i + 1}. ${listing.title}`)
    console.log(`   City: ${listing.city.name}`)
    console.log(`   Price: $${listing.price}/month`)
    console.log(`   Bedrooms: ${listing.bedrooms}, Bathrooms: ${listing.bathrooms}`)
    console.log(`   Photos: ${listing.photos?.length || 0}`)
    console.log(`   URL: http://localhost:3000/listing/${listing.id}`)
    console.log()
  })

  // 4. Direct query by state code (like the page does)
  const { data: listingsByCode, error: codeError } = await supabase
    .from('Listing')
    .select(`
      *,
      city:City!inner(
        name,
        state:State!inner(code)
      )
    `)
    .eq('city.state.code', 'ak')
    .eq('published', true)

  console.log(`\n🔎 Direct query by state code 'ak': ${listingsByCode?.length || 0} listings`)
  
  if (codeError) {
    console.log('❌ Error:', codeError.message)
  }

  if (!listingsByCode || listingsByCode.length === 0) {
    console.log('\n⚠️  No listings found with state code query!')
    console.log('   This is what the page uses, so it will show 0 properties.')
  }
}

checkAlaska()
  .then(() => {
    console.log('\n✨ Check complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Check failed:', error)
    process.exit(1)
  })
