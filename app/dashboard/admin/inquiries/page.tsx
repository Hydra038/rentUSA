/**
 * Admin Inquiries Management Page
 * View and manage all property inquiries
 */

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { 
  MessageSquare,
  Home,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function InquiriesPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  // Fetch all inquiries
  const { data: inquiries } = await supabaseAdmin
    .from('Inquiry')
    .select(`
      id,
      name,
      email,
      phone,
      message,
      status,
      createdAt,
      listing:Listing(
        id,
        title,
        address,
        price,
        city:City(name),
        state:State(name, code)
      )
    `)
    .order('createdAt', { ascending: false })

  const stats = {
    total: inquiries?.length || 0,
    pending: inquiries?.filter(i => i.status === 'PENDING').length || 0,
    responded: inquiries?.filter(i => i.status === 'RESPONDED').length || 0,
    archived: inquiries?.filter(i => i.status === 'ARCHIVED').length || 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Side Navigation */}
      <AdminSidebar 
        userName={session.user?.name}
        userEmail={session.user?.email}
        pendingInquiries={stats.pending}
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
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Inquiries</h1>
                  <p className="mt-1 text-xs sm:text-sm text-gray-600">
                    Manage all property inquiries and messages
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Inquiries</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Responded</p>
              <p className="text-3xl font-bold text-gray-900">{stats.responded}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-gray-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Archived</p>
              <p className="text-3xl font-bold text-gray-900">{stats.archived}</p>
            </div>
          </div>

          {/* Inquiries Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Inquiries</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact Info
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
                  {inquiries && inquiries.length > 0 ? (
                    inquiries.map((inquiry: any) => (
                      <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2">
                            <div>
                              <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                {inquiry.name}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <Mail className="h-3 w-3" />
                                {inquiry.email}
                              </div>
                              {inquiry.phone && (
                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                  <Phone className="h-3 w-3" />
                                  {inquiry.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {inquiry.listing?.title || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {inquiry.listing?.city?.name}, {inquiry.listing?.state?.code}
                          </div>
                          {inquiry.listing?.price && (
                            <div className="text-xs font-semibold text-gray-700 mt-1">
                              ${Number(inquiry.listing.price).toLocaleString()}/mo
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-md line-clamp-2">
                            {inquiry.message}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              inquiry.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : inquiry.status === 'RESPONDED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {inquiry.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            {new Date(inquiry.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(inquiry.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {inquiry.listing?.id && (
                              <Link
                                href={`/listing/${inquiry.listing.id}`}
                                className="text-primary-600 hover:text-primary-900 text-xs font-medium"
                              >
                                View Property
                              </Link>
                            )}
                            <a
                              href={`mailto:${inquiry.email}`}
                              className="inline-flex items-center px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-xs font-medium"
                            >
                              <Mail className="h-3 w-3 mr-1" />
                              Reply
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-sm font-medium text-gray-900 mb-1">No inquiries yet</p>
                        <p className="text-sm text-gray-500">
                          Property inquiries will appear here when users contact you
                        </p>
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
