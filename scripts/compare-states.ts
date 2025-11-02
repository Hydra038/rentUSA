/**
 * Test All State Pages
 * Check if the query works for multiple states
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function testStatePage(stateCode: string) {
  // Simulate what the page does
  const { data: state } = await supabase
    .from('State')
    .select('*')
    .eq('code', stateCode)
    .single()

  if (!state) {
    console.log(`❌ ${stateCode.toUpperCase()}: State not found in database`)
    return
  }

  // Query exactly like the page does
  const { data: listings, error, count } = await supabase
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

  const symbol = (count || 0) > 0 ? '✅' : '❌'
  console.log(`${symbol} ${state.name.padEnd(20)} (${stateCode}): ${count || 0} listings`)
  
  if (error) {
    console.log(`   Error: ${error.message}`)
  }

  if (listings && listings.length > 0) {
    // Check if state data is present
    const firstListing = listings[0]
    if (firstListing.state) {
      console.log(`   ✅ State data present: ${firstListing.state.name}`)
    } else {
      console.log(`   ❌ State data MISSING`)
    }
    
    // Show first listing
    console.log(`   Example: ${firstListing.title}`)
    console.log(`            ${firstListing.city?.name || 'NO CITY'}, ${firstListing.state?.code?.toUpperCase() || 'NO STATE'}`)
  }

  return count || 0
}

async function compareStates() {
  console.log('🔍 Testing state pages across US...\n')

  const testStates = [
    'ak', // Alaska - the problematic one
    'ca', // California - large state
    'ny', // New York
    'tx', // Texas
    'fl', // Florida
    'wa', // Washington - we tested this earlier
    'al', // Alabama - first alphabetically
    'wy', // Wyoming - last alphabetically
  ]

  let totalListings = 0

  for (const code of testStates) {
    const count = await testStatePage(code)
    totalListings += (count || 0)
    console.log()
  }

  console.log(`\n📊 Total listings across ${testStates.length} states: ${totalListings}`)

  // Get ALL states count
  console.log('\n\n📋 All 51 states listing counts:\n')
  
  const { data: allStates } = await supabase
    .from('State')
    .select('*')
    .order('name')

  for (const state of allStates || []) {
    const { count } = await supabase
      .from('Listing')
      .select('*', { count: 'exact', head: true })
      .eq('stateId', state.id)
      .eq('published', true)

    const symbol = (count || 0) > 0 ? '✅' : '⚠️ '
    console.log(`${symbol} ${state.name.padEnd(20)} (${state.code}): ${count || 0}`)
  }
}

compareStates()
  .then(() => {
    console.log('\n✨ Comparison complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Test failed:', error)
    process.exit(1)
  })
