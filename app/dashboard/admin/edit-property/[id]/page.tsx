/**
 * Admin Edit Property Page
 * Edit existing property listings
 */

import { redirect, notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import EditPropertyForm from '@/components/admin/EditPropertyForm'

interface Props {
  params: {
    id: string
  }
}

export default async function EditPropertyPage({ params }: Props) {
  const session = await getServerSession(authOptions)

  // Check authentication and role
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  // Fetch the listing to edit
  const { data: listing, error } = await supabaseAdmin
    .from('Listing')
    .select(`
      *,
      city:City(*),
      state:State(*),
      photos:Photo(*)
    `)
    .eq('id', params.id)
    .single()

  if (error || !listing) {
    notFound()
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
          <p className="mt-2 text-gray-600">
            Update property listing details
          </p>
        </div>

        {/* Form */}
        <EditPropertyForm 
          listing={listing}
          states={states || []} 
          cities={cities || []}
        />
      </div>
    </div>
  )
}
