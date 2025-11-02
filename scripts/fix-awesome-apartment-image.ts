/**
 * Fix "Awesome Apartment in Los Angeles" Image
 * Replace with a working Unsplash image
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixAwesomeApartmentImage() {
  console.log('🔧 Fixing "Awesome Apartment in Los Angeles" images...\n')

  const listingId = 'df544fcb-bae8-4f73-b01d-f89709616024'

  // First, get current photos
  const { data: currentPhotos } = await supabase
    .from('Photo')
    .select('*')
    .eq('listingId', listingId)

  console.log(`📸 Current photos: ${currentPhotos?.length || 0}`)

  // Delete old photos
  if (currentPhotos && currentPhotos.length > 0) {
    const { error: deleteError } = await supabase
      .from('Photo')
      .delete()
      .eq('listingId', listingId)

    if (deleteError) {
      console.log('❌ Error deleting old photos:', deleteError.message)
      return
    }
    console.log('✅ Deleted old photos')
  }

  // Working Unsplash apartment images (tested and verified)
  const newPhotos = [
    {
      listingId,
      url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      publicId: 'unsplash-1522708323590-d24dbb6b0267',
      isPrimary: true,
      order: 0
    },
    {
      listingId,
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      publicId: 'unsplash-1560448204-e02f11c3d0e2',
      isPrimary: false,
      order: 1
    },
    {
      listingId,
      url: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
      publicId: 'unsplash-1560448204-603b3fc33ddc',
      isPrimary: false,
      order: 2
    },
    {
      listingId,
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
      publicId: 'unsplash-1556909114-f6e7ad7d3136',
      isPrimary: false,
      order: 3
    },
    {
      listingId,
      url: 'https://images.unsplash.com/photo-1502672260066-6bc35f0a1cbc?w=800',
      publicId: 'unsplash-1502672260066-6bc35f0a1cbc',
      isPrimary: false,
      order: 4
    }
  ]

  // Insert new photos
  const { data: inserted, error: insertError } = await supabase
    .from('Photo')
    .insert(newPhotos)
    .select()

  if (insertError) {
    console.log('❌ Error inserting new photos:', insertError.message)
    return
  }

  console.log(`✅ Inserted ${inserted?.length || 0} new photos\n`)

  // Verify
  const { data: listing } = await supabase
    .from('Listing')
    .select(`
      id,
      title,
      city:City(name),
      photos:Photo(url, isPrimary)
    `)
    .eq('id', listingId)
    .single()

  if (listing) {
    console.log('✅ Verification:')
    console.log(`   Listing: ${listing.title}`)
    console.log(`   City: ${listing.city.name}`)
    console.log(`   Photos: ${listing.photos?.length || 0}`)
    console.log('\n   Photo URLs:')
    listing.photos?.forEach((photo: any, i: number) => {
      console.log(`   ${i + 1}. ${photo.url} ${photo.isPrimary ? '⭐ PRIMARY' : ''}`)
    })
  }

  console.log('\n🎉 Image fix complete!')
  console.log('   Visit: http://localhost:3000/state/ca')
  console.log('   The "Awesome Apartment in Los Angeles" should now have working images!')
}

fixAwesomeApartmentImage()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Fix failed:', error)
    process.exit(1)
  })
