/**
 * Supabase Seed Script
 * Populates database with sample data using Supabase JS
 */

import { createClient } from '@supabase/supabase-js'
import { faker } from '@faker-js/faker'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials!')
  console.error('Please check your .env file has:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Professional apartment photos from Unsplash
const apartmentExteriors = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  'https://images.unsplash.com/photo-1502672260066-6bc35f0a1cbc?w=800',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
  'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
  'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800',
]

const apartmentInteriors = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
  'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800',
  'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
  'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800',
  'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800',
  'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800',
  'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800',
]

async function main() {
  console.log('🌱 Starting Supabase seed...')

  // Step 1: Create States
  console.log('📍 Creating states...')
  const statesData = [
    { name: 'Alabama', code: 'al' },
    { name: 'Alaska', code: 'ak' },
    { name: 'Arizona', code: 'az' },
    { name: 'California', code: 'ca' },
    { name: 'Colorado', code: 'co' },
    { name: 'Florida', code: 'fl' },
    { name: 'Georgia', code: 'ga' },
    { name: 'Illinois', code: 'il' },
    { name: 'New York', code: 'ny' },
    { name: 'Texas', code: 'tx' },
    { name: 'Washington', code: 'wa' },
  ]

  const { data: states, error: statesError } = await supabase
    .from('State')
    .upsert(statesData, { onConflict: 'code' })
    .select()

  if (statesError) {
    console.error('Error creating states:', statesError)
    return
  }

  console.log(`✅ Created ${states.length} states`)

  // Step 2: Create Cities
  console.log('🏙️ Creating cities...')
  const citiesData = [
    { name: 'Los Angeles', slug: 'los-angeles', stateId: states.find(s => s.code === 'ca')!.id },
    { name: 'San Francisco', slug: 'san-francisco', stateId: states.find(s => s.code === 'ca')!.id },
    { name: 'Chicago', slug: 'chicago', stateId: states.find(s => s.code === 'il')!.id },
    { name: 'New York', slug: 'new-york', stateId: states.find(s => s.code === 'ny')!.id },
    { name: 'Miami', slug: 'miami', stateId: states.find(s => s.code === 'fl')!.id },
    { name: 'Seattle', slug: 'seattle', stateId: states.find(s => s.code === 'wa')!.id },
    { name: 'Austin', slug: 'austin', stateId: states.find(s => s.code === 'tx')!.id },
    { name: 'Denver', slug: 'denver', stateId: states.find(s => s.code === 'co')!.id },
  ]

  const { data: cities, error: citiesError } = await supabase
    .from('City')
    .upsert(citiesData, { onConflict: 'slug,stateId' })
    .select()

  if (citiesError) {
    console.error('Error creating cities:', citiesError)
    return
  }

  console.log(`✅ Created ${cities.length} cities`)

  // Step 3: Create Test Users
  console.log('👥 Creating users...')
  const usersData = [
    {
      id: 'admin-user-id',
      email: 'admin@rentusa.com',
      name: 'Admin User',
      role: 'ADMIN',
      hashedPassword: '$2a$10$examplehash',
    },
    {
      id: 'landlord-1',
      email: 'landlord1@rentusa.com',
      name: 'John Landlord',
      role: 'LANDLORD',
      hashedPassword: '$2a$10$examplehash',
    },
  ]

  const { data: users, error: usersError } = await supabase
    .from('User')
    .upsert(usersData, { onConflict: 'email' })
    .select()

  if (usersError) {
    console.error('Error creating users:', usersError)
    return
  }

  console.log(`✅ Created ${users.length} users`)

  // Step 4: Create Listings
  console.log('🏠 Creating listings...')
  const landlordId = users.find(u => u.role === 'LANDLORD')!.id

  for (let i = 0; i < 20; i++) {
    const city = faker.helpers.arrayElement(cities)
    const state = states.find(s => s.id === city.stateId)!
    const isFeatured = i < 12 // First 12 listings are featured

    const listingData = {
      title: `${faker.commerce.productAdjective()} ${faker.helpers.arrayElement(['Apartment', 'Condo', 'Loft'])} in ${city.name}`,
      description: faker.lorem.paragraphs(3),
      address: faker.location.streetAddress(),
      cityId: city.id,
      stateId: state.id,
      zip: faker.location.zipCode(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      price: faker.number.int({ min: 1000, max: 5000 }),
      bedrooms: faker.number.int({ min: 0, max: 4 }),
      bathrooms: faker.number.float({ min: 1, max: 3, precision: 0.5 }),
      sqft: faker.number.int({ min: 500, max: 2500 }),
      propertyType: faker.helpers.arrayElement(['APARTMENT', 'HOUSE', 'CONDO', 'TOWNHOUSE', 'STUDIO', 'LOFT']),
      petsAllowed: faker.datatype.boolean(),
      amenities: faker.helpers.arrayElements([
        'Pool', 'Gym', 'Parking', 'Balcony', 'Pet Friendly', 
        'Dishwasher', 'In-Unit Laundry', 'Air Conditioning'
      ], { min: 2, max: 5 }),
      featured: isFeatured,
      published: true,
      availableDate: faker.date.future(),
      listedByUserId: landlordId,
    }

    const { data: listing, error: listingError } = await supabase
      .from('Listing')
      .insert(listingData)
      .select()
      .single()

    if (listingError) {
      console.error(`Error creating listing ${i + 1}:`, listingError)
      continue
    }

    // Create 3-5 photos for each listing
    const numPhotos = faker.number.int({ min: 3, max: 5 })
    for (let j = 0; j < numPhotos; j++) {
      const photoUrl = j === 0 
        ? faker.helpers.arrayElement(apartmentExteriors)
        : faker.helpers.arrayElement(apartmentInteriors)

      await supabase.from('Photo').insert({
        listingId: listing.id,
        url: photoUrl,
        publicId: `listing-${listing.id}-photo-${j}`,
        isPrimary: j === 0,
        order: j,
      })
    }

    console.log(`✅ Created listing ${i + 1}/20 (Featured: ${isFeatured})`)
  }

  console.log('✨ Seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`- ${states.length} states`)
  console.log(`- ${cities.length} cities`)
  console.log(`- ${users.length} users`)
  console.log(`- 20 listings (12 featured)`)
  console.log(`- ~80 photos`)
  console.log('\n🌐 Visit http://localhost:3000 to see your listings!')
}

main()
  .catch((error) => {
    console.error('❌ Seed error:', error)
    process.exit(1)
  })
