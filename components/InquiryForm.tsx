/**
 * Inquiry Form Component
 * Contact form for sending messages about listings
 */

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface InquiryFormProps {
  listingId: string
  listedBy: {
    name: string | null
  }
}

export default function InquiryForm({ listingId, listedBy }: InquiryFormProps) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setSuccess(true)
      setFormData({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        phone: '',
        message: '',
      })

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (err: any) {
      console.error('Inquiry submission error:', err)
      setError(err.message || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-8">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Contact Property</h2>
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-green-800">Message Sent Successfully!</h3>
              <p className="mt-1 text-sm text-green-700">
                The property owner will contact you soon at the email address you provided.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-red-800">Error Sending Message</h3>
              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
            placeholder="Your name"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
            placeholder="your@email.com"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
            placeholder="(555) 123-4567"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
            placeholder="I'm interested in this property..."
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Sending Message...</span>
            </span>
          ) : success ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Message Sent!</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Send Message</span>
            </span>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          🔒 Your contact information will be shared with the property owner
        </p>
      </form>

      {/* Listed By */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Listed By</h3>
        <p className="text-gray-900 font-medium text-sm sm:text-base">
          {listedBy.name || 'Property Manager'}
        </p>
      </div>
    </div>
  )
}
