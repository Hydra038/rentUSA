# RentUSA - Real Estate Rental Platform

A production-ready, full-stack rental property platform built with Next.js 14, TypeScript, Supabase, and PostgreSQL. Browse apartments, houses, and condos across all 50 US states and the District of Columbia.

## 🚀 Features

### Core Functionality
- **Multi-role authentication**: Admin, Landlord, and Renter roles with NextAuth
- **Property listings**: Full CRUD operations with photos, descriptions, and amenities
- **Advanced search & filters**: Search by location (city, state, ZIP code), price, bedrooms, bathrooms, pets
- **Interactive maps**: react-leaflet integration with property markers and geocoding
- **State & city pages**: Pre-generated static routes for all 51 locations
- **Admin dashboard**: Manage listings, users, and property status
- **Responsive design**: Mobile-first Tailwind CSS

### Technical Highlights
- **Next.js 14 App Router** with Server Components
- **TypeScript** for type safety
- **Supabase** with PostgreSQL database
- **NextAuth** with email/password authentication
- **Geocoding service** for accurate map coordinates
- **Role-based access control** with middleware
- **SEO optimized** with dynamic metadata
- **Location-based search** with city, state, and ZIP code support

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (PostgreSQL database)
- Cloudinary account (for image uploads)

## 🛠️ Installation

### 1. Clone and Install

```bash
git clone https://github.com/Hydra038/rentUSA.git
cd RentUSA
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 4. Test Credentials

```
Admin: admin@rentusa.com / admin123
```

## 🔍 Search Features

### Location-Based Search
- **City & State**: "Chicago, IL" or "Los Angeles, CA"
- **State Only**: "CA" or "TX"
- **ZIP Code**: "60601" or "90001"
- **City Name**: "Seattle" or "Miami"

### Advanced Filters
- State selection
- City selection
- ZIP code (5-digit)
- Price range (min/max)
- Bedrooms (1-4+)
- Bathrooms (1-3+)

## 📚 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: NextAuth.js with Supabase
- **Styling**: Tailwind CSS
- **Maps**: React Leaflet + OpenStreetMap
- **Geocoding**: Nominatim (OpenStreetMap API)
- **Deployment**: Vercel + Supabase

## 📄 License

MIT License - Feel free to use this for personal or commercial projects.

---

**Built with ❤️ for the rental community**
