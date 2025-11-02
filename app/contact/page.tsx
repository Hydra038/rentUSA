/**
 * Contact Us Page
 */

import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with RentUSA - we\'re here to help with your rental search questions.'
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-primary-100">
            We're here to help. Reach out to us anytime.
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <a href="mailto:support@rentusa.com" className="text-primary-600 hover:underline">
                    support@rentusa.com
                  </a>
                  <p className="text-gray-600 text-sm mt-1">For general inquiries</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-6 w-6 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Landlord Support</h3>
                  <a href="mailto:landlords@rentusa.com" className="text-primary-600 hover:underline">
                    landlords@rentusa.com
                  </a>
                  <p className="text-gray-600 text-sm mt-1">For property listing questions</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-6 w-6 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <a href="tel:1-800-RENTUSA" className="text-primary-600 hover:underline">
                    1-800-RENT-USA
                  </a>
                  <p className="text-gray-600 text-sm mt-1">Monday - Friday, 9am - 6pm EST</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Office</h3>
                  <p className="text-gray-700">
                    RentUSA Headquarters<br />
                    123 Main Street, Suite 500<br />
                    New York, NY 10001
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-6 w-6 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                  <p className="text-gray-700">
                    Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                    Saturday: 10:00 AM - 4:00 PM EST<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="mt-12 p-6 bg-primary-50 rounded-lg border border-primary-200">
              <h3 className="font-semibold text-gray-900 mb-2">Looking for quick answers?</h3>
              <p className="text-gray-600 mb-4">
                Check out our FAQ section for instant answers to common questions.
              </p>
              <a
                href="#faq"
                className="text-primary-600 hover:underline font-medium"
              >
                View FAQ →
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="listing">Listing Question</option>
                  <option value="landlord">Landlord Services</option>
                  <option value="billing">Billing & Pricing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                Send Message
              </button>

              <p className="text-sm text-gray-500 text-center">
                We typically respond within 24 hours during business days
              </p>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'How do I search for rentals?',
                a: 'You can search for rentals by state, city, or use our advanced search filters to narrow down properties by price, bedrooms, amenities, and more.'
              },
              {
                q: 'Is RentUSA free for renters?',
                a: 'Yes! RentUSA is completely free for renters. There are no fees to search, view listings, or contact landlords.'
              },
              {
                q: 'How do I list my property?',
                a: 'Landlords can create a free account and start listing properties immediately. Check our Pricing page for premium features and enhanced visibility options.'
              },
              {
                q: 'Are the listings verified?',
                a: 'We work to verify all listings and landlords on our platform. However, we always recommend conducting your own due diligence before signing any lease.'
              },
              {
                q: 'How do I contact a landlord?',
                a: 'Each listing has a contact form where you can send messages directly to the property owner or manager.'
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
      </div>
    </div>
  )
}
