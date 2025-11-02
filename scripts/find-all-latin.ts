/**
 * Find ALL Latin Listings
 * Search for any listings with Latin/Lorem text
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

const englishDescriptions = [
  "Welcome to this stunning apartment featuring modern amenities and spacious living areas. The open-concept layout is perfect for entertaining guests or relaxing after a long day. Large windows provide abundant natural light throughout the space. The kitchen boasts stainless steel appliances, granite countertops, and ample cabinet space. The master bedroom includes a walk-in closet and en-suite bathroom with updated fixtures.",
  
  "Discover urban living at its finest in this beautifully renovated unit. Located in a prime location with easy access to shopping, dining, and entertainment options. The apartment features hardwood floors, high ceilings, and a private balcony with breathtaking city views. Modern kitchen with breakfast bar, in-unit washer and dryer, and central air conditioning. Building amenities include a fitness center, rooftop deck, and secure parking.",
  
  "Experience luxury living in this elegant residence. This spacious unit offers a sophisticated floor plan with designer finishes throughout. The gourmet kitchen includes premium appliances, quartz countertops, and custom cabinetry. The spa-like bathrooms feature marble tile and rainfall showers. Enjoy resort-style amenities including a pool, clubhouse, and 24-hour concierge service.",
]

async function findAllLatinListings() {
  console.log('🔍 Searching ALL listings for Latin text...\n')

  // Get ALL listings
  const { data: allListings, error } = await supabase
    .from('Listing')
    .select('id, title, description, published')
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('❌ Error:', error)
    return
  }

  console.log(`📊 Found ${allListings.length} total listings\n`)

  // Check each for Latin keywords
  const latinKeywords = [
    'umquam', 'valde', 'dapifer', 'vinitor', 'textilis', 'admoneo', 
    'defessus', 'cilicium', 'consuasor', 'conatus', 'cupiditate',
    'decerno', 'ratione', 'credo', 'aestus', 'amplexus', 'crepusculum',
    'antiquus', 'viridis', 'charisma', 'quae', 'vilitas', 'averto',
    'derideo', 'demitto', 'teres', 'defungo', 'chirographum',
    'demonstro', 'ambitus', 'coniecto', 'lorem', 'ipsum'
  ]

  let foundCount = 0
  let updatedCount = 0

  for (const listing of allListings) {
    const desc = listing.description.toLowerCase()
    const hasLatin = latinKeywords.some(keyword => desc.includes(keyword))

    if (hasLatin) {
      foundCount++
      console.log(`\n❌ LATIN TEXT FOUND:`)
      console.log(`   Title: ${listing.title}`)
      console.log(`   ID: ${listing.id}`)
      console.log(`   Published: ${listing.published}`)
      console.log(`   URL: http://localhost:3000/listing/${listing.id}`)
      console.log(`   Description: ${listing.description.substring(0, 150)}...`)

      // Update with English description
      const newDescription = englishDescriptions[foundCount % englishDescriptions.length]
      
      const { error: updateError } = await supabase
        .from('Listing')
        .update({ description: newDescription })
        .eq('id', listing.id)

      if (updateError) {
        console.error(`   ❌ Update failed: ${updateError.message}`)
      } else {
        updatedCount++
        console.log(`   ✅ Updated to English description`)
      }
    }
  }

  console.log(`\n\n📈 Summary:`)
  console.log(`   - Total listings checked: ${allListings.length}`)
  console.log(`   - Listings with Latin: ${foundCount}`)
  console.log(`   - Successfully updated: ${updatedCount}`)

  if (foundCount === 0) {
    console.log('\n✅ All listings have English descriptions!')
    console.log('\n💡 If you still see Latin text in your browser:')
    console.log('   1. Hard refresh: Ctrl + Shift + R (or Cmd + Shift + R)')
    console.log('   2. Clear browser cache')
    console.log('   3. Restart dev server')
  }
}

findAllLatinListings()
  .then(() => {
    console.log('\n✨ Search complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Search failed:', error)
    process.exit(1)
  })
