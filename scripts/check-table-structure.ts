/**
 * Check Listing Table Structure
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTableStructure() {
  console.log('🔍 Checking Listing table structure...\n')

  // Get a single listing to see its columns
  const { data: listing } = await supabase
    .from('Listing')
    .select('*')
    .limit(1)
    .single()

  if (listing) {
    console.log('📋 Listing columns:')
    Object.keys(listing).sort().forEach(key => {
      const value = listing[key]
      const type = typeof value
      console.log(`   ${key.padEnd(20)} ${type.padEnd(10)} ${value}`)
    })
  }

  // Check if stateId exists
  console.log('\n🔎 Checking for stateId column...')
  const { data, error } = await supabase
    .from('Listing')
    .select('stateId')
    .limit(1)

  if (error) {
    console.log('❌ stateId column does NOT exist')
    console.log(`   Error: ${error.message}`)
  } else {
    console.log('✅ stateId column EXISTS')
  }

  // Count listings by stateId if it exists
  if (!error) {
    console.log('\n📊 Listings by stateId:')
    const { data: states } = await supabase
      .from('State')
      .select('id, name, code')

    for (const state of states || []) {
      const { count } = await supabase
        .from('Listing')
        .select('*', { count: 'exact', head: true })
        .eq('stateId', state.id)

      if (count && count > 0) {
        console.log(`   ${state.name.padEnd(20)} (${state.code}): ${count}`)
      }
    }
  }
}

checkTableStructure()
  .then(() => {
    console.log('\n✨ Check complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Check failed:', error)
    process.exit(1)
  })
