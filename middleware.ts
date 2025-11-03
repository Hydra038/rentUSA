/**
 * Middleware
 * Protect API routes and dashboard pages based on user roles
 * Redirect authenticated users away from auth pages
 */

import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const path = req.nextUrl.pathname

  // Redirect authenticated users away from sign-in/sign-up pages
  if (token && (path.startsWith('/auth/signin') || path.startsWith('/auth/signup'))) {
    // Redirect based on role
    if (token.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/admin', req.url))
    } else if (token.role === 'LANDLORD') {
      return NextResponse.redirect(new URL('/dashboard/landlord', req.url))
    } else {
      return NextResponse.redirect(new URL('/dashboard/renter', req.url))
    }
  }

  // Protect dashboard routes - require authentication
  if (path.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // Admin-only routes
    if (path.startsWith('/dashboard/admin') && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/renter', req.url))
    }

    // Landlord-only routes
    if (path.startsWith('/dashboard/landlord') && token.role !== 'LANDLORD') {
      return NextResponse.redirect(new URL('/dashboard/renter', req.url))
    }
  }

  // Protect API routes - require authentication
  if (path.startsWith('/api/listings') && !path.includes('/api/listings?')) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

// Apply middleware to these routes
export const config = {
  matcher: ['/dashboard/:path*', '/api/listings/:path*', '/auth/signin', '/auth/signup'],
}
