/**
 * Photos Upload API Route
 * POST: Upload image to Cloudinary
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadImage } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== 'LANDLORD' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { imageData, listingId } = body

    if (!imageData) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 })
    }

    // Upload to Cloudinary
    const { url, publicId } = await uploadImage(imageData, 'rentusa/listings')

    // If listingId provided, create photo record
    if (listingId) {
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: { listedByUserId: true },
      })

      if (!listing || (listing.listedByUserId !== session.user.id && session.user.role !== 'ADMIN')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      // Get current photo count for ordering
      const photoCount = await prisma.photo.count({
        where: { listingId },
      })

      const photo = await prisma.photo.create({
        data: {
          url,
          publicId,
          listingId,
          isPrimary: photoCount === 0, // First photo is primary
          order: photoCount,
        },
      })

      return NextResponse.json(photo, { status: 201 })
    }

    // Return upload result without creating record
    return NextResponse.json({ url, publicId }, { status: 200 })
  } catch (error) {
    console.error('Photo upload error:', error)
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 })
  }
}

// DELETE /api/photos?publicId=xxx
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== 'LANDLORD' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return NextResponse.json({ error: 'publicId is required' }, { status: 400 })
    }

    // Find photo in database
    const photo = await prisma.photo.findFirst({
      where: { publicId },
      include: {
        listing: {
          select: { listedByUserId: true },
        },
      },
    })

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    // Check ownership
    if (photo.listing.listedByUserId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete from Cloudinary
    const cloudinary = await import('@/lib/cloudinary')
    await cloudinary.deleteImage(publicId)

    // Delete from database
    await prisma.photo.delete({
      where: { id: photo.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Photo deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 })
  }
}
