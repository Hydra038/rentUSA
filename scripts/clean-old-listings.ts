/**
 * Clean Old Listings
 * Removes listings with Lorem ipsum or non-English descriptions
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function cleanOldListings() {
  console.log('🧹 Cleaning old listings with non-English descriptions...\n')

  // Find listings with Lorem ipsum or Latin text
  const { data: allListings, error: fetchError } = await supabase
    .from('Listing')
    .select('id, title, description')

  if (fetchError) {
    console.error('❌ Error fetching listings:', fetchError)
    return
  }

  // Filter for non-English descriptions
  const badListings = allListings?.filter(listing => {
    const desc = listing.description.toLowerCase()
    // Check for Lorem ipsum
    if (desc.includes('lorem') || desc.includes('ipsum')) return true
    // Check for common Latin words from faker
    const latinWords = ['demum', 'cognatus', 'armarium', 'calcar', 'synagoga', 'adamo', 'aiunt', 'ustilo', 'cicuta', 'arbustum', 'thymbra', 'aufero', 'deputo', 'strues']
    if (latinWords.some(word => desc.includes(word))) return true
    // Check if description has English apartment-related words
    const englishWords = /\b(apartment|property|bedroom|bathroom|kitchen|living|available|features|modern|spacious|welcome|stunning|discover|experience)\b/i
    return !englishWords.test(listing.description)
  }) || []

  console.log(`Found ${badListings?.length || 0} listings with non-English descriptions`)

  if (badListings && badListings.length > 0) {
    console.log('\n📝 Examples:')
    badListings.slice(0, 3).forEach(listing => {
      console.log(`   - ${listing.title}`)
      console.log(`     ${listing.description.substring(0, 80)}...`)
    })

    // Delete photos first (foreign key constraint)
    console.log(`\n🗑️  Deleting photos for ${badListings.length} listings...`)
    const listingIds = badListings.map(l => l.id)
    
    const { error: photoError } = await supabase
      .from('Photo')
      .delete()
      .in('listingId', listingIds)

    if (photoError) {
      console.error('❌ Error deleting photos:', photoError)
      return
    }

    // Delete listings
    console.log(`🗑️  Deleting ${badListings.length} listings...`)
    const { error: deleteError } = await supabase
      .from('Listing')
      .delete()
      .in('id', listingIds)

    if (deleteError) {
      console.error('❌ Error deleting listings:', deleteError)
      return
    }

    console.log(`✅ Deleted ${badListings.length} listings with non-English descriptions`)
  } else {
    console.log('✅ No non-English listings found!')
  }

  // Verify remaining listings
  const { data: remainingListings } = await supabase
    .from('Listing')
    .select('id, description')

  console.log(`\n📊 Remaining listings: ${remainingListings?.length || 0}`)

  if (remainingListings && remainingListings.length > 0) {
    const hasEnglishWords = remainingListings.filter(l => 
      /\b(apartment|property|bedroom|bathroom|kitchen|living|available|features|modern|spacious)\b/i.test(l.description)
    ).length

    console.log(`   - Listings with English words: ${hasEnglishWords}`)
    console.log(`   - Success rate: ${Math.round((hasEnglishWords / remainingListings.length) * 100)}%`)
  }
}

cleanOldListings()
  .then(() => {
    console.log('\n✨ Cleanup complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Cleanup failed:', error)
    process.exit(1)
  })
