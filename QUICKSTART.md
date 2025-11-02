# 🚀 Quick Start Guide - RentUSA

Get your RentUSA platform up and running in 10 minutes!

## Step 1: Install Dependencies

```powershell
npm install
```

## Step 2: Setup PostgreSQL Database

### Option A: Local PostgreSQL
1. Install PostgreSQL from https://www.postgresql.org/download/windows/
2. Create a database:
```sql
CREATE DATABASE rentusa;
```

### Option B: Supabase (Recommended for quick start)
1. Go to https://supabase.com
2. Create a new project
3. Copy the connection string from Settings → Database

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```

2. Edit `.env` and update these required fields:

```bash
# Required: Your PostgreSQL connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/rentusa"

# Required: Generate a random secret (run in terminal: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
NEXTAUTH_SECRET="your-generated-secret-here"

# Required for local development
NEXTAUTH_URL="http://localhost:3000"

# Optional but recommended: Get from https://console.cloudinary.com
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-cloudinary-key"
CLOUDINARY_API_SECRET="your-cloudinary-secret"

# Optional: Google OAuth from https://console.cloud.google.com
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Optional: Stripe from https://dashboard.stripe.com
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## Step 4: Setup Database

```powershell
# Run migrations
npx prisma migrate dev

# Seed with 120 sample listings across all 51 states
npm run db:seed
```

## Step 5: Start Development Server

```powershell
npm run dev
```

Visit: **http://localhost:3000**

## 🎉 You're Ready!

### Test Accounts (after seeding)

| Role     | Email                    | Password    |
|----------|--------------------------|-------------|
| Admin    | admin@rentusa.com        | password123 |
| Landlord | landlord1@rentusa.com    | password123 |
| Renter   | renter@rentusa.com       | password123 |

### What to Explore

1. **Browse Listings**: Go to homepage and search
2. **View State Pages**: Visit `/state/ca` or any state code
3. **Landlord Dashboard**: Login as landlord and manage listings
4. **Admin Panel**: Login as admin to approve listings

## 🔧 Common Issues

### "Module not found" errors
```powershell
npm install
npx prisma generate
```

### Migration errors
```powershell
npx prisma migrate reset
npx prisma migrate dev
```

### Port already in use
Change port in package.json:
```json
"dev": "next dev -p 3001"
```

## 📦 Optional Integrations

### Enable Image Uploads (Cloudinary)
1. Sign up at https://cloudinary.com (free tier available)
2. Get your credentials from Dashboard
3. Add to `.env`:
```bash
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Enable Google Sign-In
1. Go to https://console.cloud.google.com
2. Create a project
3. Enable Google OAuth API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Add credentials to `.env`

### Enable Payments (Stripe)
1. Sign up at https://stripe.com
2. Get test API keys from Dashboard
3. Add to `.env`:
```bash
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## 🚢 Ready to Deploy?

See full deployment guide in `README.md`

Quick deploy to Vercel:
```powershell
npm install -g vercel
vercel
```

## 📚 Next Steps

- Read full documentation in `README.md`
- Customize styling in `tailwind.config.js`
- Add more cities in `prisma/seed.ts`
- Configure Stripe plans in `lib/stripe.ts`

## 💡 Tips

- Use Prisma Studio to view database: `npm run db:studio`
- Check API routes in `app/api/`
- All state pages are pre-generated (SSG)
- TypeScript errors will resolve after `npm install`

---

**Need Help?** Check the main README.md or open an issue on GitHub!
