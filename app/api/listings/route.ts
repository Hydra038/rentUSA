/**
 * Listings API Routes
 * GET: Search/list listings | POST: Create new listing
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { listingSchema, listingSearchSchema } from '@/lib/validations'

// GET /api/listings - Search listings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = listingSearchSchema.parse({
      query: searchParams.get('q') || undefined,
      stateId: searchParams.get('stateId') || undefined,
      cityId: searchParams.get('cityId') || undefined,
      zip: searchParams.get('zip') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
      bathrooms: searchParams.get('bathrooms') ? Number(searchParams.get('bathrooms')) : undefined,
      petsAllowed: searchParams.get('petsAllowed') === 'true',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
      sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    })

    const where: any = { published: true }

    if (filters.stateId) where.stateId = filters.stateId
    if (filters.cityId) where.cityId = filters.cityId
    if (filters.zip) where.zip = filters.zip
    if (filters.minPrice) where.price = { ...where.price, gte: filters.minPrice }
    if (filters.maxPrice) where.price = { ...where.price, lte: filters.maxPrice }
    if (filters.bedrooms) where.bedrooms = { gte: filters.bedrooms }
    if (filters.bathrooms) where.bathrooms = { gte: filters.bathrooms }
    if (filters.petsAllowed) where.petsAllowed = true
    if (filters.query) {
      where.OR = [
        { title: { contains: filters.query, mode: 'insensitive' } },
        { description: { contains: filters.query, mode: 'insensitive' } },
        { address: { contains: filters.query, mode: 'insensitive' } },
      ]
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          city: true,
          state: true,
          photos: { orderBy: { order: 'asc' } },
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        orderBy: { [filters.sortBy]: filters.sortOrder },
      }),
      prisma.listing.count({ where }),
    ])

    return NextResponse.json({
      listings,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      },
    })
  } catch (error) {
    console.error('Listings fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }
}

// POST /api/listings - Create new listing
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'LANDLORD') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = listingSchema.parse(body)

    const listing = await prisma.listing.create({
      data: {
        ...data,
        price: data.price,
        bathrooms: data.bathrooms,
        listedByUserId: session.user.id,
        amenities: data.amenities || [],
      },
      include: {
        city: true,
        state: true,
        photos: true,
      },
    })

    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    console.error('Listing creation error:', error)
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 })
  }
}
