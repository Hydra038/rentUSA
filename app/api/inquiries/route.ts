/**
 * Inquiry API
 * Handles message submissions from listing contact forms
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { inquirySchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()

    console.log('📧 Inquiry submission:', { listingId: body.listingId, email: body.email })

    // Validate input
    const validatedData = inquirySchema.parse(body)

    // Check if listing exists
    const { data: listing, error: listingError } = await supabaseAdmin
      .from('Listing')
      .select('id, title')
      .eq('id', validatedData.listingId)
      .single()

    if (listingError || !listing) {
      console.error('❌ Listing not found:', listingError)
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Create inquiry
    const { data: inquiry, error: inquiryError } = await supabaseAdmin
      .from('Inquiry')
      .insert({
        listingId: validatedData.listingId,
        userId: session?.user?.id || null,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        message: validatedData.message,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (inquiryError) {
      console.error('❌ Inquiry creation error:', inquiryError)
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      )
    }

    console.log('✅ Inquiry created:', inquiry.id)

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully!',
        inquiry,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('❌ Inquiry API error:', error)

    // Handle validation errors
    if (error.errors) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get all inquiries (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const listingId = searchParams.get('listingId')

    let query = supabaseAdmin
      .from('Inquiry')
      .select(`
        *,
        listing:Listing(id, title, address, price),
        user:User(id, name, email)
      `)
      .order('createdAt', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (listingId) {
      query = query.eq('listingId', listingId)
    }

    const { data: inquiries, error } = await query

    if (error) {
      console.error('Inquiries fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch inquiries' },
        { status: 500 }
      )
    }

    return NextResponse.json({ inquiries }, { status: 200 })
  } catch (error: any) {
    console.error('Inquiries GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
