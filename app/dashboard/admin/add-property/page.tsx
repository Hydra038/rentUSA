/**
 * Admin Add Property Page
 * Create new property listings with image uploads
 */

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AddPropertyForm from '@/components/admin/AddPropertyForm'

export default async function AddPropertyPage() {
  const session = await getServerSession(authOptions)

  // Check authentication and role
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  // Fetch states and cities for dropdowns
  const [
    { data: states },
    { data: cities }
  ] = await Promise.all([
    supabaseAdmin.from('State').select('*').order('name'),
    supabaseAdmin.from('City').select('*, state:State(name, code)').order('name')
  ])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/admin/listings"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
          <p className="mt-2 text-gray-600">
            Create a new rental property listing
          </p>
        </div>

        {/* Form */}
        <AddPropertyForm 
          states={states || []} 
          cities={cities || []}
          userId={session.user.id}
        />
      </div>
    </div>
  )
}
