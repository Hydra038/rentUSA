'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Building,
  BarChart3,
  FileText,
  TrendingUp,
  MessageSquare,
  Users,
  MapPin,
  Settings,
  Menu,
  X
} from 'lucide-react'

interface AdminSidebarProps {
  userName?: string | null
  userEmail?: string | null
  pendingInquiries?: number
}

export default function AdminSidebar({ userName, userEmail, pendingInquiries }: AdminSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard/admin', icon: BarChart3, label: 'Dashboard' },
    { href: '/dashboard/admin/listings', icon: FileText, label: 'Manage Listings' },
    { href: '/dashboard/admin/analytics', icon: TrendingUp, label: 'Analytics' },
    { 
      href: '/dashboard/admin/inquiries', 
      icon: MessageSquare, 
      label: 'Inquiries',
      badge: pendingInquiries && pendingInquiries > 0 ? pendingInquiries : undefined
    },
    { href: '/dashboard/admin/users', icon: Users, label: 'Users' },
    { href: '/states', icon: MapPin, label: 'States & Cities' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40
          w-64 bg-white border-r border-gray-200 min-h-screen
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">RentUSA</h2>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${isActive(item.href)
                  ? 'text-white bg-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}

          <div className="pt-4 border-t border-gray-200 mt-4">
            <Link
              href="/dashboard/admin/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${isActive('/dashboard/admin/settings')
                  ? 'text-white bg-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
            <div className="h-9 w-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {userName?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userName || 'Admin'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userEmail}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
