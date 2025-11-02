/**
 * Geocoding utility to convert addresses to coordinates
 * Uses Nominatim (OpenStreetMap) free geocoding service
 */

interface GeocodingResult {
  latitude: number
  longitude: number
}

/**
 * Geocode an address using Nominatim (OpenStreetMap)
 * Free service with usage limits - use responsibly
 */
export async function geocodeAddress(
  address: string,
  city: string,
  state: string,
  zip?: string
): Promise<GeocodingResult | null> {
  try {
    // Build the query string
    const parts = [address, city, state, zip].filter(Boolean)
    const query = encodeURIComponent(parts.join(', '))
    
    // Use Nominatim API (OpenStreetMap's geocoding service)
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=us`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RentUSA/1.0' // Required by Nominatim
      }
    })
    
    if (!response.ok) {
      console.error('Geocoding API error:', response.statusText)
      return null
    }
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      }
    }
    
    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

/**
 * Get approximate coordinates for a city/state
 * Useful when full address is not available
 */
export async function geocodeCityState(
  city: string,
  state: string
): Promise<GeocodingResult | null> {
  try {
    const query = encodeURIComponent(`${city}, ${state}, USA`)
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RentUSA/1.0'
      }
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      }
    }
    
    return null
  } catch (error) {
    console.error('City/State geocoding error:', error)
    return null
  }
}

/**
 * State center coordinates for fallback
 */
export const STATE_CENTERS: Record<string, GeocodingResult> = {
  'Alabama': { latitude: 32.806671, longitude: -86.791130 },
  'Alaska': { latitude: 61.370716, longitude: -152.404419 },
  'Arizona': { latitude: 33.729759, longitude: -111.431221 },
  'Arkansas': { latitude: 34.969704, longitude: -92.373123 },
  'California': { latitude: 36.116203, longitude: -119.681564 },
  'Colorado': { latitude: 39.059811, longitude: -105.311104 },
  'Connecticut': { latitude: 41.597782, longitude: -72.755371 },
  'Delaware': { latitude: 39.318523, longitude: -75.507141 },
  'Florida': { latitude: 27.766279, longitude: -81.686783 },
  'Georgia': { latitude: 33.040619, longitude: -83.643074 },
  'Hawaii': { latitude: 21.094318, longitude: -157.498337 },
  'Idaho': { latitude: 44.240459, longitude: -114.478828 },
  'Illinois': { latitude: 40.349457, longitude: -88.986137 },
  'Indiana': { latitude: 39.849426, longitude: -86.258278 },
  'Iowa': { latitude: 42.011539, longitude: -93.210526 },
  'Kansas': { latitude: 38.526600, longitude: -96.726486 },
  'Kentucky': { latitude: 37.668140, longitude: -84.670067 },
  'Louisiana': { latitude: 31.169546, longitude: -91.867805 },
  'Maine': { latitude: 44.693947, longitude: -69.381927 },
  'Maryland': { latitude: 39.063946, longitude: -76.802101 },
  'Massachusetts': { latitude: 42.230171, longitude: -71.530106 },
  'Michigan': { latitude: 43.326618, longitude: -84.536095 },
  'Minnesota': { latitude: 45.694454, longitude: -93.900192 },
  'Mississippi': { latitude: 32.741646, longitude: -89.678696 },
  'Missouri': { latitude: 38.456085, longitude: -92.288368 },
  'Montana': { latitude: 46.921925, longitude: -110.454353 },
  'Nebraska': { latitude: 41.125370, longitude: -98.268082 },
  'Nevada': { latitude: 38.313515, longitude: -117.055374 },
  'New Hampshire': { latitude: 43.452492, longitude: -71.563896 },
  'New Jersey': { latitude: 40.298904, longitude: -74.521011 },
  'New Mexico': { latitude: 34.840515, longitude: -106.248482 },
  'New York': { latitude: 42.165726, longitude: -74.948051 },
  'North Carolina': { latitude: 35.630066, longitude: -79.806419 },
  'North Dakota': { latitude: 47.528912, longitude: -99.784012 },
  'Ohio': { latitude: 40.388783, longitude: -82.764915 },
  'Oklahoma': { latitude: 35.565342, longitude: -96.928917 },
  'Oregon': { latitude: 44.572021, longitude: -122.070938 },
  'Pennsylvania': { latitude: 40.590752, longitude: -77.209755 },
  'Rhode Island': { latitude: 41.680893, longitude: -71.511780 },
  'South Carolina': { latitude: 33.856892, longitude: -80.945007 },
  'South Dakota': { latitude: 44.299782, longitude: -99.438828 },
  'Tennessee': { latitude: 35.747845, longitude: -86.692345 },
  'Texas': { latitude: 31.054487, longitude: -97.563461 },
  'Utah': { latitude: 40.150032, longitude: -111.862434 },
  'Vermont': { latitude: 44.045876, longitude: -72.710686 },
  'Virginia': { latitude: 37.769337, longitude: -78.169968 },
  'Washington': { latitude: 47.400902, longitude: -121.490494 },
  'West Virginia': { latitude: 38.491226, longitude: -80.954453 },
  'Wisconsin': { latitude: 44.268543, longitude: -89.616508 },
  'Wyoming': { latitude: 42.755966, longitude: -107.302490 },
  'District of Columbia': { latitude: 38.907192, longitude: -77.036871 }
}

/**
 * Get coordinates with fallback strategy
 * 1. Try full address geocoding
 * 2. Try city/state geocoding
 * 3. Fall back to state center
 */
export async function getCoordinates(
  address: string,
  city: string,
  state: string,
  zip?: string
): Promise<GeocodingResult> {
  // Add delay to respect rate limits (1 request per second for Nominatim)
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Try full address
  let coords = await geocodeAddress(address, city, state, zip)
  if (coords) return coords
  
  // Try city/state
  coords = await geocodeCityState(city, state)
  if (coords) return coords
  
  // Fall back to state center
  return STATE_CENTERS[state] || { latitude: 39.8283, longitude: -98.5795 } // USA center
}
