/**
 * Renter Dashboard
 * View saved listings and inquiries
 */

import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Heart, MessageSquare } from 'lucide-react'

export default async function RenterDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'RENTER') {
    redirect('/auth/signin')
  }

  // Fetch user's saved listings
  let savedListings: any[] = []
  let inquiries: any[] = []

  try {
    ;[savedListings, inquiries] = await Promise.all([
      prisma.savedListing.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          listing: {
            include: {
              city: true,
              state: true,
              photos: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.inquiry.findMany({
        where: {
          email: session.user.email!,
        },
        include: {
          listing: {
            select: {
              title: true,
              id: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ])
  } catch (error) {
    console.error('Dashboard error:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Renter Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {session.user.name || session.user.email}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Saved Listings</div>
            <div className="text-3xl font-bold text-gray-900">{savedListings.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Inquiries Sent</div>
            <div className="text-3xl font-bold text-gray-900">{inquiries.length}</div>
          </div>
        </div>

        {/* Saved Listings */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Heart className="h-6 w-6 mr-2 text-red-500" />
            Saved Listings
          </h2>
          <div className="bg-white rounded-lg shadow">
            {savedListings.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No saved listings yet</p>
                <Link
                  href="/search"
                  className="mt-4 inline-block text-primary-600 hover:text-primary-500"
                >
                  Browse listings
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {savedListings.slice(0, 5).map((saved) => (
                  <Link
                    key={saved.id}
                    href={`/listing/${saved.listing.id}`}
                    className="block p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {saved.listing.title}
                        </h3>
                        <p className="text-gray-600">
                          {saved.listing.city.name}, {saved.listing.state.code.toUpperCase()}
                        </p>
                        <p className="text-lg font-bold text-primary-600 mt-2">
                          ${Number(saved.listing.price).toLocaleString()}/mo
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        Saved {new Date(saved.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <MessageSquare className="h-6 w-6 mr-2 text-primary-600" />
            Recent Inquiries
          </h2>
          <div className="bg-white rounded-lg shadow">
            {inquiries.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No inquiries sent yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {inquiry.listing.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {inquiry.message}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 ml-4">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
