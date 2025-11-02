# RentUSA - Real Estate Rental Platform

A production-ready, full-stack rental property platform built with Next.js 14, TypeScript, Prisma, and PostgreSQL. Browse apartments, houses, and condos across all 50 US states and the District of Columbia.

## 🚀 Features

### Core Functionality
- **Multi-role authentication**: Admin, Landlord, and Renter roles with NextAuth
- **Property listings**: Full CRUD operations with photos, descriptions, and amenities
- **Advanced search & filters**: Search by location, price, bedrooms, bathrooms, pets
- **Interactive maps**: react-leaflet integration with property markers
- **State & city pages**: Pre-generated static routes for all 51 locations
- **Favorites system**: Renters can save listings
- **Inquiry system**: Message landlords directly
- **Payment processing**: Stripe integration for landlord subscriptions
- **Admin dashboard**: Approve listings, manage users and payments
- **Responsive design**: Mobile-first Tailwind CSS

### Technical Highlights
- **Next.js 14 App Router** with Server Components
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL
- **NextAuth** with email/password + Google OAuth
- **Zod validation** for API routes
- **Cloudinary** for image storage
- **Role-based access control** with middleware
- **SEO optimized** with dynamic metadata

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Cloudinary account (for image uploads)
- Stripe account (for payments)
- Google OAuth credentials (optional)

## 🛠️ Installation

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd RentUSA
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory (use `.env.example` as template):

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/rentusa?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"

# Session Secret
SESSION_SECRET="another-secret-key-for-sessions"
```

### 3. Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Seed database with sample data (120 listings across 51 states)
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 5. Test Credentials (after seeding)

```
Admin:    admin@rentusa.com / password123
Landlord: landlord1@rentusa.com / password123
Renter:   renter@rentusa.com / password123
```

## 🗂️ Project Structure

```
RentUSA/
├── app/                      # Next.js 14 App Router
│   ├── api/                 # API routes
│   │   ├── auth/           # NextAuth API
│   │   └── listings/       # Listing CRUD
│   ├── state/[state]/      # State listing pages (SSG)
│   ├── listing/[id]/       # Listing detail pages
│   ├── dashboard/          # Role-based dashboards
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/              # Reusable UI components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── SearchBar.tsx
│   ├── ListingCard.tsx
│   ├── ListingFilters.tsx
│   ├── ListingGallery.tsx
│   ├── MapView.tsx
│   ├── Pagination.tsx
│   └── UploadWidget.tsx
├── lib/                     # Utilities and configurations
│   ├── prisma.ts           # Prisma client
│   ├── auth.ts             # NextAuth config
│   ├── stripe.ts           # Stripe config
│   ├── cloudinary.ts       # Cloudinary config
│   ├── validations.ts      # Zod schemas
│   └── utils.ts            # Helper functions
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed script
├── middleware.ts            # Route protection
├── tailwind.config.js
└── tsconfig.json
```

## 🗄️ Database Schema

### Main Models
- **User**: Authentication with role-based access (ADMIN, LANDLORD, RENTER)
- **State**: All 50 states + DC
- **City**: Cities within states
- **Listing**: Property listings with details
- **Photo**: Multiple photos per listing (Cloudinary)
- **Inquiry**: Messages from renters
- **SavedListing**: Renter favorites
- **Subscription**: Stripe subscriptions for landlords

## 🚢 Deployment

### Vercel (Frontend)

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy!

### Database (Supabase/Render)

**Supabase (Recommended)**:
1. Create a Supabase project
2. Copy the connection string
3. Update `DATABASE_URL` in Vercel
4. Run migrations: `npx prisma migrate deploy`

**Render**:
1. Create a PostgreSQL instance
2. Copy internal connection string
3. Update `DATABASE_URL`
4. Run migrations

### Post-Deployment

```bash
# Run migrations on production
npx prisma migrate deploy

# Seed production database (optional)
npm run db:seed
```

## 🔒 Security Features

- **bcrypt** password hashing
- **NextAuth** session management
- **Role-based middleware** for route protection
- **Zod validation** on all API inputs
- **CSRF protection** via NextAuth
- **SQL injection protection** via Prisma

## 🎨 Customization

### Styling
- Modify colors in `tailwind.config.js`
- Update components in `components/`
- Edit global styles in `app/globals.css`

### Stripe Plans
Configure plans in `lib/stripe.ts`:
```typescript
export const STRIPE_PLANS = {
  BASIC: { priceId: 'price_...', amount: 2999 },
  PREMIUM: { priceId: 'price_...', amount: 9999 },
}
```

## ⚖️ Legal & Data Sources

**IMPORTANT**: This platform is designed to work with legitimate data sources only.

### ❌ DO NOT:
- Scrape data from other rental websites
- Copy listings from competitors
- Use unauthorized photos or descriptions

### ✅ DO:
- Allow landlords to create their own listings
- Use photos uploaded by property owners
- Implement user-generated content
- Partner with real estate agencies with proper agreements
- Use public APIs with proper licensing
- Ensure compliance with fair housing laws

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

## 🐛 Troubleshooting

### Prisma Client Not Found
```bash
npx prisma generate
```

### Migration Errors
```bash
npx prisma migrate reset
npx prisma migrate dev
```

### TypeScript Errors
```bash
npm install --save-dev @types/node
```

## 📚 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS
- **Payments**: Stripe
- **Storage**: Cloudinary
- **Maps**: React Leaflet + OpenStreetMap
- **Validation**: Zod
- **Deployment**: Vercel + Supabase

## 📄 License

MIT License - Feel free to use this for personal or commercial projects.

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For issues or questions:
- Open a GitHub issue
- Email: support@rentusa.com

---

**Built with ❤️ by the RentUSA Team**

Remember: Always source data ethically and comply with local regulations!
