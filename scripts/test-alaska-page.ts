/**
 * Test Alaska State Page Query
 * Simulate the exact query the page makes
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAlaskaPage() {
  console.log('🧪 Testing Alaska state page query...\n')
  console.log('URL: http://localhost:3000/state/ak\n')

  const stateCode = 'ak'
  const page = 1
  const limit = 20

  // Step 1: Find state (exactly as the page does)
  console.log('Step 1: Finding Alaska state...')
  const { data: state, error: stateError } = await supabase
    .from('State')
    .select('*')
    .eq('code', stateCode)
    .single()

  if (stateError || !state) {
    console.log('❌ State not found!')
    console.log('   Error:', stateError?.message)
    return
  }

  console.log('✅ State found:', state.name)
  console.log('   ID:', state.id)
  console.log('   Code:', state.code)
  console.log()

  // Step 2: Query listings (exactly as the page does)
  console.log('Step 2: Querying listings...')
  console.log('Query:')
  console.log('  - Table: Listing')
  console.log('  - Filter: stateId =', state.id)
  console.log('  - Filter: published = true')
  console.log('  - Relations: city, state, photos')
  console.log('  - Pagination:', (page - 1) * limit, 'to', page * limit - 1)
  console.log()

  const { data: listings, error: listingsError, count } = await supabase
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
    .range((page - 1) * limit, page * limit - 1)

  if (listingsError) {
    console.log('❌ Error fetching listings!')
    console.log('   Error:', listingsError.message)
    console.log('   Code:', listingsError.code)
    console.log('   Details:', listingsError.details)
    return
  }

  console.log('✅ Query successful!')
  console.log('   Total count:', count)
  console.log('   Listings returned:', listings?.length || 0)
  console.log()

  if (!listings || listings.length === 0) {
    console.log('⚠️  NO LISTINGS FOUND!')
    console.log('   The page will show "0 properties available"')
    console.log()
  } else {
    console.log('📋 Listings found:')
    console.log()
    listings.forEach((listing, i) => {
      console.log(`${i + 1}. ${listing.title}`)
      console.log(`   ID: ${listing.id}`)
      console.log(`   City: ${listing.city?.name || '❌ MISSING'}`)
      console.log(`   State: ${listing.state?.code || '❌ MISSING'}`)
      console.log(`   Photos: ${listing.photos?.length || 0}`)
      console.log(`   Price: $${listing.price}/month`)
      console.log(`   ${listing.bedrooms} bed, ${listing.bathrooms} bath`)
      console.log()
    })
  }

  // Step 3: Verify what ListingCard needs
  console.log('Step 3: Checking if data matches ListingCard requirements...')
  console.log()

  if (listings && listings.length > 0) {
    const firstListing = listings[0]
    console.log('Checking first listing:', firstListing.title)
    console.log()

    // Check required fields
    const checks = [
      { field: 'id', value: firstListing.id, required: true },
      { field: 'title', value: firstListing.title, required: true },
      { field: 'address', value: firstListing.address, required: true },
      { field: 'city.name', value: firstListing.city?.name, required: true },
      { field: 'state.code', value: firstListing.state?.code, required: true },
      { field: 'price', value: firstListing.price, required: true },
      { field: 'bedrooms', value: firstListing.bedrooms, required: true },
      { field: 'bathrooms', value: firstListing.bathrooms, required: true },
      { field: 'photos', value: firstListing.photos, required: true },
    ]

    let allValid = true
    checks.forEach(check => {
      const isValid = check.value !== undefined && check.value !== null
      const status = isValid ? '✅' : '❌'
      console.log(`${status} ${check.field}: ${check.value || 'MISSING'}`)
      if (!isValid && check.required) {
        allValid = false
      }
    })

    console.log()
    if (allValid) {
      console.log('✅ All required data present - ListingCard will render correctly!')
    } else {
      console.log('❌ Missing required data - ListingCard will throw an error!')
    }
  }

  console.log()
  console.log('═══════════════════════════════════════════════════')
  console.log()
  console.log('RESULT:')
  if (listings && listings.length > 0) {
    console.log(`✅ Page should show ${count} listings`)
    console.log('✅ All data is present for ListingCard')
    console.log()
    console.log('If you see "0 properties" or errors, it\'s browser cache!')
    console.log('Solution: Press Ctrl + Shift + R to hard refresh')
  } else {
    console.log('❌ Page will show "0 properties available"')
    console.log('   Database query returned no results')
  }
}

testAlaskaPage()
  .then(() => {
    console.log('\n✨ Test complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Test failed:', error)
    process.exit(1)
  })
