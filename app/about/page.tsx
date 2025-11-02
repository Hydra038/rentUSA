/**
 * About Us Page
 */

import Link from 'next/link'
import { MapPin, Users, Home, Shield, Star, TrendingUp } from 'lucide-react'

export const metadata = {
  title: 'About Us',
  description: 'Learn about RentUSA - your trusted partner in finding the perfect rental home across all 50 states.'
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            About RentUSA
          </h1>
          <p className="text-xl sm:text-2xl text-primary-100 max-w-3xl">
            Connecting renters with their perfect home across all 50 states and the District of Columbia
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-4">
            At RentUSA, we believe finding the perfect rental home should be simple, transparent, and accessible to everyone. Our mission is to revolutionize the rental search experience by providing a comprehensive, user-friendly platform that connects renters with quality properties nationwide.
          </p>
          <p className="text-lg text-gray-700">
            Whether you're looking for a cozy apartment in the city, a spacious house in the suburbs, or a beachfront condo, RentUSA makes it easy to find your next home.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <MapPin className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <div className="text-4xl font-bold text-gray-900 mb-2">50+</div>
            <div className="text-gray-600">States & DC Covered</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Home className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <div className="text-4xl font-bold text-gray-900 mb-2">1000+</div>
            <div className="text-gray-600">Active Listings</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <div className="text-4xl font-bold text-gray-900 mb-2">10K+</div>
            <div className="text-gray-600">Happy Renters</div>
          </div>
        </div>

        {/* Values */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Shield className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust & Safety</h3>
              <p className="text-gray-600">
                We verify all listings and landlords to ensure a safe, secure rental experience for everyone.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Star className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality First</h3>
              <p className="text-gray-600">
                Every property on our platform meets our quality standards, ensuring you get what you see.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <TrendingUp className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously improve our platform with the latest technology to enhance your search experience.
              </p>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8 sm:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              RentUSA was founded in 2024 with a simple yet powerful vision: to make rental housing accessible to everyone, everywhere in America. Our founders, having experienced the frustration of searching for rentals across multiple platforms and dealing with outdated listings, decided to create a better solution.
            </p>
            <p>
              Today, RentUSA serves renters and landlords across all 50 states and the District of Columbia. Our platform features real-time listings, interactive maps, detailed property information, and direct communication tools that make the rental process seamless.
            </p>
            <p>
              We're proud to be a trusted partner for thousands of renters and landlords, helping them connect and build communities across America.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-lg p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Home?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Start your search today and discover thousands of rental properties across America
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Search Rentals
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary-700 text-white rounded-lg hover:bg-primary-900 transition-colors font-semibold border-2 border-white"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
