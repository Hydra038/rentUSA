/**
 * Footer Component
 * Site footer with links and legal information
 */

import Link from 'next/link'
import { Home, Mail, Phone, Facebook, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Home className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-bold text-white">RentUSA</span>
            </div>
            <p className="text-sm text-gray-400">
              Find your perfect rental home across all 50 states and the District of Columbia.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-primary-500">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search" className="hover:text-primary-500">
                  Search Listings
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-500">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary-500">
                  Pricing for Landlords
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-primary-500">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary-500">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-primary-500">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/fair-housing" className="hover:text-primary-500">
                  Fair Housing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@rentusa.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>1-800-RENT-USA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            © {currentYear} RentUSA. All rights reserved. |{' '}
            <span className="text-yellow-500">
              Equal Housing Opportunity Provider
            </span>
          </p>
          <p className="mt-2 text-xs">
            All listing data must come from legitimate sources. Do not scrape data from other websites.
          </p>
        </div>
      </div>
    </footer>
  )
}
