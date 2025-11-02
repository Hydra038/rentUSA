/**
 * Utility Functions
 * Helper functions used throughout the application
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency to USD
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Create URL slug from string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Generate pagination metadata
 */
export function getPaginationMeta(
  total: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(total / limit)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
  }
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Generate random ID (fallback if cuid not available)
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole)
}
