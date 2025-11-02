/**
 * Navbar Component - Apartments.com Style
 * Main navigation bar with authentication and role-based menu
 */

'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import Logo from './Logo'

export default function Navbar() {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3" />
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">RentUSA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {status === 'authenticated' ? (
              <>
                {/* Role-based dashboard links */}
                {session?.user?.role === 'ADMIN' && (
                  <Link
                    href="/dashboard/admin"
                    className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {session?.user?.role === 'LANDLORD' && (
                  <Link
                    href="/dashboard/landlord"
                    className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm"
                  >
                    List Your Property
                  </Link>
                )}
                {session?.user?.role === 'RENTER' && (
                  <Link
                    href="/dashboard/renter"
                    className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm"
                  >
                    My Favorites
                  </Link>
                )}
                
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium transition-colors text-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-6 space-y-4">
            {status === 'authenticated' ? (
              <>
                {session?.user?.role === 'ADMIN' && (
                  <Link
                    href="/dashboard/admin"
                    className="block text-gray-700 hover:text-primary-600 font-medium py-2 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                {session?.user?.role === 'LANDLORD' && (
                  <Link
                    href="/dashboard/landlord"
                    className="block text-gray-700 hover:text-primary-600 font-medium py-2 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    List Your Property
                  </Link>
                )}
                {session?.user?.role === 'RENTER' && (
                  <Link
                    href="/dashboard/renter"
                    className="block text-gray-700 hover:text-primary-600 font-medium py-2 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Favorites
                  </Link>
                )}
                
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/' })
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left text-gray-700 hover:text-primary-600 font-medium py-2 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="block bg-primary-600 text-white text-center px-4 py-3 rounded-lg hover:bg-primary-700 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
