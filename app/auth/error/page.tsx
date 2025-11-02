/**
 * Authentication Error Page
 * Displays NextAuth errors in a user-friendly way
 */

'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: { [key: string]: string } = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'The verification link may have expired or already been used.',
    Default: 'An error occurred during authentication.',
    CredentialsSignin: 'Invalid email or password. Please try again.',
  }

  const errorMessage = error && errorMessages[error] 
    ? errorMessages[error] 
    : errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {errorMessage}
          </p>
          {error && (
            <p className="mt-1 text-xs text-gray-500">
              Error code: {error}
            </p>
          )}
        </div>
        
        <div className="mt-8 space-y-4">
          <Link
            href="/auth/signin"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            Try signing in again
          </Link>
          <Link
            href="/"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  )
}
