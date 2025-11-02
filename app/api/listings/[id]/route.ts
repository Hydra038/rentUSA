/**
 * Single Listing API Routes
 * GET: Fetch listing details | PUT: Update listing | DELETE: Delete listing
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateListingSchema } from '@/lib/validations'

// GET /api/listings/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        city: true,
        state: true,
        photos: { orderBy: { order: 'asc' } },
        listedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    return NextResponse.json(listing)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 })
  }
}

// PUT /api/listings/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
    })

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // Check ownership
    if (listing.listedByUserId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const data = updateListingSchema.parse(body)

    const updated = await prisma.listing.update({
      where: { id: params.id },
      data,
      include: {
        city: true,
        state: true,
        photos: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 })
  }
}

// DELETE /api/listings/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
    })

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // Check ownership
    if (listing.listedByUserId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.listing.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 })
  }
}
