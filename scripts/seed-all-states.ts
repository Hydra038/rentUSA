/**
 * Complete Supabase Seed Script
 * Seeds all 50 US states + DC with realistic English descriptions
 */

import { createClient } from '@supabase/supabase-js'
import { faker } from '@faker-js/faker'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials!')
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

// Realistic English property descriptions
const propertyDescriptions = [
  "Welcome to this stunning apartment featuring modern amenities and spacious living areas. The open-concept layout is perfect for entertaining guests or relaxing after a long day. Large windows provide abundant natural light throughout the space. The kitchen boasts stainless steel appliances, granite countertops, and ample cabinet space. The master bedroom includes a walk-in closet and en-suite bathroom with updated fixtures.",
  
  "Discover urban living at its finest in this beautifully renovated unit. Located in a prime location with easy access to shopping, dining, and entertainment options. The apartment features hardwood floors, high ceilings, and a private balcony with breathtaking city views. Modern kitchen with breakfast bar, in-unit washer and dryer, and central air conditioning. Building amenities include a fitness center, rooftop deck, and secure parking.",
  
  "Experience luxury living in this elegant residence. This spacious unit offers a sophisticated floor plan with designer finishes throughout. The gourmet kitchen includes premium appliances, quartz countertops, and custom cabinetry. The spa-like bathrooms feature marble tile and rainfall showers. Enjoy resort-style amenities including a pool, clubhouse, and 24-hour concierge service.",
  
  "This charming apartment combines classic architecture with modern updates. Features include original hardwood floors, exposed brick walls, and large windows that flood the space with natural light. The updated kitchen includes new appliances and plenty of storage. Close to public transportation, parks, and local shops. Perfect for professionals or small families seeking a comfortable urban lifestyle.",
  
  "Bright and spacious living awaits in this contemporary apartment. The open floor plan seamlessly connects the living, dining, and kitchen areas. Stainless steel appliances, granite countertops, and a convenient breakfast bar make this kitchen a chef's dream. The generously sized bedrooms offer ample closet space. In-unit laundry, central heating and cooling, and a private patio complete this wonderful home.",
  
  "Move-in ready apartment with fresh paint and new flooring throughout. This well-maintained unit features a functional layout with separate living and sleeping areas. The kitchen includes modern appliances and generous counter space for meal preparation. Large closets provide excellent storage options. Located in a quiet neighborhood with easy access to highways and public transit.",
  
  "Stunning waterfront property with panoramic views. This luxurious apartment offers floor-to-ceiling windows, high-end finishes, and an open-concept design. The chef's kitchen features top-of-the-line appliances, a large island, and wine storage. Master suite includes a spa-inspired bathroom and custom walk-in closet. Building amenities include valet parking, fitness center, and doorman service.",
  
  "Cozy and affordable apartment perfect for first-time renters. This efficient unit maximizes space with smart storage solutions. The kitchen includes all essential appliances and a dining area. Updated bathroom with modern fixtures. Conveniently located near schools, grocery stores, and medical facilities. On-site laundry and parking available.",
  
  "Live in style in this professionally designed apartment. Features include recessed lighting, crown molding, and luxury vinyl plank flooring. The modern kitchen offers stainless appliances, soft-close cabinets, and quartz countertops. Spacious bedrooms with ceiling fans and large windows. Community amenities include a swimming pool, fitness center, and playground.",
  
  "This pet-friendly apartment welcomes you and your furry friends. Enjoy the spacious layout with separate dining area and large living room. The kitchen has been updated with new appliances and countertops. Private patio or balcony provides outdoor living space. Conveniently located near dog parks and walking trails. Water and trash included in rent.",
]

// All 50 US states + DC
const allStates = [
  { name: 'Alabama', code: 'al' },
  { name: 'Alaska', code: 'ak' },
  { name: 'Arizona', code: 'az' },
  { name: 'Arkansas', code: 'ar' },
  { name: 'California', code: 'ca' },
  { name: 'Colorado', code: 'co' },
  { name: 'Connecticut', code: 'ct' },
  { name: 'Delaware', code: 'de' },
  { name: 'District of Columbia', code: 'dc' },
  { name: 'Florida', code: 'fl' },
  { name: 'Georgia', code: 'ga' },
  { name: 'Hawaii', code: 'hi' },
  { name: 'Idaho', code: 'id' },
  { name: 'Illinois', code: 'il' },
  { name: 'Indiana', code: 'in' },
  { name: 'Iowa', code: 'ia' },
  { name: 'Kansas', code: 'ks' },
  { name: 'Kentucky', code: 'ky' },
  { name: 'Louisiana', code: 'la' },
  { name: 'Maine', code: 'me' },
  { name: 'Maryland', code: 'md' },
  { name: 'Massachusetts', code: 'ma' },
  { name: 'Michigan', code: 'mi' },
  { name: 'Minnesota', code: 'mn' },
  { name: 'Mississippi', code: 'ms' },
  { name: 'Missouri', code: 'mo' },
  { name: 'Montana', code: 'mt' },
  { name: 'Nebraska', code: 'ne' },
  { name: 'Nevada', code: 'nv' },
  { name: 'New Hampshire', code: 'nh' },
  { name: 'New Jersey', code: 'nj' },
  { name: 'New Mexico', code: 'nm' },
  { name: 'New York', code: 'ny' },
  { name: 'North Carolina', code: 'nc' },
  { name: 'North Dakota', code: 'nd' },
  { name: 'Ohio', code: 'oh' },
  { name: 'Oklahoma', code: 'ok' },
  { name: 'Oregon', code: 'or' },
  { name: 'Pennsylvania', code: 'pa' },
  { name: 'Rhode Island', code: 'ri' },
  { name: 'South Carolina', code: 'sc' },
  { name: 'South Dakota', code: 'sd' },
  { name: 'Tennessee', code: 'tn' },
  { name: 'Texas', code: 'tx' },
  { name: 'Utah', code: 'ut' },
  { name: 'Vermont', code: 'vt' },
  { name: 'Virginia', code: 'va' },
  { name: 'Washington', code: 'wa' },
  { name: 'West Virginia', code: 'wv' },
  { name: 'Wisconsin', code: 'wi' },
  { name: 'Wyoming', code: 'wy' },
]

// Major cities for each state (2-3 per state)
const citiesByState: Record<string, string[]> = {
  al: ['Birmingham', 'Montgomery', 'Mobile'],
  ak: ['Anchorage', 'Fairbanks', 'Juneau'],
  az: ['Phoenix', 'Tucson', 'Mesa'],
  ar: ['Little Rock', 'Fort Smith', 'Fayetteville'],
  ca: ['Los Angeles', 'San Francisco', 'San Diego'],
  co: ['Denver', 'Colorado Springs', 'Aurora'],
  ct: ['Hartford', 'New Haven', 'Stamford'],
  de: ['Wilmington', 'Dover', 'Newark'],
  dc: ['Washington'],
  fl: ['Miami', 'Orlando', 'Tampa'],
  ga: ['Atlanta', 'Savannah', 'Augusta'],
  hi: ['Honolulu', 'Hilo', 'Kailua'],
  id: ['Boise', 'Meridian', 'Nampa'],
  il: ['Chicago', 'Aurora', 'Naperville'],
  in: ['Indianapolis', 'Fort Wayne', 'Evansville'],
  ia: ['Des Moines', 'Cedar Rapids', 'Davenport'],
  ks: ['Wichita', 'Overland Park', 'Kansas City'],
  ky: ['Louisville', 'Lexington', 'Bowling Green'],
  la: ['New Orleans', 'Baton Rouge', 'Shreveport'],
  me: ['Portland', 'Lewiston', 'Bangor'],
  md: ['Baltimore', 'Frederick', 'Rockville'],
  ma: ['Boston', 'Worcester', 'Springfield'],
  mi: ['Detroit', 'Grand Rapids', 'Ann Arbor'],
  mn: ['Minneapolis', 'St Paul', 'Rochester'],
  ms: ['Jackson', 'Gulfport', 'Southaven'],
  mo: ['Kansas City', 'St Louis', 'Springfield'],
  mt: ['Billings', 'Missoula', 'Great Falls'],
  ne: ['Omaha', 'Lincoln', 'Bellevue'],
  nv: ['Las Vegas', 'Reno', 'Henderson'],
  nh: ['Manchester', 'Nashua', 'Concord'],
  nj: ['Newark', 'Jersey City', 'Paterson'],
  nm: ['Albuquerque', 'Santa Fe', 'Las Cruces'],
  ny: ['New York', 'Buffalo', 'Rochester'],
  nc: ['Charlotte', 'Raleigh', 'Greensboro'],
  nd: ['Fargo', 'Bismarck', 'Grand Forks'],
  oh: ['Columbus', 'Cleveland', 'Cincinnati'],
  ok: ['Oklahoma City', 'Tulsa', 'Norman'],
  or: ['Portland', 'Salem', 'Eugene'],
  pa: ['Philadelphia', 'Pittsburgh', 'Allentown'],
  ri: ['Providence', 'Warwick', 'Cranston'],
  sc: ['Charleston', 'Columbia', 'Greenville'],
  sd: ['Sioux Falls', 'Rapid City', 'Aberdeen'],
  tn: ['Nashville', 'Memphis', 'Knoxville'],
  tx: ['Houston', 'Dallas', 'Austin'],
  ut: ['Salt Lake City', 'Provo', 'West Valley City'],
  vt: ['Burlington', 'Essex', 'South Burlington'],
  va: ['Virginia Beach', 'Norfolk', 'Richmond'],
  wa: ['Seattle', 'Spokane', 'Tacoma'],
  wv: ['Charleston', 'Huntington', 'Morgantown'],
  wi: ['Milwaukee', 'Madison', 'Green Bay'],
  wy: ['Cheyenne', 'Casper', 'Laramie'],
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-')
}

async function main() {
  console.log('🌱 Starting complete US seed (all 50 states)...\n')

  // Step 1: Create all 51 states (50 + DC)
  console.log('📍 Creating all 51 states...')
  const { data: states, error: statesError } = await supabase
    .from('State')
    .upsert(allStates, { onConflict: 'code' })
    .select()

  if (statesError) {
    console.error('❌ Error creating states:', statesError)
    return
  }
  console.log(`✅ Created ${states.length} states\n`)

  // Step 2: Create cities for all states
  console.log('🏙️ Creating cities for all states...')
  const citiesData: any[] = []
  
  for (const state of states) {
    const cityNames = citiesByState[state.code] || []
    for (const cityName of cityNames) {
      citiesData.push({
        name: cityName,
        slug: slugify(cityName),
        stateId: state.id,
      })
    }
  }

  const { data: cities, error: citiesError } = await supabase
    .from('City')
    .upsert(citiesData, { onConflict: 'slug,stateId' })
    .select()

  if (citiesError) {
    console.error('❌ Error creating cities:', citiesError)
    return
  }
  console.log(`✅ Created ${cities.length} cities\n`)

  // Step 3: Create users
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
    {
      id: 'landlord-2',
      email: 'landlord2@rentusa.com',
      name: 'Sarah Property Manager',
      role: 'LANDLORD',
      hashedPassword: '$2a$10$examplehash',
    },
  ]

  const { data: users, error: usersError } = await supabase
    .from('User')
    .upsert(usersData, { onConflict: 'email' })
    .select()

  if (usersError) {
    console.error('❌ Error creating users:', usersError)
    return
  }
  console.log(`✅ Created ${users.length} users\n`)

  // Step 4: Create listings (at least 2 per state)
  console.log('🏠 Creating listings for all states...')
  const landlords = users.filter(u => u.role === 'LANDLORD')
  let totalListings = 0
  let featuredCount = 0

  for (const state of states) {
    // Get cities for this state
    const stateCities = cities.filter(c => c.stateId === state.id)
    
    if (stateCities.length === 0) {
      console.log(`⚠️  No cities for ${state.name}, skipping...`)
      continue
    }

    // Create 2-4 listings per state
    const numListings = faker.number.int({ min: 2, max: 4 })
    
    for (let i = 0; i < numListings; i++) {
      const city = faker.helpers.arrayElement(stateCities)
      const landlord = faker.helpers.arrayElement(landlords)
      const isFeatured = totalListings < 50 // First 50 listings featured
      
      const listingData = {
        title: `${faker.commerce.productAdjective()} ${faker.helpers.arrayElement(['Apartment', 'Condo', 'Loft', 'Townhouse'])} in ${city.name}`,
        description: faker.helpers.arrayElement(propertyDescriptions),
        address: faker.location.streetAddress(),
        cityId: city.id,
        stateId: state.id,
        zip: faker.location.zipCode(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        price: faker.number.int({ min: 800, max: 5000 }),
        bedrooms: faker.number.int({ min: 0, max: 4 }),
        bathrooms: faker.number.float({ min: 1, max: 3, precision: 0.5 }),
        sqft: faker.number.int({ min: 450, max: 2800 }),
        propertyType: faker.helpers.arrayElement(['APARTMENT', 'HOUSE', 'CONDO', 'TOWNHOUSE', 'STUDIO', 'LOFT']),
        petsAllowed: faker.datatype.boolean(),
        amenities: faker.helpers.arrayElements([
          'Pool', 'Gym', 'Parking', 'Balcony', 'Pet Friendly',
          'Dishwasher', 'In-Unit Laundry', 'Air Conditioning',
          'Hardwood Floors', 'Walk-in Closet', 'Fireplace',
        ], { min: 3, max: 6 }),
        featured: isFeatured,
        published: true,
        availableDate: faker.date.future(),
        listedByUserId: landlord.id,
      }

      const { data: listing, error: listingError } = await supabase
        .from('Listing')
        .insert(listingData)
        .select()
        .single()

      if (listingError) {
        console.error(`❌ Error creating listing for ${state.name}:`, listingError)
        continue
      }

      // Create 3-5 photos per listing
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

      totalListings++
      if (isFeatured) featuredCount++
    }

    console.log(`✅ Created ${numListings} listings for ${state.name}`)
  }

  console.log(`\n✅ Seed complete!`)
  console.log(`📊 Summary:`)
  console.log(`   - States: ${states.length}`)
  console.log(`   - Cities: ${cities.length}`)
  console.log(`   - Users: ${users.length}`)
  console.log(`   - Listings: ${totalListings}`)
  console.log(`   - Featured: ${featuredCount}`)
  console.log(`   - All descriptions in English ✅`)
}

main()
  .then(() => {
    console.log('\n✨ Seed completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Seed failed:', error)
    process.exit(1)
  })
