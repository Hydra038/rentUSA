/**
 * Landlord Dashboard
 * Manage listings, view inquiries, and upgrade subscription
 */

import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, MessageSquare } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default async function LandlordDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'LANDLORD') {
    redirect('/auth/signin')
  }

  // Fetch landlord's listings
  const listings = await prisma.listing.findMany({
    where: {
      listedByUserId: session.user.id,
    },
    include: {
      city: true,
      state: true,
      photos: {
        where: { isPrimary: true },
        take: 1,
      },
      _count: {
        select: {
          inquiries: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Fetch recent inquiries
  const inquiries = await prisma.inquiry.findMany({
    where: {
      listing: {
        listedByUserId: session.user.id,
      },
    },
    include: {
      listing: {
        select: { title: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const stats = {
    total: listings.length,
    published: listings.filter(l => l.published).length,
    pending: listings.filter(l => !l.published).length,
    inquiries: inquiries.length,
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Landlord Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {session.user.name || session.user.email}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Listings</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Published</div>
            <div className="text-3xl font-bold text-green-600">{stats.published}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Pending Approval</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">New Inquiries</div>
            <div className="text-3xl font-bold text-primary-600">{stats.inquiries}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
          <Link
            href="/dashboard/landlord/listings/new"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Listing
          </Link>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No listings yet. Create your first one!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inquiries
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {listings.map((listing) => (
                    <tr key={listing.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{listing.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {listing.city.name}, {listing.state.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(Number(listing.price))}/mo
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            listing.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {listing.published ? 'Published' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {listing._count.inquiries}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/listing/${listing.id}`}
                            className="text-primary-600 hover:text-primary-900"
                            title="View"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                          <Link
                            href={`/dashboard/landlord/listings/${listing.id}/edit`}
                            className="text-gray-600 hover:text-gray-900"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Inquiries</h2>
          <div className="bg-white rounded-lg shadow">
            {inquiries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No inquiries yet</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {inquiries.map((inquiry) => (
                  <li key={inquiry.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
                          <h3 className="text-sm font-medium text-gray-900">
                            {inquiry.name} - {inquiry.listing.title}
                          </h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{inquiry.email}</p>
                        <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                          {inquiry.message}
                        </p>
                      </div>
                      <span className="ml-4 text-xs text-gray-500">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
