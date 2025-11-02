/**
 * Register API Route
 * Handles new user registration
 */

import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'
import { randomBytes } from 'crypto'

// Generate a CUID-like ID (compatible with Prisma's cuid())
function generateCuid() {
  const timestamp = Date.now().toString(36)
  const randomPart = randomBytes(12).toString('base64').replace(/[+/=]/g, '').substring(0, 16)
  return `c${timestamp}${randomPart}`
}

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['RENTER', 'LANDLORD', 'ADMIN']).default('RENTER'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, role } = registerSchema.parse(body)

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('User')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Generate CUID for user ID
    const userId = generateCuid()

    // Create user
    const { data: user, error } = await supabaseAdmin
      .from('User')
      .insert({
        id: userId,
        name,
        email,
        hashedPassword: hashedPassword,
        role,
      })
      .select('id, name, email, role, createdAt')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'User created successfully',
        user,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
