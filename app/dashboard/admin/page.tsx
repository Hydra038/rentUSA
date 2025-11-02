/**
 * Admin Dashboard
 * Overview of all listings, users, and system stats
 */

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { Home, Users, FileText, TrendingUp, MapPin, Building } from 'lucide-react'

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  // Check authentication and role
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  // Fetch statistics
  const [
    { count: totalListings },
    { count: publishedListings },
    { count: totalUsers },
    { count: totalStates },
    { count: totalCities },
    { data: recentListings }
  ] = await Promise.all([
    supabaseAdmin.from('Listing').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('Listing').select('*', { count: 'exact', head: true }).eq('published', true),
    supabaseAdmin.from('User').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('State').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('City').select('*', { count: 'exact', head: true }),
    supabaseAdmin
      .from('Listing')
      .select(`
        id,
        title,
        price,
        createdAt,
        published,
        city:City(name),
        state:State(name)
      `)
      .order('createdAt', { ascending: false })
      .limit(10)
  ])

  const stats = [
    {
      name: 'Total Listings',
      value: totalListings || 0,
      icon: Home,
      color: 'bg-blue-500'
    },
    {
      name: 'Published Listings',
      value: publishedListings || 0,
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      name: 'Total Users',
      value: totalUsers || 0,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      name: 'States Covered',
      value: totalStates || 0,
      icon: MapPin,
      color: 'bg-orange-500'
    },
    {
      name: 'Cities Listed',
      value: totalCities || 0,
      icon: Building,
      color: 'bg-pink-500'
    },
    {
      name: 'Avg. Monthly Rent',
      value: '$2,500',
      icon: TrendingUp,
      color: 'bg-indigo-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {session.user?.name || 'Admin'}
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              <Home className="h-4 w-4 mr-2" />
              View Site
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Listings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Listings
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
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
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentListings && recentListings.length > 0 ? (
                  recentListings.map((listing: any) => (
                    <tr key={listing.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {listing.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {listing.city.name}, {listing.state.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${listing.price.toLocaleString()}/mo
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            listing.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {listing.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/listing/${listing.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-sm text-gray-500"
                    >
                      No listings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/dashboard/admin/listings"
            className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Manage Listings
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  View and edit all property listings
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/admin/users"
            className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Manage Users
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  View and manage user accounts
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/states"
            className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Browse Listings
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  View all states and listings
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
