/**
 * Pricing for Landlords Page
 */

import Link from 'next/link'
import { Check, Star, TrendingUp, Zap } from 'lucide-react'

export const metadata = {
  title: 'Pricing for Landlords',
  description: 'Find the perfect plan for your rental property listings on RentUSA.'
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">
            Landlord Pricing Plans
          </h1>
          <p className="text-xl text-primary-100 text-center max-w-3xl mx-auto">
            Choose the perfect plan to showcase your rental properties and reach thousands of qualified renters
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                $0
                <span className="text-lg text-gray-500 font-normal">/month</span>
              </div>
              <p className="text-gray-600">Perfect for individual landlords</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Up to 3 active listings</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Basic property details</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Up to 5 photos per listing</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Standard search visibility</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Inquiry management</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Email notifications</span>
              </li>
            </ul>

            <Link
              href="/auth/signin"
              className="block w-full text-center bg-gray-100 text-gray-900 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Get Started Free
            </Link>
          </div>

          {/* Professional Plan */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-primary-500 p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <Star className="h-4 w-4" /> Most Popular
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
              <div className="text-4xl font-bold text-primary-600 mb-1">
                $49
                <span className="text-lg text-gray-500 font-normal">/month</span>
              </div>
              <p className="text-gray-600">For property managers</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Unlimited active listings</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Enhanced property details</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Up to 20 photos per listing</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700"><strong>Priority search placement</strong></span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700"><strong>Featured listing badge</strong></span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Advanced analytics</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Tenant screening tools</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Priority customer support</span>
              </li>
            </ul>

            <Link
              href="/auth/signin"
              className="block w-full text-center bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              Start Free Trial
            </Link>
            <p className="text-sm text-gray-500 text-center mt-3">14-day free trial, cancel anytime</p>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                Custom
              </div>
              <p className="text-gray-600">For large portfolios</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Everything in Professional</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Unlimited photos & videos</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700"><strong>Top search placement</strong></span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Multi-user accounts</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">API access</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Custom branding</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Dedicated account manager</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">24/7 phone support</span>
              </li>
            </ul>

            <Link
              href="/contact"
              className="block w-full text-center bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              Contact Sales
            </Link>
          </div>
        </div>

        {/* Add-ons */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Add-on Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <Zap className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Featured Listing
              </h3>
              <p className="text-gray-600 mb-4">
                Boost a single listing to the top of search results for 30 days
              </p>
              <div className="text-2xl font-bold text-gray-900">$29<span className="text-sm text-gray-500 font-normal">/listing</span></div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <TrendingUp className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Promoted Listing
              </h3>
              <p className="text-gray-600 mb-4">
                Appear in homepage featured section for maximum visibility
              </p>
              <div className="text-2xl font-bold text-gray-900">$49<span className="text-sm text-gray-500 font-normal">/listing</span></div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <Star className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Professional Photos
              </h3>
              <p className="text-gray-600 mb-4">
                Get your property photographed by a local professional
              </p>
              <div className="text-2xl font-bold text-gray-900">$199<span className="text-sm text-gray-500 font-normal">/property</span></div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'Can I upgrade or downgrade my plan?',
                a: 'Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the end of your current billing cycle.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards (Visa, Mastercard, American Express) and ACH bank transfers for Enterprise plans.'
              },
              {
                q: 'Is there a setup fee?',
                a: 'No setup fees! All plans include free onboarding and setup assistance.'
              },
              {
                q: 'What happens if I exceed my listing limit?',
                a: 'For Basic plans, you\'ll need to upgrade to Professional to add more listings. Professional and Enterprise plans have no listing limits.'
              },
              {
                q: 'Do you offer discounts for annual payments?',
                a: 'Yes! Pay annually and save 20% on Professional and Enterprise plans.'
              },
              {
                q: 'What is your refund policy?',
                a: 'We offer a 30-day money-back guarantee on all paid plans. No questions asked.'
              }
            ].map((faq, index) => (
              <details key={index} className="bg-white rounded-lg shadow-sm p-6 group">
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <span className="ml-4 text-primary-600 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-lg p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of landlords who trust RentUSA to fill their vacancies faster
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary-700 text-white rounded-lg hover:bg-primary-900 transition-colors font-semibold border-2 border-white"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
