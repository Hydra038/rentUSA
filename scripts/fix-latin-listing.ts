/**
 * Find and Fix Specific Listing
 * Find the listing with Latin description and update it
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

// English descriptions
const englishDescriptions = [
  "Welcome to this stunning apartment featuring modern amenities and spacious living areas. The open-concept layout is perfect for entertaining guests or relaxing after a long day. Large windows provide abundant natural light throughout the space. The kitchen boasts stainless steel appliances, granite countertops, and ample cabinet space. The master bedroom includes a walk-in closet and en-suite bathroom with updated fixtures.",
  
  "Discover urban living at its finest in this beautifully renovated unit. Located in a prime location with easy access to shopping, dining, and entertainment options. The apartment features hardwood floors, high ceilings, and a private balcony with breathtaking city views. Modern kitchen with breakfast bar, in-unit washer and dryer, and central air conditioning. Building amenities include a fitness center, rooftop deck, and secure parking.",
  
  "Experience luxury living in this elegant residence. This spacious unit offers a sophisticated floor plan with designer finishes throughout. The gourmet kitchen includes premium appliances, quartz countertops, and custom cabinetry. The spa-like bathrooms feature marble tile and rainfall showers. Enjoy resort-style amenities including a pool, clubhouse, and 24-hour concierge service.",
  
  "This charming apartment combines classic architecture with modern updates. Features include original hardwood floors, exposed brick walls, and large windows that flood the space with natural light. The updated kitchen includes new appliances and plenty of storage. Close to public transportation, parks, and local shops. Perfect for professionals or small families seeking a comfortable urban lifestyle.",
  
  "Bright and spacious living awaits in this contemporary apartment. The open floor plan seamlessly connects the living, dining, and kitchen areas. Stainless steel appliances, granite countertops, and a convenient breakfast bar make this kitchen a chef's dream. The generously sized bedrooms offer ample closet space. In-unit laundry, central heating and cooling, and a private patio complete this wonderful home.",
]

async function fixLatinListing() {
  console.log('🔍 Finding listing with Latin description...\n')

  // Search for the specific listing ID from the URL
  const listingId = '4eebd9b1-fa5c-45f7-b58c-cc2fecb630f6'

  const { data: listing, error } = await supabase
    .from('Listing')
    .select('id, title, description, city:City(name), state:State(name)')
    .eq('id', listingId)
    .single()

  if (error || !listing) {
    console.error('❌ Listing not found:', error)
    
    // Try to find by description content
    console.log('\n🔍 Searching by description content...')
    const { data: listings } = await supabase
      .from('Listing')
      .select('id, title, description')
      .ilike('description', '%Umquam valde%')
    
    if (listings && listings.length > 0) {
      console.log(`\nFound ${listings.length} listings with Latin text:`)
      for (const l of listings) {
        console.log(`\n📝 ${l.title}`)
        console.log(`   ID: ${l.id}`)
        console.log(`   First 100 chars: ${l.description.substring(0, 100)}...`)
        
        // Update this listing
        const newDescription = englishDescriptions[Math.floor(Math.random() * englishDescriptions.length)]
        
        const { error: updateError } = await supabase
          .from('Listing')
          .update({ description: newDescription })
          .eq('id', l.id)
        
        if (updateError) {
          console.error(`   ❌ Error updating: ${updateError.message}`)
        } else {
          console.log(`   ✅ Updated with English description`)
        }
      }
    } else {
      console.log('No listings found with that text')
    }
    return
  }

  console.log(`Found listing: ${listing.title}`)
  console.log(`City: ${listing.city.name}, State: ${listing.state.name}`)
  console.log(`\nCurrent description (first 200 chars):`)
  console.log(listing.description.substring(0, 200))

  // Check if it's Latin
  const hasLatin = /umquam|valde|dapifer|vinitor|textilis|admoneo|defessus|cilicium|derideo|demitto/i.test(listing.description)

  if (hasLatin) {
    console.log('\n⚠️  Contains Latin text - updating...')
    
    const newDescription = englishDescriptions[1] // Use "Discover urban living" description
    
    const { error: updateError } = await supabase
      .from('Listing')
      .update({ description: newDescription })
      .eq('id', listing.id)

    if (updateError) {
      console.error('❌ Update failed:', updateError)
    } else {
      console.log('✅ Updated successfully!')
      console.log('\nNew description (first 200 chars):')
      console.log(newDescription.substring(0, 200))
    }
  } else {
    console.log('\n✅ Description is already in English')
  }
}

fixLatinListing()
  .then(() => {
    console.log('\n✨ Fix complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Fix failed:', error)
    process.exit(1)
  })
