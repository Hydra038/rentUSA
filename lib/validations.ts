/**
 * Zod Validation Schemas
 * Type-safe validation for API requests and forms
 */

import { z } from 'zod'

// ============================================
// USER VALIDATIONS
// ============================================

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['LANDLORD', 'RENTER']).default('RENTER'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// ============================================
// LISTING VALIDATIONS
// ============================================

export const listingSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  address: z.string().min(5, 'Address is required'),
  cityId: z.string().cuid('Invalid city ID'),
  stateId: z.string().cuid('Invalid state ID'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  price: z.number().positive('Price must be positive'),
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().min(0).max(20),
  sqft: z.number().int().positive().optional(),
  petsAllowed: z.boolean().default(false),
  amenities: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  availableDate: z.string().datetime().optional(),
})

export const updateListingSchema = listingSchema.partial()

export const listingSearchSchema = z.object({
  query: z.string().optional(),
  stateId: z.string().optional(),
  cityId: z.string().optional(),
  zip: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().optional(),
  petsAllowed: z.boolean().optional(),
  amenities: z.array(z.string()).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['price', 'createdAt', 'bedrooms']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// ============================================
// INQUIRY VALIDATIONS
// ============================================

export const inquirySchema = z.object({
  listingId: z.string().cuid('Invalid listing ID'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

// ============================================
// PHOTO VALIDATIONS
// ============================================

export const photoUploadSchema = z.object({
  listingId: z.string().cuid('Invalid listing ID'),
  imageData: z.string(), // Base64 encoded image
  isPrimary: z.boolean().default(false),
})

// ============================================
// STRIPE VALIDATIONS
// ============================================

export const checkoutSchema = z.object({
  priceId: z.string(),
  mode: z.enum(['subscription', 'payment']).default('subscription'),
})

// Export type inference helpers
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ListingInput = z.infer<typeof listingSchema>
export type ListingSearchInput = z.infer<typeof listingSearchSchema>
export type InquiryInput = z.infer<typeof inquirySchema>
export type PhotoUploadInput = z.infer<typeof photoUploadSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
