/**
 * MapView Component
 * Interactive map display using react-leaflet with listing markers
 */

'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

interface MapViewProps {
  listings: Array<{
    id: string
    title: string
    latitude?: number
    longitude?: number
    price: number
  }>
  center?: [number, number]
  zoom?: number
  height?: string
}

export default function MapView({
  listings,
  center = [39.8283, -98.5795], // Geographic center of USA
  zoom = 4,
  height = '500px',
}: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Import and configure Leaflet only on client side
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        })
      })
      
      // Import Leaflet CSS (ignore TypeScript error)
      // @ts-ignore
      import('leaflet/dist/leaflet.css')
    }
  }, [])

  if (!isMounted) {
    return (
      <div
        style={{ height }}
        className="bg-gray-200 flex items-center justify-center rounded-lg"
      >
        <p className="text-gray-500">Loading map...</p>
      </div>
    )
  }

  // Filter listings with valid coordinates
  const validListings = listings.filter(
    (listing) => listing.latitude && listing.longitude
  )

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {validListings.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.latitude!, listing.longitude!]}
          >
            <Popup>
              <div className="p-2">
                <Link href={`/listing/${listing.id}`} className="font-semibold text-primary-600 hover:underline">
                  {listing.title}
                </Link>
                <p className="text-lg font-bold mt-1">
                  ${listing.price.toLocaleString()}/mo
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
