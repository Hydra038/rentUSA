/**
 * Check Specific Listing ID
 * Verify if the ID from the URL exists
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSpecificListing() {
  const targetId = '87e2a0ce-f41f-43aa-86cf-f271eb237f7b'
  
  console.log(`🔍 Checking listing ID: ${targetId}\n`)

  // Try to find this listing
  const { data: listing, error } = await supabase
    .from('Listing')
    .select('*')
    .eq('id', targetId)
    .single()

  if (error) {
    console.log('❌ Listing NOT FOUND in database')
    console.log(`   Error: ${error.message}`)
    console.log(`   Code: ${error.code}`)
  } else if (listing) {
    console.log('✅ Listing EXISTS')
    console.log(`   Title: ${listing.title}`)
    console.log(`   Published: ${listing.published}`)
  }

  // Get total number of listings
  const { count } = await supabase
    .from('Listing')
    .select('*', { count: 'exact', head: true })

  console.log(`\n📊 Total listings in database: ${count}`)

  // Show some valid listing IDs
  console.log('\n✅ Here are 5 valid listing IDs you can use:\n')
  
  const { data: validListings } = await supabase
    .from('Listing')
    .select('id, title, city:City(name), state:State(code)')
    .eq('published', true)
    .limit(5)

  validListings?.forEach((l, i) => {
    console.log(`${i + 1}. ${l.title}`)
    console.log(`   ${l.city.name}, ${l.state.code.toUpperCase()}`)
    console.log(`   http://localhost:3000/listing/${l.id}`)
    console.log()
  })

  console.log('\n💡 The ID in your URL is from an old database state.')
  console.log('   Clear your browser cache and reload the homepage!')
}

checkSpecificListing()
  .then(() => {
    console.log('✨ Check complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Check failed:', error)
    process.exit(1)
  })
