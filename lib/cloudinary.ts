/**
 * Cloudinary Configuration
 * Handles image uploads and transformations for listing photos
 */

import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export default cloudinary

/**
 * Upload an image to Cloudinary
 * @param file - Base64 encoded image or file path
 * @param folder - Cloudinary folder to store the image
 */
export async function uploadImage(file: string, folder: string = 'rentusa/listings') {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image')
  }
}

/**
 * Delete an image from Cloudinary
 * @param publicId - Cloudinary public ID of the image
 */
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete image')
  }
}

/**
 * Get optimized image URL with transformations
 * @param publicId - Cloudinary public ID
 * @param width - Desired width
 * @param height - Desired height
 */
export function getOptimizedImageUrl(
  publicId: string,
  width?: number,
  height?: number
): string {
  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop: 'fill' },
      { quality: 'auto' },
      { fetch_format: 'auto' },
    ],
  })
}
