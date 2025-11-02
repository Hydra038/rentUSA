/**
 * Verify Database Data
 * Quick script to check if data was seeded properly
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyData() {
  console.log('🔍 Verifying database data...\n')

  // Check States
  const { data: states, error: statesError } = await supabase
    .from('State')
    .select('*')
    .order('name')

  if (statesError) {
    console.error('❌ Error fetching states:', statesError)
  } else {
    console.log(`✅ States: ${states?.length || 0} rows`)
    if (states && states.length > 0) {
      console.log('   First 3:', states.slice(0, 3).map(s => s.name).join(', '))
    }
  }

  // Check Cities
  const { data: cities, error: citiesError } = await supabase
    .from('City')
    .select('*')

  if (citiesError) {
    console.error('❌ Error fetching cities:', citiesError)
  } else {
    console.log(`✅ Cities: ${cities?.length || 0} rows`)
    if (cities && cities.length > 0) {
      console.log('   First 3:', cities.slice(0, 3).map(c => c.name).join(', '))
    }
  }

  // Check Users
  const { data: users, error: usersError } = await supabase
    .from('User')
    .select('id, email, role')

  if (usersError) {
    console.error('❌ Error fetching users:', usersError)
  } else {
    console.log(`✅ Users: ${users?.length || 0} rows`)
    if (users && users.length > 0) {
      users.forEach(u => console.log(`   - ${u.email} (${u.role})`))
    }
  }

  // Check Listings
  const { data: listings, error: listingsError } = await supabase
    .from('Listing')
    .select('id, title, featured, published')

  if (listingsError) {
    console.error('❌ Error fetching listings:', listingsError)
  } else {
    console.log(`✅ Listings: ${listings?.length || 0} rows`)
    const featured = listings?.filter(l => l.featured).length || 0
    const published = listings?.filter(l => l.published).length || 0
    console.log(`   - Featured: ${featured}`)
    console.log(`   - Published: ${published}`)
    if (listings && listings.length > 0) {
      console.log('   First 3:')
      listings.slice(0, 3).forEach(l => {
        console.log(`     • ${l.title} (Featured: ${l.featured}, Published: ${l.published})`)
      })
    }
  }

  // Check Photos
  const { data: photos, error: photosError } = await supabase
    .from('Photo')
    .select('id, listingId, isPrimary')

  if (photosError) {
    console.error('❌ Error fetching photos:', photosError)
  } else {
    console.log(`✅ Photos: ${photos?.length || 0} rows`)
    const primary = photos?.filter(p => p.isPrimary).length || 0
    console.log(`   - Primary photos: ${primary}`)
  }

  console.log('\n📊 Verification complete!')
  
  if (listings && listings.length === 0) {
    console.log('\n⚠️  WARNING: No listings found!')
    console.log('This could mean:')
    console.log('1. Row Level Security is blocking reads')
    console.log('2. Data was not inserted properly')
    console.log('3. Wrong database/schema')
  }
}

verifyData().catch(console.error)
