/**
 * Find and Fix Miami Condo
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function findAndFixMiamiCondo() {
  console.log('🔍 Searching for Miami condo with Latin description...\n')

  // Search for Miami listings with Latin text
  const { data: listings } = await supabase
    .from('Listing')
    .select(`
      id,
      title,
      description,
      city:City(name)
    `)
    .ilike('title', '%condo%miami%')

  console.log(`Found ${listings?.length || 0} Miami condo listings`)

  if (!listings || listings.length === 0) {
    // Search more broadly
    const { data: allMiami } = await supabase
      .from('Listing')
      .select(`
        id,
        title,
        description,
        city:City(name)
      `)
      .ilike('city.name', '%miami%')

    console.log(`\nFound ${allMiami?.length || 0} total Miami listings:`)
    allMiami?.forEach((listing, i) => {
      const hasLatin = listing.description.includes('Abbas') || 
                       listing.description.includes('baiului') ||
                       listing.description.includes('aegre')
      console.log(`\n${i + 1}. ${listing.title}`)
      console.log(`   ID: ${listing.id}`)
      console.log(`   City: ${listing.city.name}`)
      console.log(`   Has Latin: ${hasLatin ? '❌ YES' : '✅ NO'}`)
      console.log(`   Description: "${listing.description.substring(0, 80)}..."`)
    })

    // Find the one with Latin
    const targetListing = allMiami?.find(l => 
      l.description.includes('Abbas') || 
      l.description.includes('baiului')
    )

    if (targetListing) {
      console.log(`\n\n🎯 Found listing with Latin description:`)
      console.log(`   ${targetListing.title}`)
      console.log(`   ID: ${targetListing.id}`)
      
      // Update it
      const newDescription = `Welcome to this charming condo in the heart of Miami! This beautifully maintained 3-bedroom, 1-bathroom unit offers 903 square feet of comfortable living space in one of South Florida's most desirable locations.

Features:
• Spacious living room with plenty of natural light
• Modern kitchen with updated appliances and ample cabinet space
• Three generously sized bedrooms with large closets
• Full bathroom with contemporary fixtures
• In-unit laundry hookups for added convenience
• Central air conditioning to beat the Florida heat
• Tile flooring throughout for easy maintenance

Located in a well-maintained building with easy access to Miami's best beaches, shopping, dining, and entertainment. Perfect for families, professionals, or anyone looking to enjoy the vibrant South Florida lifestyle.

Building amenities include secure entry, assigned parking, and professional management. Close to major highways for easy commuting, and just minutes from Miami Beach, Brickell, and downtown Miami.

Don't miss this opportunity to call Miami home!`

      const { error } = await supabase
        .from('Listing')
        .update({ description: newDescription })
        .eq('id', targetListing.id)

      if (error) {
        console.log(`\n❌ Error updating: ${error.message}`)
      } else {
        console.log(`\n✅ Description updated successfully!`)
        console.log(`   Visit: http://localhost:3000/listing/${targetListing.id}`)
      }
    }
  }
}

findAndFixMiamiCondo()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })
