/**
 * Admin Analytics Page
 * Detailed analytics and reports for the platform
 */

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { 
  BarChart3,
  TrendingUp,
  Users,
  Home,
  DollarSign,
  MapPin,
  Calendar,
  ArrowLeft,
  MessageSquare
} from 'lucide-react'

import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  // Fetch detailed analytics data
  const [
    { data: allListings },
    { data: allInquiries },
    { data: monthlyListings },
    { data: stateStats }
  ] = await Promise.all([
    supabaseAdmin
      .from('Listing')
      .select('id, price, createdAt, published, bedrooms, bathrooms'),
    supabaseAdmin
      .from('Inquiry')
      .select('id, createdAt, status'),
    supabaseAdmin
      .from('Listing')
      .select('id, createdAt')
      .gte('createdAt', new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString()),
    supabaseAdmin
      .from('Listing')
      .select('id, state:State(name, code)')
  ])

  // Calculate statistics
  const totalRevenue = allListings?.reduce((sum, listing) => sum + Number(listing.price), 0) || 0
  const avgPrice = allListings && allListings.length > 0 
    ? Math.round(totalRevenue / allListings.length) 
    : 0
  const publishedCount = allListings?.filter(l => l.published).length || 0
  const pendingCount = allListings?.filter(l => !l.published).length || 0

  // Group by state
  const stateGroups = stateStats?.reduce((acc: Record<string, number>, listing: any) => {
    const stateName = listing.state?.name || 'Unknown'
    acc[stateName] = (acc[stateName] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topStates = Object.entries(stateGroups || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5) as [string, number][]

  // Monthly growth
  const monthlyData = monthlyListings?.reduce((acc: Record<string, number>, listing) => {
    const month = new Date(listing.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const months = Object.keys(monthlyData || {}).slice(-6)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Side Navigation */}
      <AdminSidebar 
        userName={session.user?.name}
        userEmail={session.user?.email}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard/admin"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div className="ml-12 lg:ml-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h1>
                  <p className="mt-1 text-xs sm:text-sm text-gray-600">
                    Platform insights and performance metrics
                  </p>
                </div>
              </div>
              <Link
                href="/"
                className="inline-flex items-center px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs sm:text-sm font-medium"
              >
                <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                View Site
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Home className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Listings</p>
              <p className="text-3xl font-bold text-gray-900">{allListings?.length || 0}</p>
              <div className="mt-2 flex items-center gap-1 text-xs">
                <span className="text-green-600 font-medium">+{publishedCount} published</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Average Rent</p>
              <p className="text-3xl font-bold text-gray-900">${avgPrice.toLocaleString()}</p>
              <div className="mt-2 text-xs text-gray-500">per month</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Inquiries</p>
              <p className="text-3xl font-bold text-gray-900">{allInquiries?.length || 0}</p>
              <div className="mt-2 text-xs text-gray-500">from potential renters</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Top State</p>
              <p className="text-3xl font-bold text-gray-900">
                {topStates[0]?.[1] ?? 0}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                {topStates[0]?.[0] ?? 'N/A'}
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Growth */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Monthly Listings Growth (Last 6 Months)
              </h2>
              <div className="space-y-4">
                {months.map((month) => {
                  const count = monthlyData?.[month] || 0
                  const maxCount = monthlyData ? Math.max(...Object.values(monthlyData)) : 0
                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0
                  return (
                    <div key={month}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{month}</span>
                        <span className="text-sm font-bold text-gray-900">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary-600 h-2.5 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Top States */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                Top 5 States by Listings
              </h2>
              <div className="space-y-4">
                {topStates.map(([state, count]: any, index) => {
                  const maxCount = topStates[0]?.[1] || 1
                  const percentage = (count / maxCount) * 100
                  return (
                    <div key={state}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
                          <span className="text-sm font-medium text-gray-700">{state}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-orange-500 h-2.5 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Listing Status Distribution
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {allListings?.length || 0}
                </div>
                <div className="text-sm font-medium text-gray-600 mb-1">Total Listings</div>
                <div className="text-xs text-gray-500">All properties</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {publishedCount}
                </div>
                <div className="text-sm font-medium text-gray-600 mb-1">Published</div>
                <div className="text-xs text-gray-500">
                  {allListings?.length ? Math.round((publishedCount / allListings.length) * 100) : 0}% of total
                </div>
              </div>
              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {pendingCount}
                </div>
                <div className="text-sm font-medium text-gray-600 mb-1">Pending Review</div>
                <div className="text-xs text-gray-500">
                  {allListings?.length ? Math.round((pendingCount / allListings.length) * 100) : 0}% of total
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
