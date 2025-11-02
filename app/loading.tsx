/**
 * Loading Page
 * Shows while pages are loading
 */

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Spinner */}
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-solid border-primary-600 border-r-transparent mb-4"></div>
        
        {/* Loading Text */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Loading...
        </h2>
        <p className="text-gray-600">
          Please wait while we fetch your data
        </p>
      </div>
    </div>
  )
}
