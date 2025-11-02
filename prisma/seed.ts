/**
 * Database Seed Script
 * Populates database with all 50 states + DC, sample cities, and 100+ realistic listings
 * Run with: npm run db:seed
 */

import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// All 50 US states + District of Columbia
const STATES = [
  { name: "Alabama", code: "AL" }, { name: "Alaska", code: "AK" }, { name: "Arizona", code: "AZ" },
  { name: "Arkansas", code: "AR" }, { name: "California", code: "CA" }, { name: "Colorado", code: "CO" },
  { name: "Connecticut", code: "CT" }, { name: "Delaware", code: "DE" }, { name: "District of Columbia", code: "DC" },
  { name: "Florida", code: "FL" }, { name: "Georgia", code: "GA" }, { name: "Hawaii", code: "HI" },
  { name: "Idaho", code: "ID" }, { name: "Illinois", code: "IL" }, { name: "Indiana", code: "IN" },
  { name: "Iowa", code: "IA" }, { name: "Kansas", code: "KS" }, { name: "Kentucky", code: "KY" },
  { name: "Louisiana", code: "LA" }, { name: "Maine", code: "ME" }, { name: "Maryland", code: "MD" },
  { name: "Massachusetts", code: "MA" }, { name: "Michigan", code: "MI" }, { name: "Minnesota", code: "MN" },
  { name: "Mississippi", code: "MS" }, { name: "Missouri", code: "MO" }, { name: "Montana", code: "MT" },
  { name: "Nebraska", code: "NE" }, { name: "Nevada", code: "NV" }, { name: "New Hampshire", code: "NH" },
  { name: "New Jersey", code: "NJ" }, { name: "New Mexico", code: "NM" }, { name: "New York", code: "NY" },
  { name: "North Carolina", code: "NC" }, { name: "North Dakota", code: "ND" }, { name: "Ohio", code: "OH" },
  { name: "Oklahoma", code: "OK" }, { name: "Oregon", code: "OR" }, { name: "Pennsylvania", code: "PA" },
  { name: "Rhode Island", code: "RI" }, { name: "South Carolina", code: "SC" }, { name: "South Dakota", code: "SD" },
  { name: "Tennessee", code: "TN" }, { name: "Texas", code: "TX" }, { name: "Utah", code: "UT" },
  { name: "Vermont", code: "VT" }, { name: "Virginia", code: "VA" }, { name: "Washington", code: "WA" },
  { name: "West Virginia", code: "WV" }, { name: "Wisconsin", code: "WI" }, { name: "Wyoming", code: "WY" }
]

// Sample cities for each state (subset for demonstration)
const CITIES_BY_STATE: Record<string, string[]> = {
  'CA': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento'],
  'NY': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'],
  'TX': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
  'FL': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
  'IL': ['Chicago', 'Aurora', 'Naperville', 'Rockford', 'Joliet'],
  'PA': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading'],
  'OH': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'],
  'GA': ['Atlanta', 'Augusta', 'Columbus', 'Savannah', 'Athens'],
  'NC': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem'],
  'MI': ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor'],
  'WA': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue'],
  'DC': ['Washington'],
}

const AMENITIES = [
  'Air Conditioning', 'Heating', 'Dishwasher', 'Washer/Dryer', 'Parking',
  'Balcony', 'Patio', 'Gym', 'Pool', 'WiFi Included', 'Hardwood Floors',
  'Stainless Steel Appliances', 'Walk-in Closet', 'Garden', 'Fireplace',
  'Security System', 'Elevator', 'Doorman', 'Storage', 'EV Charging'
]

const PROPERTY_TITLES = [
  'Modern Downtown Apartment', 'Spacious Family Home', 'Luxury Condo',
  'Cozy Studio Loft', 'Updated Townhouse', 'Charming Bungalow',
  'Contemporary Flat', 'Elegant Duplex', 'Renovated Victorian',
  'Bright Corner Unit', 'Pet-Friendly Apartment', 'Garden Level Unit'
]

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data (optional - comment out in production)
  console.log('🧹 Cleaning database...')
  await prisma.photo.deleteMany()
  await prisma.inquiry.deleteMany()
  await prisma.savedListing.deleteMany()
  await prisma.listing.deleteMany()
  await prisma.city.deleteMany()
  await prisma.state.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Users
  console.log('👥 Creating users...')
  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@rentusa.com',
      hashedPassword,
      role: 'ADMIN',
    },
  })

  const landlords = []
  for (let i = 0; i < 10; i++) {
    const landlord = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: `landlord${i + 1}@rentusa.com`,
        hashedPassword,
        role: 'LANDLORD',
      },
    })
    landlords.push(landlord)
  }

  const renter = await prisma.user.create({
    data: {
      name: 'John Renter',
      email: 'renter@rentusa.com',
      hashedPassword,
      role: 'RENTER',
    },
  })

  console.log(`✅ Created ${landlords.length + 2} users`)

  // 2. Create States
  console.log('🗺️  Creating states...')
  const stateRecords = []
  for (const state of STATES) {
    const record = await prisma.state.create({
      data: state,
    })
    stateRecords.push(record)
  }
  console.log(`✅ Created ${stateRecords.length} states`)

  // 3. Create Cities
  console.log('🏙️  Creating cities...')
  const cityRecords = []
  for (const [stateCode, cities] of Object.entries(CITIES_BY_STATE)) {
    const state = stateRecords.find(s => s.code === stateCode)
    if (!state) continue

    for (const cityName of cities) {
      const city = await prisma.city.create({
        data: {
          name: cityName,
          stateId: state.id,
          slug: cityName.toLowerCase().replace(/\s+/g, '-'),
        },
      })
      cityRecords.push(city)
    }
  }
  console.log(`✅ Created ${cityRecords.length} cities`)

  // 4. Create Listings (100+)
  console.log('🏠 Creating listings...')
  const listings = []
  
  for (let i = 0; i < 120; i++) {
    const city = faker.helpers.arrayElement(cityRecords)
    const state = stateRecords.find(s => s.id === city.stateId)!
    const landlord = faker.helpers.arrayElement(landlords)
    
    const bedrooms = faker.helpers.arrayElement([1, 2, 3, 4, 5])
    const bathrooms = faker.helpers.arrayElement([1, 1.5, 2, 2.5, 3])
    const sqft = faker.number.int({ min: 600, max: 3000 })
    const price = faker.number.int({ min: 800, max: 5000 })
    const petsAllowed = faker.datatype.boolean()
    const featured = i < 10 // First 10 listings are featured

    const amenitiesCount = faker.number.int({ min: 3, max: 8 })
    const selectedAmenities = faker.helpers.arrayElements(AMENITIES, amenitiesCount)

    const titleBase = faker.helpers.arrayElement(PROPERTY_TITLES)
    const title = `${titleBase} - ${bedrooms}BR/${bathrooms}BA`

    const listing = await prisma.listing.create({
      data: {
        title,
        description: `${faker.lorem.paragraphs(3)}\n\nThis beautiful ${bedrooms}-bedroom, ${bathrooms}-bathroom property offers ${sqft} sqft of living space. Located in the heart of ${city.name}, you'll enjoy easy access to shopping, dining, and entertainment. ${petsAllowed ? 'Pet-friendly!' : 'No pets allowed.'}\n\nDon't miss this opportunity to call this place home!`,
        address: faker.location.streetAddress(),
        cityId: city.id,
        stateId: state.id,
        zip: faker.location.zipCode('#####'),
        latitude: Number(faker.location.latitude()),
        longitude: Number(faker.location.longitude()),
        price,
        bedrooms,
        bathrooms,
        sqft,
        petsAllowed,
        amenities: selectedAmenities,
        featured,
        published: true,
        availableDate: faker.date.future(),
        listedByUserId: landlord.id,
      },
    })
    listings.push(listing)

    // Add 3-5 photos per listing
    const photoCount = faker.number.int({ min: 3, max: 5 })
    
    // Real apartment/interior images from Unsplash
    const apartmentInteriors = [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop', // Modern living room
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop', // Stylish apartment interior
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop', // Modern kitchen
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200&h=800&fit=crop', // Bedroom with large windows
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&h=800&fit=crop', // Luxury bathroom
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1200&h=800&fit=crop', // Cozy living space
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&h=800&fit=crop', // Modern apartment view
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop', // Minimalist kitchen
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop', // Bright bedroom
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&h=800&fit=crop', // Dining area
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=1200&h=800&fit=crop', // Modern living room
      'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=1200&h=800&fit=crop', // Stylish bedroom
      'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1200&h=800&fit=crop', // Clean kitchen
      'https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=1200&h=800&fit=crop', // Contemporary living space
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop', // Elegant bedroom
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop', // Modern bathroom
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop', // Open concept living
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop', // Luxury apartment
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&h=800&fit=crop', // Spacious living room
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop', // Modern interior
    ]

    // Apartment building exteriors
    const apartmentExteriors = [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop', // Modern apartment building
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop', // City skyscraper
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop', // Residential building
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop', // Modern house exterior
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&h=800&fit=crop', // Apartment complex
      'https://images.unsplash.com/photo-1448630360428-65456885c650?w=1200&h=800&fit=crop', // Residential neighborhood
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&h=800&fit=crop', // Condo building
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop', // Luxury apartments
    ]
    
    // Use building exterior as primary photo, interiors for the rest
    for (let j = 0; j < photoCount; j++) {
      const imageUrl = j === 0 
        ? faker.helpers.arrayElement(apartmentExteriors)
        : faker.helpers.arrayElement(apartmentInteriors)
        
      await prisma.photo.create({
        data: {
          listingId: listing.id,
          url: imageUrl,
          publicId: `rentusa/listing_${listing.id}_${j}`,
          isPrimary: j === 0,
          order: j,
        },
      })
    }
  }

  console.log(`✅ Created ${listings.length} listings with photos`)

  // 5. Create Sample Inquiries
  console.log('💬 Creating sample inquiries...')
  for (let i = 0; i < 20; i++) {
    const listing = faker.helpers.arrayElement(listings)
    await prisma.inquiry.create({
      data: {
        listingId: listing.id,
        userId: renter.id,
        name: renter.name || 'John Renter',
        email: renter.email,
        phone: faker.phone.number(),
        message: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(['PENDING', 'RESPONDED', 'CLOSED']),
      },
    })
  }
  console.log('✅ Created 20 inquiries')

  // 6. Create Saved Listings
  console.log('⭐ Creating saved listings...')
  const savedListings = faker.helpers.arrayElements(listings, 10)
  for (const listing of savedListings) {
    await prisma.savedListing.create({
      data: {
        userId: renter.id,
        listingId: listing.id,
      },
    })
  }
  console.log('✅ Created 10 saved listings')

  console.log('🎉 Seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`   Users: ${landlords.length + 2} (1 admin, ${landlords.length} landlords, 1 renter)`)
  console.log(`   States: ${stateRecords.length}`)
  console.log(`   Cities: ${cityRecords.length}`)
  console.log(`   Listings: ${listings.length}`)
  console.log(`   Featured: ${listings.filter(l => l.featured).length}`)
  console.log('\n🔐 Test Credentials:')
  console.log('   Admin: admin@rentusa.com / password123')
  console.log('   Landlord: landlord1@rentusa.com / password123')
  console.log('   Renter: renter@rentusa.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
