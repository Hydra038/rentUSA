# RentUSA Branding Assets

## Icons and Favicons

This directory contains all the branding assets for RentUSA.

### Files Created

#### App Icons (Next.js 14 Convention)
- **`app/icon.svg`** - Main app icon (any size, scalable)
- **`app/apple-icon.png`** - Apple touch icon (180x180)

#### Public Assets
- **`public/favicon.ico`** - Browser favicon
- **`public/icon-192.svg`** - PWA icon (192x192)
- **`public/icon-512.svg`** - PWA icon (512x512)
- **`public/og-image.svg`** - Open Graph social media image (1200x630)
- **`public/manifest.json`** - PWA manifest file

#### Components
- **`components/Logo.tsx`** - Reusable React logo component

### Design Specifications

#### Color Palette
- **Primary Blue**: `#3B82F6` (Tailwind blue-500)
- **Dark Blue**: `#1E40AF` (Tailwind blue-800)
- **Light Blue**: `#60A5FA` (Tailwind blue-400)
- **Gold Stars**: `#FBBF24` (Tailwind amber-400)
- **White**: `#FFFFFF`
- **Light Gray**: `#E5E7EB` (Tailwind gray-200)

#### Icon Design Elements
1. **House Symbol**: Represents rental properties
   - Roof with triangular shape
   - Rectangular house body
   - Blue door with white doorknob
   - Two windows with cross panes
   
2. **USA Theme**: Gold stars representing American flag
   - Two stars positioned at top corners
   
3. **Circular Background**: Blue gradient circle for brand recognition

### Usage in Components

#### Navbar Logo
The logo is imported and used in the Navbar component:

```tsx
import Logo from './Logo'

<Logo className="h-8 w-8 sm:h-10 sm:w-10" />
```

#### Custom Sizes
```tsx
// Small
<Logo className="h-6 w-6" />

// Medium (default)
<Logo className="h-8 w-8" />

// Large
<Logo className="h-12 w-12" />
```

### Browser and PWA Support

#### Favicon
- Modern browsers use `icon.svg` (scalable)
- Fallback to `favicon.ico` for older browsers

#### Apple Devices
- `apple-icon.png` used for iOS home screen

#### Progressive Web App (PWA)
- Manifest includes multiple icon sizes
- Supports "Add to Home Screen" on mobile devices
- Theme color: `#3B82F6`
- Background color: `#FFFFFF`

### Social Media Sharing

#### Open Graph (Facebook, LinkedIn)
- Image: `og-image.svg` (1200x630)
- Includes logo, title, and feature highlights

#### Twitter Cards
- Same image as Open Graph
- Optimized for Twitter's large image card format

### Next.js Metadata Configuration

All metadata is configured in `app/layout.tsx`:

```tsx
export const metadata = {
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  openGraph: {
    images: [{ url: '/og-image.svg', width: 1200, height: 630 }]
  }
}
```

### Testing

1. **Browser Tab**: Check favicon appears in browser tab
2. **Bookmarks**: Add to bookmarks and verify icon
3. **Mobile**: Test "Add to Home Screen" on iOS/Android
4. **Social Share**: Share link on Facebook/Twitter and verify preview image
5. **PWA**: Install as PWA and check app icon

### File Formats

- **SVG**: Scalable, small file size, crisp at any resolution
- **PNG**: Compatibility with older systems and specific size requirements
- **ICO**: Legacy favicon support

### Accessibility

- All icons have proper `alt` attributes when used as images
- SVG elements include proper `role` attributes
- Color contrast meets WCAG AA standards

---

**Last Updated**: November 2, 2025
**Designer**: GitHub Copilot
**Brand**: RentUSA
