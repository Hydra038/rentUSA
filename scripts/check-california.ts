/**
 * Check California Listings
 * Verify descriptions are in English
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkCaliforniaListings() {
  console.log('🔍 Checking California listings...\n')

  // Get California state
  const { data: caState } = await supabase
    .from('State')
    .select('id, name, code')
    .eq('code', 'ca')
    .single()

  if (!caState) {
    console.error('❌ California state not found')
    return
  }

  console.log(`📍 Found state: ${caState.name} (${caState.code})\n`)

  // Get all California listings
  const { data: listings, error } = await supabase
    .from('Listing')
    .select('id, title, description, city:City(name)')
    .eq('stateId', caState.id)
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('❌ Error fetching listings:', error)
    return
  }

  console.log(`📊 Found ${listings.length} California listings\n`)

  listings.forEach((listing, i) => {
    console.log(`${i + 1}. ${listing.title}`)
    const city = Array.isArray(listing.city) ? listing.city[0] : listing.city
    console.log(`   City: ${city?.name || 'N/A'}`)
    console.log(`   Description (first 150 chars):`)
    console.log(`   ${listing.description.substring(0, 150)}...`)
    
    // Check if English
    const desc = listing.description.toLowerCase()
    const hasLatin = ['lorem', 'ipsum', 'demum', 'cognatus', 'calcar', 'synagoga', 'adamo', 'ustilo', 'cicuta', 'thymbra'].some(word => desc.includes(word))
    const hasEnglish = /\b(apartment|property|bedroom|bathroom|kitchen|living|available|features|modern|spacious|welcome|stunning)\b/i.test(listing.description)
    
    if (hasLatin) {
      console.log(`   ❌ CONTAINS LATIN WORDS`)
    } else if (!hasEnglish) {
      console.log(`   ⚠️  NO ENGLISH KEYWORDS FOUND`)
    } else {
      console.log(`   ✅ English description`)
    }
    console.log()
  })

  // Count issues
  const withLatin = listings.filter(l => {
    const desc = l.description.toLowerCase()
    return ['lorem', 'ipsum', 'demum', 'cognatus', 'calcar', 'synagoga', 'adamo', 'ustilo', 'cicuta', 'thymbra'].some(word => desc.includes(word))
  })

  console.log(`\n📈 Summary:`)
  console.log(`   - Total CA listings: ${listings.length}`)
  console.log(`   - With Latin/Lorem: ${withLatin.length}`)
  console.log(`   - With English: ${listings.length - withLatin.length}`)

  if (withLatin.length > 0) {
    console.log(`\n⚠️  Need to clean ${withLatin.length} California listings`)
  }
}

checkCaliforniaListings()
  .then(() => {
    console.log('\n✨ Check complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Check failed:', error)
    process.exit(1)
  })
