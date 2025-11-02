/**
 * Admin Dashboard
 * Professional overview of all listings, users, and system stats
 */

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { 
  Home, 
  Users, 
  FileText, 
  TrendingUp, 
  MapPin, 
  Building, 
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Settings,
  Mail,
  MessageSquare,
  Menu,
  X
} from 'lucide-react'

import AdminSidebar from '@/components/admin/AdminSidebar'

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
    { count: pendingListings },
    { count: totalUsers },
    { count: adminUsers },
    { count: landlordUsers },
    { count: renterUsers },
    { count: totalStates },
    { count: totalCities },
    { count: totalInquiries },
    { count: pendingInquiries },
    { data: recentListings },
    { data: allListings },
    { data: recentInquiries }
  ] = await Promise.all([
    supabaseAdmin.from('Listing').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('Listing').select('*', { count: 'exact', head: true }).eq('published', true),
    supabaseAdmin.from('Listing').select('*', { count: 'exact', head: true }).eq('published', false),
    supabaseAdmin.from('User').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('User').select('*', { count: 'exact', head: true }).eq('role', 'ADMIN'),
    supabaseAdmin.from('User').select('*', { count: 'exact', head: true }).eq('role', 'LANDLORD'),
    supabaseAdmin.from('User').select('*', { count: 'exact', head: true }).eq('role', 'RENTER'),
    supabaseAdmin.from('State').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('City').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('Inquiry').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('Inquiry').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
    supabaseAdmin
      .from('Listing')
      .select(`
        id,
        title,
        price,
        createdAt,
        published,
        bedrooms,
        bathrooms,
        city:City(name),
        state:State(name, code)
      `)
      .order('createdAt', { ascending: false })
      .limit(8),
    supabaseAdmin
      .from('Listing')
      .select('price'),
    supabaseAdmin
      .from('Inquiry')
      .select(`
        id,
        name,
        email,
        phone,
        message,
        status,
        createdAt,
        listing:Listing(id, title, address)
      `)
      .order('createdAt', { ascending: false })
      .limit(10)
  ])

  // Calculate average rent
  const avgRent = allListings && allListings.length > 0
    ? Math.round(allListings.reduce((sum: number, listing: any) => sum + Number(listing.price), 0) / allListings.length)
    : 0

  const stats = [
    {
      name: 'Total Listings',
      value: totalListings || 0,
      icon: Home,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'increase'
    },
    {
      name: 'Published',
      value: publishedListings || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      changeType: 'increase'
    },
    {
      name: 'Pending Review',
      value: pendingListings || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: `${pendingListings || 0} awaiting`,
      changeType: 'neutral'
    },
    {
      name: 'Total Inquiries',
      value: totalInquiries || 0,
      icon: MessageSquare,
      color: 'bg-cyan-500',
      textColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      change: `${pendingInquiries || 0} pending`,
      changeType: 'neutral'
    },
    {
      name: 'Total Users',
      value: totalUsers || 0,
      icon: Users,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+23%',
      changeType: 'increase'
    },
    {
      name: 'Average Rent',
      value: `$${avgRent.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      change: '/month',
      changeType: 'neutral'
    },
    {
      name: 'States Covered',
      value: totalStates || 0,
      icon: MapPin,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: `${totalCities || 0} cities`,
      changeType: 'neutral'
    }
  ]

  const userStats = [
    { label: 'Admins', value: adminUsers || 0, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Landlords', value: landlordUsers || 0, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Renters', value: renterUsers || 0, color: 'text-green-600', bg: 'bg-green-100' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Side Navigation */}
      <AdminSidebar 
        userName={session.user?.name}
        userEmail={session.user?.email}
        pendingInquiries={pendingInquiries || undefined}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="ml-12 lg:ml-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Dashboard Overview
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-gray-600">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs sm:text-sm font-medium shadow-sm"
                >
                  <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  View Site
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </p>
                  <p className={`text-xs font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 
                    stat.changeType === 'decrease' ? 'text-red-600' : 
                    'text-gray-500'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* User Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-600" />
            User Distribution
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {userStats.map((stat) => (
              <div key={stat.label} className="text-center p-3 sm:p-4 rounded-lg bg-gray-50">
                <p className={`text-xl sm:text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Listings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 sm:mb-8">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
              Recent Listings
            </h2>
            <Link
              href="/dashboard/admin/listings"
              className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentListings && recentListings.length > 0 ? (
                  recentListings.map((listing: any) => (
                    <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {listing.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{listing.city.name}</div>
                        <div className="text-xs text-gray-500">{listing.state.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {listing.bedrooms} bed · {listing.bathrooms} bath
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ${Number(listing.price).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">/month</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            listing.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {listing.published ? '✓ Published' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(listing.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/listing/${listing.id}`}
                          className="text-primary-600 hover:text-primary-900 font-medium"
                        >
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center"
                    >
                      <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-sm font-medium text-gray-900 mb-1">No listings found</p>
                      <p className="text-sm text-gray-500">Get started by creating your first property listing</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 sm:mb-8">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-cyan-600" />
              Recent Inquiries
            </h2>
            <Link
              href="/dashboard/admin/inquiries"
              className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentInquiries && recentInquiries.length > 0 ? (
                  recentInquiries.map((inquiry: any) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                        <div className="text-xs text-gray-500">{inquiry.email}</div>
                        {inquiry.phone && (
                          <div className="text-xs text-gray-500">{inquiry.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {inquiry.listing?.title || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500 max-w-xs truncate">
                          {inquiry.listing?.address || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-md truncate">
                          {inquiry.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            inquiry.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : inquiry.status === 'RESPONDED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(inquiry.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="text-primary-600 hover:text-primary-900 font-medium"
                        >
                          Reply →
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center"
                    >
                      <Mail className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-sm font-medium text-gray-900 mb-1">No inquiries yet</p>
                      <p className="text-sm text-gray-500">Inquiries from potential renters will appear here</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
