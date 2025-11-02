/**
 * Check California Listing Photos
 * Debug image loading issues
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkCaliforniaPhotos() {
  console.log('🔍 Checking California listing photos...\n')

  // Get California state
  const { data: state } = await supabase
    .from('State')
    .select('*')
    .eq('code', 'ca')
    .single()

  if (!state) {
    console.log('❌ California not found')
    return
  }

  // Get California listings with photos
  const { data: listings } = await supabase
    .from('Listing')
    .select(`
      id,
      title,
      city:City(name),
      photos:Photo(*)
    `)
    .eq('stateId', state.id)
    .eq('published', true)

  console.log(`📋 Found ${listings?.length || 0} California listings\n`)

  listings?.forEach((listing, i) => {
    console.log(`${i + 1}. ${listing.title}`)
    console.log(`   City: ${listing.city.name}`)
    console.log(`   ID: ${listing.id}`)
    console.log(`   Photos: ${listing.photos?.length || 0}`)
    
    if (!listing.photos || listing.photos.length === 0) {
      console.log('   ❌ NO PHOTOS!')
    } else {
      const primaryPhoto = listing.photos.find((p: any) => p.isPrimary)
      console.log(`   Primary photo: ${primaryPhoto ? 'YES' : 'NO (will use first)'}`)
      
      // Check first photo URL
      const photoToUse = primaryPhoto || listing.photos[0]
      console.log(`   URL: ${photoToUse.url}`)
      
      // Check if URL is valid
      if (!photoToUse.url) {
        console.log('   ❌ Photo URL is empty!')
      } else if (!photoToUse.url.startsWith('http')) {
        console.log('   ⚠️  Photo URL is not a full URL!')
      } else {
        console.log('   ✅ Photo URL looks valid')
      }
    }
    console.log()
  })

  // Check specific listing if it's "Awesome Apartment in Los Angeles"
  const awesomeListing = listings?.find(l => 
    l.title.toLowerCase().includes('awesome') && 
    l.city.name.toLowerCase().includes('los angeles')
  )

  if (awesomeListing) {
    console.log('\n🎯 Found "Awesome Apartment in Los Angeles":')
    console.log(`   ID: ${awesomeListing.id}`)
    console.log(`   Photos count: ${awesomeListing.photos?.length || 0}`)
    
    if (awesomeListing.photos && awesomeListing.photos.length > 0) {
      console.log('\n   All photo URLs:')
      awesomeListing.photos.forEach((photo: any, i: number) => {
        console.log(`   ${i + 1}. ${photo.url} (Primary: ${photo.isPrimary})`)
      })
    }
  }
}

checkCaliforniaPhotos()
  .then(() => {
    console.log('\n✨ Check complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Check failed:', error)
    process.exit(1)
  })
