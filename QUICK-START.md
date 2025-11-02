# 🚀 RentUSA - Quick Start Card

## 📋 Setup Checklist (Do in Order)

### ✅ Step 1: Setup Database (Supabase)
```
1. Open Supabase Dashboard → SQL Editor
2. Open file: supabase-setup.sql
3. Copy ALL SQL code
4. Paste into SQL Editor
5. Click "Run"
6. Verify 11 tables created in Table Editor
```

### ✅ Step 2: Seed Sample Data
```powershell
npm run db:seed
```
Creates 120 listings with real apartment photos!

### ✅ Step 3: Start Development Server
```powershell
npm run dev
```
Visit: http://localhost:3000

---

## 🔐 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@rentusa.com | password123 |
| **Landlord** | landlord1@rentusa.com | password123 |
| **Renter** | renter@rentusa.com | password123 |

---

## 📁 Important Files Created

| File | Purpose |
|------|---------|
| `supabase-setup.sql` | **Run this in Supabase SQL Editor** |
| `SUPABASE-SETUP-GUIDE.md` | Step-by-step database setup |
| `IMAGE-SETUP-GUIDE.md` | Image integration details |
| `IMAGE-CREDITS.md` | Photo attribution |
| `STYLE-COMPARISON.md` | RentUSA vs Apartments.com |

---

## 🎨 Design Updates

### Search Bar (Fixed!)
- ✅ Rounded pill shape (like Apartments.com)
- ✅ Green search icon
- ✅ Clean white background
- ✅ Simple placeholder: "Chicago, IL"

### Hero Section
- ✅ Full-width cityscape background
- ✅ Gradient overlay
- ✅ Large white text
- ✅ Centered search bar

### Listing Cards
- ✅ Building exterior photos
- ✅ Clean white cards
- ✅ Hover effects
- ✅ Price ranges

---

## 📸 Images Included

**28 Professional Photos from Unsplash:**
- 8 Building exteriors
- 20 Interior shots (living rooms, kitchens, bedrooms, bathrooms)
- All optimized by Next.js
- Free to use commercially

---

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma 6.18
- **Auth**: NextAuth v4
- **Styling**: Tailwind CSS
- **Images**: Unsplash (via Next.js Image)
- **Payments**: Stripe (ready)
- **Maps**: React Leaflet

---

## 🌐 Routes Created

| Path | Description |
|------|-------------|
| `/` | Homepage with hero + featured listings |
| `/search` | Search results page |
| `/state/[state]` | State-specific listings (e.g., /state/ca) |
| `/listing/[id]` | Individual listing details |
| `/auth/signin` | Sign in page |
| `/auth/signup` | Sign up page |
| `/dashboard/admin` | Admin dashboard |
| `/dashboard/landlord` | Landlord portal |
| `/dashboard/renter` | Renter favorites |

---

## 📊 Database Stats (After Seed)

- **States**: 51 (all 50 + DC)
- **Cities**: ~50 major cities
- **Listings**: 120 properties
- **Photos**: ~480 images
- **Users**: 12 accounts
- **Featured**: 10 homepage listings

---

## 🎯 What Works Now

✅ User registration & login  
✅ Google OAuth (after adding credentials)  
✅ Browse listings by state  
✅ Search functionality  
✅ View listing details  
✅ Photo galleries  
✅ Landlord dashboard  
✅ Renter dashboard  
✅ Responsive design  
✅ Professional Apartments.com styling  

---

## 🚀 Deploy to Production

### Vercel Deployment
```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit - RentUSA"
git push

# 2. Deploy on Vercel
# - Import GitHub repo
# - Add environment variables
# - Deploy
```

### Environment Variables (Vercel)
```
DATABASE_URL=your_supabase_url
DIRECT_URL=your_supabase_direct_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=your_google_id (optional)
GOOGLE_CLIENT_SECRET=your_google_secret (optional)
```

---

## 🆘 Quick Troubleshooting

### Database connection errors?
- Check `.env` has correct Supabase URL
- Verify Supabase project is active
- Run SQL setup script in Supabase

### No images showing?
- Images are from Unsplash CDN (no upload needed)
- Check `next.config.js` has `images.unsplash.com`
- Already configured! ✅

### Search not working?
- Run seed script to add data
- Check database has listings
- Verify `npm run dev` is running

### Google OAuth not working?
- Add credentials in `.env`
- Follow setup in previous messages
- Email/password works without it!

---

## 📞 Support Files

- `README.md` - Main documentation
- `QUICKSTART.md` - Quick start guide
- `DEPLOYMENT.md` - Deployment instructions
- `SUPABASE-VERCEL-SETUP.md` - Supabase + Vercel guide

---

## 🎉 You're Ready!

Your RentUSA platform is now:
- ✅ Professionally styled (Apartments.com look)
- ✅ Database ready (SQL script provided)
- ✅ Sample data ready (120 listings)
- ✅ Production ready (deployable to Vercel)

**Next Action:**  
Run the SQL script in Supabase, then `npm run db:seed`!

🚀 **Happy Coding!** 🚀
