/**
 * API Route: Update or Delete Listing (Admin)
 * PATCH /api/admin/listings/[id] - Update listing
 * DELETE /api/admin/listings/[id] - Delete listing
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { getCoordinates } from '@/lib/geocoding'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const { id } = params
    const { existingPhotoIds, newImages, ...updateData } = body

    // If address, city, or state changed, geocode the new location
    if (updateData.address || updateData.cityId || updateData.stateId) {
      // Fetch the current listing to get missing fields
      const { data: currentListing } = await supabaseAdmin
        .from('Listing')
        .select('address, cityId, stateId, zip, city:City(name), state:State(name)')
        .eq('id', id)
        .single()

      if (currentListing) {
        const address = updateData.address || currentListing.address
        const cityId = updateData.cityId || currentListing.cityId
        const stateId = updateData.stateId || currentListing.stateId
        const zip = updateData.zip || currentListing.zip

        // Get city and state names
        const { data: cityData } = await supabaseAdmin
          .from('City')
          .select('name, state:State(name)')
          .eq('id', cityId)
          .single()

        if (cityData) {
          try {
            const coords = await getCoordinates(
              address,
              cityData.name,
              (cityData.state as any).name,
              zip
            )
            updateData.latitude = coords.latitude
            updateData.longitude = coords.longitude
          } catch (error) {
            console.error('Geocoding error during update:', error)
          }
        }
      }
    }

    // Update the listing
    const { data, error } = await supabaseAdmin
      .from('Listing')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating listing:', error)
      return NextResponse.json(
        { error: 'Failed to update listing' },
        { status: 500 }
      )
    }

    // Handle photo updates if provided
    if (existingPhotoIds !== undefined) {
      // Get current photos
      const { data: currentPhotos } = await supabaseAdmin
        .from('Photo')
        .select('id')
        .eq('listingId', id)

      if (currentPhotos) {
        // Delete photos that are no longer in existingPhotoIds
        const photosToDelete = currentPhotos
          .filter(p => !existingPhotoIds.includes(p.id))
          .map(p => p.id)

        if (photosToDelete.length > 0) {
          await supabaseAdmin
            .from('Photo')
            .delete()
            .in('id', photosToDelete)
        }
      }
    }

    // Add new images if provided
    if (newImages && newImages.length > 0) {
      const { data: existingPhotos } = await supabaseAdmin
        .from('Photo')
        .select('*')
        .eq('listingId', id)

      const maxOrder = existingPhotos?.length || 0
      const isPrimaryNeeded = !existingPhotos || existingPhotos.length === 0

      const photoInserts = newImages.map((url: string, index: number) => ({
        listingId: id,
        url,
        publicId: `listing-${id}-${Date.now()}-${index}`,
        isPrimary: isPrimaryNeeded && index === 0,
        order: maxOrder + index,
      }))

      await supabaseAdmin
        .from('Photo')
        .insert(photoInserts)
    }

    return NextResponse.json({ 
      success: true,
      data,
      message: 'Listing updated successfully' 
    })

  } catch (error: any) {
    console.error('Error in update listing API:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    // Delete photos first (due to foreign key constraint)
    await supabaseAdmin
      .from('Photo')
      .delete()
      .eq('listingId', id)

    // Delete the listing
    const { error } = await supabaseAdmin
      .from('Listing')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting listing:', error)
      return NextResponse.json(
        { error: 'Failed to delete listing' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Listing deleted successfully' 
    })

  } catch (error: any) {
    console.error('Error in delete listing API:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
