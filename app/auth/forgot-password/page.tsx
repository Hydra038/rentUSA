/**
 * Forgot Password Page
 * Password reset request
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
    }, 1500)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-600 mb-8">
            We've sent password reset instructions to <strong>{email}</strong>
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center text-primary-600 hover:text-primary-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-gray-600">
            Enter your email and we'll send you instructions to reset your password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </button>

          <div className="text-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign In
            </Link>
          </div>
        </form>

        {/* Note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This is a demo feature. In production, this would send an email with a password reset link.
          </p>
        </div>
      </div>
    </div>
  )
}
