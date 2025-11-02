/**
 * API Route: Create New Listing (Admin)
 * POST /api/admin/listings
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { getCoordinates } from '@/lib/geocoding'

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      price,
      address,
      cityId,
      stateId,
      zipCode,
      bedrooms,
      bathrooms,
      squareFeet,
      amenities,
      petPolicy,
      availableFrom,
      published,
      featured,
      images,
      listedBy,
    } = body

    // Validate required fields
    if (!title || !description || !price || !address || !cityId || !stateId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert petPolicy to boolean
    const petsAllowed = petPolicy !== 'NO_PETS'

    // Get city and state names for geocoding
    const { data: cityData } = await supabaseAdmin
      .from('City')
      .select('name, state:State(name)')
      .eq('id', cityId)
      .single()

    // Geocode the address to get coordinates
    let coordinates = { latitude: 39.8283, longitude: -98.5795 } // USA center fallback
    if (cityData) {
      try {
        coordinates = await getCoordinates(
          address,
          cityData.name,
          (cityData.state as any).name,
          zipCode
        )
      } catch (error) {
        console.error('Geocoding error:', error)
      }
    }

    // Create the listing
    const { data: listing, error: listingError } = await supabaseAdmin
      .from('Listing')
      .insert({
        title,
        description,
        price,
        address,
        cityId,
        stateId,
        zip: zipCode || '',
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        bedrooms,
        bathrooms,
        sqft: squareFeet || null,
        amenities: amenities || [],
        petsAllowed,
        availableDate: availableFrom || null,
        published: published || false,
        featured: featured || false,
        listedByUserId: listedBy || session.user.id,
      })
      .select()
      .single()

    if (listingError) {
      console.error('Error creating listing:', listingError)
      return NextResponse.json(
        { error: 'Failed to create listing' },
        { status: 500 }
      )
    }

    // Upload images if provided
    if (images && images.length > 0) {
      const photoInserts = images.map((url: string, index: number) => ({
        listingId: listing.id,
        url,
        publicId: `listing-${listing.id}-${index}`,
        isPrimary: index === 0,
        order: index,
      }))

      const { error: photosError } = await supabaseAdmin
        .from('Photo')
        .insert(photoInserts)

      if (photosError) {
        console.error('Error uploading photos:', photosError)
        // Don't fail the whole operation, just log the error
      }
    }

    return NextResponse.json({ 
      success: true,
      id: listing.id,
      message: 'Listing created successfully' 
    })

  } catch (error: any) {
    console.error('Error in create listing API:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
