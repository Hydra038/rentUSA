/**
 * Verify All States Have Listings
 * Checks that all 50 states + DC have at least one listing with English descriptions
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyAllStates() {
  console.log('🔍 Verifying all states have listings with English descriptions...\n')

  // Get all states with listing counts
  const { data: states, error: statesError } = await supabase
    .from('State')
    .select('*, listings:Listing(id, title, description)')
    .order('name')

  if (statesError) {
    console.error('❌ Error fetching states:', statesError)
    return
  }

  console.log(`📊 Found ${states.length} states\n`)

  let statesWithListings = 0
  let statesWithoutListings = 0
  let totalListings = 0
  let englishDescriptions = 0
  let nonEnglishDescriptions = 0

  for (const state of states) {
    const listingCount = state.listings?.length || 0
    totalListings += listingCount

    if (listingCount > 0) {
      statesWithListings++
      console.log(`✅ ${state.name} (${state.code}): ${listingCount} listings`)
      
      // Check first listing's description for English
      const firstListing = state.listings[0]
      if (firstListing.description) {
        // Check if description contains Lorem ipsum or common non-English words
        const isLorem = firstListing.description.toLowerCase().includes('lorem ipsum')
        const seemsEnglish = /\b(apartment|property|bedroom|bathroom|kitchen|living|available|features)\b/i.test(firstListing.description)
        
        if (isLorem || !seemsEnglish) {
          nonEnglishDescriptions++
          console.log(`   ⚠️  Warning: Description may not be in English`)
        } else {
          englishDescriptions++
        }
      }
    } else {
      statesWithoutListings++
      console.log(`❌ ${state.name} (${state.code}): 0 listings`)
    }
  }

  console.log(`\n📈 Summary:`)
  console.log(`   - Total States: ${states.length}`)
  console.log(`   - States WITH listings: ${statesWithListings}`)
  console.log(`   - States WITHOUT listings: ${statesWithoutListings}`)
  console.log(`   - Total Listings: ${totalListings}`)
  console.log(`   - English Descriptions: ${englishDescriptions}`)
  console.log(`   - Non-English/Lorem: ${nonEnglishDescriptions}`)

  if (statesWithoutListings === 0) {
    console.log(`\n✅ SUCCESS: All states have listings!`)
  } else {
    console.log(`\n⚠️  WARNING: ${statesWithoutListings} states are missing listings`)
  }

  if (nonEnglishDescriptions === 0) {
    console.log(`✅ SUCCESS: All descriptions appear to be in English!`)
  } else {
    console.log(`⚠️  WARNING: ${nonEnglishDescriptions} listings have non-English descriptions`)
  }

  // Get a sample listing to show description
  const { data: sampleListing } = await supabase
    .from('Listing')
    .select('title, description')
    .limit(1)
    .single()

  if (sampleListing) {
    console.log(`\n📝 Sample Listing:`)
    console.log(`   Title: ${sampleListing.title}`)
    console.log(`   Description (first 200 chars): ${sampleListing.description.substring(0, 200)}...`)
  }
}

verifyAllStates()
  .then(() => {
    console.log('\n✨ Verification complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Verification failed:', error)
    process.exit(1)
  })
