/**
 * Fix "Small Condo in Miami" Description
 * Replace Latin text with English
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixMiamiCondoDescription() {
  console.log('🔧 Fixing "Small Condo in Miami" description...\n')

  // Get the listing from the URL
  const listingId = '4a8a8d5f-b1f7-43ae-a8c9-85d8e5ecfd6f'

  // First check if it exists
  const { data: current } = await supabase
    .from('Listing')
    .select('id, title, description')
    .eq('id', listingId)
    .single()

  if (!current) {
    console.log('❌ Listing not found')
    return
  }

  console.log('📋 Current listing:')
  console.log(`   Title: ${current.title}`)
  console.log(`   Current description (first 100 chars):`)
  console.log(`   "${current.description.substring(0, 100)}..."\n`)

  // New English description
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

Available August 11, 2026. Don't miss this opportunity to call Miami home!`

  // Update the description
  const { error } = await supabase
    .from('Listing')
    .update({ description: newDescription })
    .eq('id', listingId)

  if (error) {
    console.log('❌ Error updating:', error.message)
    return
  }

  console.log('✅ Description updated successfully!\n')

  // Verify
  const { data: updated } = await supabase
    .from('Listing')
    .select('title, description')
    .eq('id', listingId)
    .single()

  if (updated) {
    console.log('✅ Verification:')
    console.log(`   Title: ${updated.title}`)
    console.log(`   New description (first 200 chars):`)
    console.log(`   "${updated.description.substring(0, 200)}..."\n`)
  }

  console.log('🎉 Description fix complete!')
  console.log(`   Visit: http://localhost:3000/listing/${listingId}`)
}

fixMiamiCondoDescription()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Fix failed:', error)
    process.exit(1)
  })
