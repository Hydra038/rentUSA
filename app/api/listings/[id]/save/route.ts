/**
 * Save/Unsave Listing API
 * Toggle favorite status for a listing
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { randomBytes } from 'crypto'

// Generate CUID
function generateCuid() {
  const timestamp = Date.now().toString(36)
  const randomPart = randomBytes(12).toString('base64').replace(/[+/=]/g, '').substring(0, 16)
  return `c${timestamp}${randomPart}`
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Please sign in to save listings' },
        { status: 401 }
      )
    }

    const listingId = params.id

    // Check if already saved
    const { data: existing } = await supabaseAdmin
      .from('SavedListing')
      .select('id')
      .eq('userId', session.user.id)
      .eq('listingId', listingId)
      .single()

    if (existing) {
      // Already saved, so unsave it
      const { error } = await supabaseAdmin
        .from('SavedListing')
        .delete()
        .eq('id', existing.id)

      if (error) {
        console.error('Error unsaving listing:', error)
        return NextResponse.json(
          { error: 'Failed to unsave listing' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        saved: false,
        message: 'Removed from favorites'
      })
    } else {
      // Not saved yet, so save it
      const { error } = await supabaseAdmin
        .from('SavedListing')
        .insert({
          id: generateCuid(),
          userId: session.user.id,
          listingId: listingId
        })

      if (error) {
        console.error('Error saving listing:', error)
        return NextResponse.json(
          { error: 'Failed to save listing' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        saved: true,
        message: 'Added to favorites'
      })
    }
  } catch (error) {
    console.error('Save listing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get save status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ saved: false })
    }

    const { data } = await supabaseAdmin
      .from('SavedListing')
      .select('id')
      .eq('userId', session.user.id)
      .eq('listingId', params.id)
      .single()

    return NextResponse.json({ saved: !!data })
  } catch (error) {
    return NextResponse.json({ saved: false })
  }
}
