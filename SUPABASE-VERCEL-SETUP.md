# ⚡ Quick Supabase + Vercel Setup

Follow these steps to deploy RentUSA in under 15 minutes!

---

## 🗄️ Step 1: Get Supabase Connection String (2 min)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project (or select existing)
3. **Wait for project to finish setting up** (~2 minutes)
4. Go to **Settings** (gear icon) → **Database** → **Connection String**
5. Copy **both** connection strings:

### Connection Pooling (for runtime):
```
Session mode
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Direct Connection (for migrations):
```
Session mode
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

📝 **Important:** Replace `[PASSWORD]` with your actual database password!

---

## 📝 Step 2: Update Your .env File (1 min)

Open `c:\Users\wisem\OneDrive\Desktop\RentUSA\.env` and update:

```bash
DATABASE_URL="paste-pooler-connection-here"
DIRECT_URL="paste-direct-connection-here"
```

---

## 🔑 Step 3: Generate Auth Secret (30 sec)

Run this command:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste in `.env`:
```bash
NEXTAUTH_SECRET="paste-here"
```

---

## 🗃️ Step 4: Setup Database (3 min)

Run these commands in PowerShell:

```powershell
# Generate Prisma Client
npx prisma generate

# Create all database tables
npx prisma migrate deploy

# Populate with sample data (120 listings across 51 states)
npm run db:seed
```

### ✅ Verify in Supabase:
1. Go to Supabase Dashboard → **Table Editor**
2. You should see tables: `User`, `State`, `City`, `Listing`, `Photo`, etc.
3. Click on `State` → should see 51 states
4. Click on `Listing` → should see 120 listings

---

## 🚀 Step 5: Deploy to Vercel (5 min)

### Option A: Via Vercel Dashboard (Recommended)

1. **Push to GitHub first:**
```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/rentusa.git
git push -u origin main
```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click **"Add New"** → **"Project"**
   - **Import** your GitHub repository
   - Framework: **Next.js** (auto-detected)
   - Click **"Deploy"**

### Option B: Via Vercel CLI

```powershell
npm install -g vercel
vercel
```

Follow the prompts!

---

## ⚙️ Step 6: Add Environment Variables to Vercel (3 min)

In Vercel Dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add these variables:

```bash
# Required
DATABASE_URL = your-supabase-pooler-connection-string
DIRECT_URL = your-supabase-direct-connection-string
NEXTAUTH_SECRET = your-generated-secret
NEXTAUTH_URL = https://your-app.vercel.app

# Optional (add later if needed)
CLOUDINARY_CLOUD_NAME = your-cloudinary-name
CLOUDINARY_API_KEY = your-cloudinary-key
CLOUDINARY_API_SECRET = your-cloudinary-secret
```

**Important:** For each variable, select **all environments** (Production, Preview, Development)

---

## 🔄 Step 7: Redeploy (1 min)

After adding environment variables:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Wait ~2 minutes for build to complete

---

## ✅ Step 8: Test Your Live App!

Your app is live at: `https://your-app.vercel.app`

### Test these features:
- ✅ Homepage loads
- ✅ Browse states (e.g., `/state/ca`)
- ✅ View a listing
- ✅ Sign up for an account
- ✅ Sign in

### Test accounts (from seed data):
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@rentusa.com | password123 |
| Landlord | landlord1@rentusa.com | password123 |
| Renter | renter@rentusa.com | password123 |

---

## 🎨 Optional: Enable Image Uploads with Cloudinary

### Quick Cloudinary Setup (5 min):

1. Go to [cloudinary.com](https://cloudinary.com) and sign up (free)
2. In Dashboard, copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

3. Add to Vercel Environment Variables:
```bash
CLOUDINARY_CLOUD_NAME = your-cloud-name
CLOUDINARY_API_KEY = your-api-key
CLOUDINARY_API_SECRET = your-api-secret
```

4. Redeploy on Vercel

Now landlords can upload property photos! 📸

---

## 🐛 Troubleshooting

### Build fails with "Cannot find module @prisma/client"
✅ **Fixed automatically** - Vercel runs `prisma generate` during build

### "Database connection error"
- ❌ Wrong: Using port 5432 in `DATABASE_URL`
- ✅ Correct: Use port 6543 with `?pgbouncer=true`

### "Invalid NEXTAUTH_SECRET"
- Make sure you generated a proper secret (32+ characters)
- Verify it's set in Vercel environment variables

### State pages showing 404
- Check Vercel build logs
- Should see: "Generating static pages (53/53)" during build

---

## 📊 What You Have Now:

| Feature | Status |
|---------|--------|
| 🌐 Live Website | ✅ Deployed on Vercel |
| 🗄️ Database | ✅ Supabase PostgreSQL |
| 🏠 120 Sample Listings | ✅ Across all 51 locations |
| 🔐 Authentication | ✅ Email + Password |
| 🔍 Search & Filters | ✅ Working |
| 🗺️ Interactive Maps | ✅ OpenStreetMap |
| 📱 Mobile Responsive | ✅ Tailwind CSS |
| 🚀 Auto Deploy | ✅ On git push |

---

## 🎯 Next Steps:

### Immediate:
- [ ] Test all features on live site
- [ ] Change default passwords for test accounts
- [ ] Add your own listings

### Soon:
- [ ] Setup Cloudinary for image uploads
- [ ] Add custom domain
- [ ] Configure Google OAuth
- [ ] Enable Stripe payments

### Later:
- [ ] Add analytics
- [ ] Setup error monitoring
- [ ] Email notifications
- [ ] SEO optimization

---

## 💡 Pro Tips:

1. **Auto-deploy on push:**
   ```powershell
   git add .
   git commit -m "Update feature"
   git push
   ```
   Vercel automatically builds and deploys!

2. **View logs:**
   Vercel Dashboard → Your Project → Deployments → Click deployment → Functions

3. **Database viewer:**
   Supabase Dashboard → Table Editor (view/edit data directly)

4. **Local development:**
   ```powershell
   npm run dev
   ```
   Uses your Supabase database (same as production)

---

## 🎉 Congratulations!

Your RentUSA platform is **LIVE** and **production-ready**! 🚀

- Live URL: `https://your-app.vercel.app`
- Free tier covers development and low-traffic
- Scales automatically with Vercel
- Database hosted on Supabase

Share it with the world! 🌎

---

## 📞 Need Help?

Check these files:
- `README.md` - Complete documentation
- `DEPLOYMENT.md` - Detailed deployment guide
- `BUILD.md` - Build troubleshooting

Or visit:
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
