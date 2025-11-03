# Google AdSense Setup Guide for RentUSA

## Step 1: Apply for Google AdSense

1. **Visit AdSense**: https://www.google.com/adsense/start/
2. **Sign up** with your Google account
3. **Enter your website**: `https://usarentsite.vercel.app`
4. **Complete the application**:
   - Provide your site details
   - Accept terms and conditions
   - Enter payment information
5. **Wait for approval** (typically 1-2 weeks)

## Step 2: Get Your AdSense Publisher ID

Once approved, you'll receive a publisher ID that looks like:
```
ca-pub-1234567890123456
```

## Step 3: Add Your AdSense ID to Environment Variables

### Local Development (.env file):
```env
NEXT_PUBLIC_ADSENSE_ID="ca-pub-YOUR-PUBLISHER-ID"
```

### Vercel Production:
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add:
   - **Key**: `NEXT_PUBLIC_ADSENSE_ID`
   - **Value**: `ca-pub-YOUR-PUBLISHER-ID`
   - Select: Production, Preview, Development
4. Click Save
5. Redeploy your site

## Step 4: Add Ads to Your Pages

### Example 1: Add to Homepage (app/page.tsx)

```tsx
import GoogleAdsense from '@/components/GoogleAdsense'

export default function HomePage() {
  return (
    <div>
      {/* Your existing content */}
      
      {/* Ad Unit - Between sections */}
      {process.env.NEXT_PUBLIC_ADSENSE_ID && (
        <GoogleAdsense
          adClient={process.env.NEXT_PUBLIC_ADSENSE_ID}
          adSlot="1234567890" // Get this from AdSense dashboard
          adFormat="auto"
          className="my-8"
        />
      )}
      
      {/* More content */}
    </div>
  )
}
```

### Example 2: Add to Search Results (app/search/page.tsx)

```tsx
import GoogleAdsense from '@/components/GoogleAdsense'

export default function SearchPage() {
  return (
    <div>
      {/* Search results */}
      
      {/* Ad Unit - Sidebar */}
      {process.env.NEXT_PUBLIC_ADSENSE_ID && (
        <GoogleAdsense
          adClient={process.env.NEXT_PUBLIC_ADSENSE_ID}
          adSlot="9876543210"
          adFormat="vertical"
          className="mb-4"
        />
      )}
    </div>
  )
}
```

### Example 3: Add to Listing Details (app/listing/[id]/page.tsx)

```tsx
import GoogleAdsense from '@/components/GoogleAdsense'

export default function ListingPage() {
  return (
    <div>
      {/* Listing details */}
      
      {/* Ad Unit - Below listing */}
      {process.env.NEXT_PUBLIC_ADSENSE_ID && (
        <GoogleAdsense
          adClient={process.env.NEXT_PUBLIC_ADSENSE_ID}
          adSlot="5555555555"
          adFormat="horizontal"
          className="mt-8"
        />
      )}
    </div>
  )
}
```

## Step 5: Create Ad Units in AdSense Dashboard

1. Go to AdSense Dashboard: https://www.google.com/adsense/
2. Click **Ads** → **By ad unit**
3. Click **+ New ad unit**
4. Choose ad type:
   - **Display ads** (most common)
   - **In-feed ads** (for listing feeds)
   - **In-article ads** (for blog posts)
5. Configure settings:
   - Name your ad unit (e.g., "Homepage Banner", "Sidebar Ad")
   - Choose size (Responsive recommended)
   - Get the **ad slot ID**
6. Copy the ad slot ID and use it in your components

## Best Practices for Ad Placement

### ✅ Good Locations:
- **Above the fold** on homepage (first screen users see)
- **Between search results** (every 5-10 listings)
- **Sidebar** on listing detail pages
- **Below listing details** before related listings
- **Footer** area (less intrusive)

### ❌ Avoid:
- Too many ads on one page (Google may penalize)
- Ads that push main content too far down
- Ads in dashboards or admin areas
- Deceptive placement that looks like content

## Step 6: Verify AdSense Connection

1. After deploying with your AdSense ID, visit your site
2. In AdSense dashboard, verify that:
   - Your site appears in "Sites"
   - Ads are showing (may take 24-48 hours)
   - Impressions are being tracked

## AdSense Policies to Follow

⚠️ **Important**: Violating these can get you banned
- ✅ Original, high-quality content
- ✅ Easy navigation and user experience
- ✅ Transparent about ads
- ❌ Don't click your own ads
- ❌ Don't ask others to click ads
- ❌ No adult content
- ❌ No copyrighted material
- ❌ No misleading content

## Troubleshooting

### Ads not showing?
- Wait 24-48 hours after approval
- Check browser ad blockers are disabled
- Verify environment variable is set correctly
- Check browser console for errors

### "AdSense account not approved"?
- Ensure your site has:
  - Privacy Policy page ✅ (you have this)
  - Terms of Service ✅ (you have this)
  - About page ✅ (you have this)
  - Original content
  - Sufficient content (at least 20-30 pages)
  - Regular traffic

### Low earnings?
- Increase site traffic (SEO, marketing)
- Optimize ad placement (A/B testing)
- Create high-quality content
- Target high-CPC keywords (real estate has good CPC)

## Expected Earnings

For a rental listing site:
- **RPM** (Revenue per 1000 views): $3-$15
- **Real estate niche**: Higher CPCs ($2-$10 per click)
- **100 daily visitors**: ~$1-3/day
- **1,000 daily visitors**: ~$10-30/day
- **10,000 daily visitors**: ~$100-300/day

## Next Steps

1. ✅ Apply for AdSense
2. ⏳ Wait for approval (1-2 weeks)
3. ✅ Get your publisher ID
4. ✅ Add to .env and Vercel
5. ✅ Add ad components to key pages
6. ✅ Create ad units in AdSense dashboard
7. ✅ Monitor performance

Good luck with monetization! 🚀
