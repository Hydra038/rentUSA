/**
 * Sign In Page
 * User authentication page with email/password and Google OAuth
 */

'use client'

import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
        console.error('Sign in error:', result.error)
      } else {
        // If there's a callback URL, use it
        if (callbackUrl) {
          router.push(callbackUrl)
        } else {
          // Fetch session to get user role
          const response = await fetch('/api/auth/session')
          const session = await response.json()
          
          // Redirect based on role
          if (session?.user?.role === 'ADMIN') {
            router.push('/dashboard/admin')
          } else if (session?.user?.role === 'LANDLORD') {
            router.push('/dashboard/landlord')
          } else if (session?.user?.role === 'RENTER') {
            router.push('/dashboard/renter')
          } else {
            router.push('/')
          }
        }
        router.refresh()
      }
    } catch (err) {
      console.error('Sign in exception:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Sign in to RentUSA
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Or{' '}
            <Link href="/auth/signup" className="text-primary-600 hover:text-primary-500 font-medium">
              create a new account
            </Link>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 sm:p-4 flex items-start">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-9 sm:pl-10 w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-9 sm:pl-10 pr-9 sm:pr-10 w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex items-center justify-end">
            <Link href="/auth/forgot-password" className="text-xs sm:text-sm text-primary-600 hover:text-primary-500">
              Forgot your password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-200 rounded-md p-3 sm:p-4">
          <p className="text-xs sm:text-sm font-medium text-blue-900 mb-2">🔑 Demo Account:</p>
          <div className="text-xs sm:text-sm text-blue-800 space-y-1">
            <p className="break-all"><strong>Email:</strong> admin@rentusa.com</p>
            <p><strong>Password:</strong> Rentusa@</p>
          </div>
        </div>
      </div>
    </div>
  )
}
