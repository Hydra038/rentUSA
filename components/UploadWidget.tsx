/**
 * UploadWidget Component
 * Cloudinary image upload interface for adding listing photos
 */

'use client'

import { useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface UploadWidgetProps {
  onUploadSuccess: (url: string, publicId: string) => void
  maxFiles?: number
}

export default function UploadWidget({
  onUploadSuccess,
  maxFiles = 10,
}: UploadWidgetProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ url: string; publicId: string }>
  >([])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images`)
      return
    }

    setUploading(true)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Convert file to base64
        const reader = new FileReader()
        reader.readAsDataURL(file)
        
        reader.onload = async () => {
          try {
            const base64 = reader.result as string
            
            // Upload to your API endpoint
            const response = await fetch('/api/photos', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                imageData: base64,
              }),
            })

            if (!response.ok) {
              throw new Error('Upload failed')
            }

            const data = await response.json()
            
            // Add to uploaded files
            const newFile = { url: data.url, publicId: data.publicId }
            setUploadedFiles((prev) => [...prev, newFile])
            onUploadSuccess(data.url, data.publicId)
          } catch (error) {
            console.error('Upload error:', error)
            alert('Failed to upload image')
          }
        }
      }
    } finally {
      setUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  const removeFile = (publicId: string) => {
    setUploadedFiles((prev) =>
      prev.filter((file) => file.publicId !== publicId)
    )
  }

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={uploading || uploadedFiles.length >= maxFiles}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className={`
            flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer
            ${uploading || uploadedFiles.length >= maxFiles
              ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
              : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
            }
          `}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
                <p className="mt-2 text-sm text-gray-500">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 mb-3" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB ({uploadedFiles.length}/{maxFiles} uploaded)
                </p>
              </>
            )}
          </div>
        </label>
      </div>

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadedFiles.map((file, index) => (
            <div key={file.publicId} className="relative group">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={file.url}
                  alt={`Uploaded ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <button
                onClick={() => removeFile(file.publicId)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
