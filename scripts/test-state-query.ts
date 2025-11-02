/**
 * Test State Query Fix
 * Verify the corrected query works
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function testStateQuery() {
  console.log('🧪 Testing Alaska query fix...\n')

  // Get Alaska state
  const { data: state } = await supabase
    .from('State')
    .select('*')
    .eq('code', 'ak')
    .single()

  if (!state) {
    console.log('❌ Alaska state not found!')
    return
  }

  console.log('✅ State found:', state.name)
  console.log(`   ID: ${state.id}\n`)

  // OLD QUERY (WRONG - would return 0 results)
  console.log('❌ OLD QUERY: .eq("stateId", state.id)')
  const { data: oldResults, error: oldError } = await supabase
    .from('Listing')
    .select(`
      *,
      city:City(*),
      photos:Photo(*)
    `, { count: 'exact' })
    .eq('stateId', state.id)
    .eq('published', true)

  console.log(`   Results: ${oldResults?.length || 0} listings`)
  if (oldError) {
    console.log(`   Error: ${oldError.message}`)
  }
  console.log()

  // NEW QUERY (CORRECT - filters by city.stateId)
  console.log('✅ NEW QUERY: .eq("city.stateId", state.id)')
  const { data: newResults, error: newError, count } = await supabase
    .from('Listing')
    .select(`
      *,
      city:City!inner(*),
      photos:Photo(*)
    `, { count: 'exact' })
    .eq('city.stateId', state.id)
    .eq('published', true)

  console.log(`   Results: ${newResults?.length || 0} listings`)
  console.log(`   Total count: ${count}`)
  
  if (newError) {
    console.log(`   Error: ${newError.message}`)
  } else {
    console.log('\n📋 Alaska listings:')
    newResults?.forEach((listing, i) => {
      console.log(`   ${i + 1}. ${listing.title}`)
      console.log(`      ${listing.city.name}, AK - $${listing.price}/mo`)
      console.log(`      ${listing.bedrooms} bed, ${listing.bathrooms} bath`)
    })
  }

  // Test a few other states
  console.log('\n\n🌎 Testing other states...\n')
  
  for (const stateCode of ['ca', 'ny', 'tx', 'wa']) {
    const { data: testState } = await supabase
      .from('State')
      .select('*')
      .eq('code', stateCode)
      .single()

    if (testState) {
      const { count } = await supabase
        .from('Listing')
        .select('*', { count: 'exact', head: true })
        .eq('city.stateId', testState.id)
        .eq('published', true)

      console.log(`${testState.name.padEnd(20)} (${stateCode}): ${count} listings`)
    }
  }
}

testStateQuery()
  .then(() => {
    console.log('\n✨ Test complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Test failed:', error)
    process.exit(1)
  })
