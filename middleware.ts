/**
 * Middleware
 * Protect API routes and dashboard pages based on user roles
 */

import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin-only routes
    if (path.startsWith('/dashboard/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/renter', req.url))
    }

    // Landlord-only routes
    if (path.startsWith('/dashboard/landlord') && token?.role !== 'LANDLORD') {
      return NextResponse.redirect(new URL('/dashboard/renter', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

// Protect these routes
export const config = {
  matcher: ['/dashboard/:path*', '/api/listings/:path*'],
}
