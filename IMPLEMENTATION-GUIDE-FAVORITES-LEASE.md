# Adding Favorites & Lease Length Features

## 🎯 Part 1: Adding Favorite/Save Listing Functionality

### Current Status:
- ✅ Database model exists (`SavedListing`)
- ✅ Renter dashboard shows saved listings
- ❌ No UI to save/unsave listings
- ❌ No API endpoints for saving

### Step-by-Step Implementation:

#### **1. Create API Endpoint for Saving Listings**

Create file: `app/api/listings/[id]/save/route.ts`

```typescript
/**
 * Save/Unsave Listing API
 * Toggle favorite status for a listing
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { randomBytes } from 'crypto'

// Generate CUID
function generateCuid() {
  const timestamp = Date.now().toString(36)
  const randomPart = randomBytes(12).toString('base64').replace(/[+/=]/g, '').substring(0, 16)
  return `c${timestamp}${randomPart}`
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const listingId = params.id

    // Check if already saved
    const { data: existing } = await supabaseAdmin
      .from('SavedListing')
      .select('id')
      .eq('userId', session.user.id)
      .eq('listingId', listingId)
      .single()

    if (existing) {
      // Already saved, so unsave it
      const { error } = await supabaseAdmin
        .from('SavedListing')
        .delete()
        .eq('id', existing.id)

      if (error) {
        console.error('Error unsaving listing:', error)
        return NextResponse.json(
          { error: 'Failed to unsave listing' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        saved: false,
        message: 'Listing removed from favorites'
      })
    } else {
      // Not saved yet, so save it
      const { error } = await supabaseAdmin
        .from('SavedListing')
        .insert({
          id: generateCuid(),
          userId: session.user.id,
          listingId: listingId
        })

      if (error) {
        console.error('Error saving listing:', error)
        return NextResponse.json(
          { error: 'Failed to save listing' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        saved: true,
        message: 'Listing added to favorites'
      })
    }
  } catch (error) {
    console.error('Save listing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get save status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ saved: false })
    }

    const { data } = await supabaseAdmin
      .from('SavedListing')
      .select('id')
      .eq('userId', session.user.id)
      .eq('listingId', params.id)
      .single()

    return NextResponse.json({ saved: !!data })
  } catch (error) {
    return NextResponse.json({ saved: false })
  }
}
```

#### **2. Create SaveButton Component**

Create file: `components/SaveButton.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SaveButtonProps {
  listingId: string
  className?: string
  showText?: boolean
}

export default function SaveButton({ listingId, className = '', showText = true }: SaveButtonProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check initial save status
  useEffect(() => {
    if (session?.user) {
      checkSaveStatus()
    }
  }, [session, listingId])

  const checkSaveStatus = async () => {
    try {
      const response = await fetch(`/api/listings/${listingId}/save`)
      const data = await response.json()
      setIsSaved(data.saved)
    } catch (error) {
      console.error('Error checking save status:', error)
    }
  }

  const handleSave = async () => {
    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname))
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/listings/${listingId}/save`, {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setIsSaved(data.saved)
      } else {
        alert(data.error || 'Failed to save listing')
      }
    } catch (error) {
      console.error('Error saving listing:', error)
      alert('Failed to save listing')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSave}
      disabled={isLoading}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
        ${isSaved 
          ? 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100' 
          : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <Heart 
        className={`h-5 w-5 ${isSaved ? 'fill-red-600' : ''}`}
      />
      {showText && (
        <span>
          {isLoading ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  )
}
```

#### **3. Add SaveButton to ListingCard**

Update: `components/ListingCard.tsx`

```typescript
// Add import at top
import SaveButton from './SaveButton'

// Add this inside the card, after the image section:
<div className="absolute top-3 right-3 z-10">
  <SaveButton listingId={listing.id} showText={false} />
</div>
```

#### **4. Add SaveButton to Listing Detail Page**

Update: `app/listing/[id]/page.tsx`

```typescript
// Add import
import SaveButton from '@/components/SaveButton'

// Add this in the header section, near the back button:
<div className="mb-4 sm:mb-6 flex items-center justify-between">
  <BackButton />
  <SaveButton listingId={listing.id} />
</div>
```

---

## 📅 Part 2: Adding Lease Length Feature

### Step-by-Step Implementation:

#### **1. Update Database Schema**

Add to `prisma/schema.prisma`:

```prisma
enum LeaseLength {
  ONE_MONTH       // Short-term (30 days)
  THREE_MONTHS    // 3 months
  SIX_MONTHS      // 6 months
  NINE_MONTHS     // 9 months
  TWELVE_MONTHS   // 1 year (most common)
  EIGHTEEN_MONTHS // 1.5 years
  TWENTY_FOUR_MONTHS // 2 years
  MONTH_TO_MONTH  // No fixed term
  FLEXIBLE        // Negotiable
}

model Listing {
  // ... existing fields ...
  
  leaseLength    LeaseLength? // Optional lease length
  minLeaseMonths Int?         // Alternative: minimum months
  maxLeaseMonths Int?         // Alternative: maximum months
  
  // ... rest of fields ...
}
```

#### **2. Run Migration**

```bash
# Generate migration
npx prisma migrate dev --name add_lease_length

# Or if using Supabase, apply schema changes manually in Supabase SQL Editor:
```

SQL for Supabase:

```sql
-- Create lease length enum
CREATE TYPE "LeaseLength" AS ENUM (
  'ONE_MONTH',
  'THREE_MONTHS',
  'SIX_MONTHS',
  'NINE_MONTHS',
  'TWELVE_MONTHS',
  'EIGHTEEN_MONTHS',
  'TWENTY_FOUR_MONTHS',
  'MONTH_TO_MONTH',
  'FLEXIBLE'
);

-- Add lease length column to Listing table
ALTER TABLE "Listing" 
ADD COLUMN "leaseLength" "LeaseLength",
ADD COLUMN "minLeaseMonths" INTEGER,
ADD COLUMN "maxLeaseMonths" INTEGER;
```

#### **3. Update Listing Form to Include Lease Length**

Create helper function in `lib/utils.ts`:

```typescript
export const leaseLengthOptions = [
  { value: 'ONE_MONTH', label: '1 Month' },
  { value: 'THREE_MONTHS', label: '3 Months' },
  { value: 'SIX_MONTHS', label: '6 Months' },
  { value: 'NINE_MONTHS', label: '9 Months' },
  { value: 'TWELVE_MONTHS', label: '12 Months (1 Year)' },
  { value: 'EIGHTEEN_MONTHS', label: '18 Months' },
  { value: 'TWENTY_FOUR_MONTHS', label: '24 Months (2 Years)' },
  { value: 'MONTH_TO_MONTH', label: 'Month-to-Month' },
  { value: 'FLEXIBLE', label: 'Flexible / Negotiable' },
]

export function formatLeaseLength(leaseLength: string): string {
  const option = leaseLengthOptions.find(opt => opt.value === leaseLength)
  return option?.label || leaseLength
}
```

#### **4. Add Lease Length to Search Filters**

Update `components/SearchBar.tsx` or `components/ListingFilters.tsx`:

```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Lease Length
  </label>
  <select
    name="leaseLength"
    value={filters.leaseLength || ''}
    onChange={(e) => setFilters({ ...filters, leaseLength: e.target.value })}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
  >
    <option value="">Any Length</option>
    {leaseLengthOptions.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</div>
```

#### **5. Display Lease Length on Listing Cards**

Update `components/ListingCard.tsx`:

```typescript
import { Calendar } from 'lucide-react'
import { formatLeaseLength } from '@/lib/utils'

// Add this in the card details section:
{listing.leaseLength && (
  <div className="flex items-center text-sm text-gray-600">
    <Calendar className="h-4 w-4 mr-1" />
    {formatLeaseLength(listing.leaseLength)}
  </div>
)}
```

#### **6. Display Lease Length on Listing Detail Page**

Update `app/listing/[id]/page.tsx`:

```typescript
import { Calendar } from 'lucide-react'
import { formatLeaseLength } from '@/lib/utils'

// Add this in the property details section:
{listing.leaseLength && (
  <div className="flex items-center text-gray-700">
    <Calendar className="h-5 w-5 text-primary-600 mr-3" />
    <div>
      <div className="font-semibold">Lease Length</div>
      <div className="text-sm text-gray-600">
        {formatLeaseLength(listing.leaseLength)}
      </div>
    </div>
  </div>
)}
```

#### **7. Update Search/Filter Logic**

Update your search API or page to filter by lease length:

```typescript
// In app/search/page.tsx or API route
const { leaseLength } = searchParams

let query = supabaseAdmin
  .from('Listing')
  .select('*')
  .eq('published', true)

if (leaseLength) {
  query = query.eq('leaseLength', leaseLength)
}

const { data: listings } = await query
```

---

## 🎨 UI/UX Recommendations

### For Favorites:
1. **Heart icon** - Red when saved, outline when not
2. **Animate on click** - Scale up briefly
3. **Toast notification** - "Added to favorites" or "Removed from favorites"
4. **Count badge** - Show number of saves on renter dashboard
5. **Favorites page** - Dedicated page at `/favorites` or `/dashboard/renter`

### For Lease Length:
1. **Prominent display** - Show in listing cards
2. **Filter priority** - Common filter (12 months is most common)
3. **Multiple options** - Some landlords offer flexibility
4. **Visual indicator** - Calendar icon or badge
5. **Sorting** - Allow sorting by shortest/longest lease

---

## 📋 Testing Checklist

### Favorites:
- [ ] Can save listing when logged in
- [ ] Can unsave listing
- [ ] Heart icon updates immediately
- [ ] Redirects to sign-in when not logged in
- [ ] Saved listings appear in renter dashboard
- [ ] Can't save same listing twice
- [ ] Save status persists on page refresh

### Lease Length:
- [ ] Lease length displays on listing cards
- [ ] Lease length displays on detail page
- [ ] Can filter by lease length
- [ ] Filter returns correct results
- [ ] Works with other filters (price, beds, etc.)
- [ ] Handles missing lease length gracefully
- [ ] Admin can set lease length when creating listing

---

## 🚀 Deployment Notes

1. **Database Migration**: Run in production Supabase
2. **Environment Variables**: No new vars needed
3. **API Routes**: New routes deploy automatically with Vercel
4. **Testing**: Test on staging first
5. **Rollback Plan**: Keep schema migration reversible

---

## 💡 Future Enhancements

### Favorites:
- Email notifications for price drops on saved listings
- Share favorites with friends
- Collections/folders for organizing favorites
- Public wishlist URLs

### Lease Length:
- Multiple lease options per listing
- Lease end date calculator
- Renewal reminders
- Custom lease terms (e.g., "7 months")
- Lease comparison tool

---

**Priority Order:**
1. ✅ Favorites functionality (high user demand)
2. ✅ Lease length field (essential info)
3. Future: Advanced features

This implementation gives you both key features that Apartments.com has! 🎯
