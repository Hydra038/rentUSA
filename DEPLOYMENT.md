# 🚀 Deploying RentUSA to Vercel + Supabase

Complete guide for deploying your RentUSA platform to production.

---

## Step 1: Setup Supabase Database

### 1.1 Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose a project name: `rentusa` (or your choice)
4. Choose a **strong database password** (save it!)
5. Choose a region close to your users (e.g., `us-east-1`)
6. Click "Create new project"

### 1.2 Get Connection Strings
1. In Supabase Dashboard, go to **Settings** → **Database**
2. Scroll to **Connection String** section
3. Copy both connection strings:

**Connection pooling (for app runtime):**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Direct connection (for migrations):**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

### 1.3 Update Local .env
```bash
DATABASE_URL="your-pooler-connection-string-here"
DIRECT_URL="your-direct-connection-string-here"
```

Replace `[PASSWORD]` with your actual database password!

---

## Step 2: Run Database Migrations

```powershell
# Generate Prisma Client
npx prisma generate

# Run migrations to create all tables
npx prisma migrate deploy

# Seed the database with sample data
npm run db:seed
```

**Verify in Supabase:**
- Go to **Table Editor** in Supabase Dashboard
- You should see: `User`, `State`, `City`, `Listing`, `Photo`, etc.

---

## Step 3: Generate NextAuth Secret

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and update your `.env`:
```bash
NEXTAUTH_SECRET="paste-generated-secret-here"
```

---

## Step 4: Setup Cloudinary (Optional but Recommended)

### 4.1 Create Cloudinary Account
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up (free tier includes 25GB storage)
3. Go to Dashboard

### 4.2 Get Credentials
Copy from your Dashboard:
- **Cloud Name**
- **API Key**
- **API Secret**

### 4.3 Update .env
```bash
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

---

## Step 5: Deploy to Vercel

### 5.1 Install Vercel CLI (Optional)
```powershell
npm install -g vercel
```

### 5.2 Push Code to GitHub
```powershell
git init
git add .
git commit -m "Initial commit - RentUSA platform"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/rentusa.git
git push -u origin main
```

### 5.3 Deploy via Vercel Dashboard
1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### 5.4 Add Environment Variables in Vercel
Click "Environment Variables" and add:

```bash
# Database (Required)
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres

# NextAuth (Required)
NEXTAUTH_SECRET=your-generated-secret-from-step-3
NEXTAUTH_URL=https://your-app.vercel.app

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe (Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 5.5 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Your app will be live at `https://your-app.vercel.app`

---

## Step 6: Post-Deployment Setup

### 6.1 Update NEXTAUTH_URL
After first deployment, update the environment variable:
```bash
NEXTAUTH_URL=https://your-actual-vercel-url.vercel.app
```

### 6.2 Setup Google OAuth (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
6. Add Client ID and Secret to Vercel environment variables

### 6.3 Setup Stripe Webhooks (Optional)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers** → **Webhooks**
3. Add endpoint:
   ```
   https://your-app.vercel.app/api/stripe/webhook
   ```
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy webhook signing secret and add to Vercel as `STRIPE_WEBHOOK_SECRET`

---

## Step 7: Verify Deployment

### 7.1 Test Core Features
- ✅ Homepage loads
- ✅ Search works
- ✅ State pages load (e.g., `/state/ca`)
- ✅ Individual listings load
- ✅ Sign up/Sign in works
- ✅ Landlord can create listings (if Cloudinary configured)

### 7.2 Test Database Connection
1. Try signing up a new user
2. Check Supabase → Table Editor → `User` table
3. You should see the new user

### 7.3 Monitor Logs
- In Vercel Dashboard, go to your project
- Click "Deployments" → Select your deployment → "Functions"
- View logs for any errors

---

## 🔄 Continuous Deployment

Once set up, Vercel automatically deploys when you push to GitHub:

```powershell
git add .
git commit -m "Update feature"
git push
```

Vercel will automatically:
1. Build your app
2. Run tests
3. Deploy to production

---

## 🎯 Quick Deploy Checklist

- [ ] Supabase project created
- [ ] Connection strings copied to `.env`
- [ ] Database migrations run (`npx prisma migrate deploy`)
- [ ] Database seeded (`npm run db:seed`)
- [ ] `NEXTAUTH_SECRET` generated
- [ ] Cloudinary account created (optional)
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added to Vercel
- [ ] First deployment successful
- [ ] `NEXTAUTH_URL` updated with actual URL
- [ ] Google OAuth configured (optional)
- [ ] Stripe webhooks configured (optional)

---

## 🐛 Troubleshooting

### Build fails on Vercel
**Error:** "Cannot find module '@prisma/client'"
**Fix:** Vercel runs `prisma generate` automatically. Check if `schema.prisma` has `directUrl`.

### Database connection fails
**Error:** "Can't reach database server"
**Fix:** 
1. Verify `DATABASE_URL` includes `?pgbouncer=true`
2. Check Supabase project isn't paused
3. Use connection pooler URL (port 6543), not direct (port 5432)

### NextAuth errors
**Error:** "No secret provided"
**Fix:** Make sure `NEXTAUTH_SECRET` is set in Vercel environment variables

### Images not uploading
**Fix:** 
1. Verify Cloudinary credentials in Vercel
2. Check Cloudinary dashboard for errors
3. Ensure upload preset is created

### State pages 404
**Fix:** This shouldn't happen with App Router. Check Vercel build logs for errors during static generation.

---

## 📊 Performance Optimization

### Edge Runtime (Optional)
For faster response times, you can enable Edge Runtime for API routes:

```typescript
// app/api/listings/route.ts
export const runtime = 'edge'
```

### Database Connection Pooling
Already configured with Supabase's built-in connection pooler!

### Image Optimization
Next.js automatically optimizes images. Make sure to use the `<Image>` component.

### Caching
- Static pages (state pages) are cached automatically
- Add `revalidate` for ISR:
```typescript
export const revalidate = 3600 // Revalidate every hour
```

---

## 🔐 Security Checklist

- [ ] Strong database password
- [ ] `NEXTAUTH_SECRET` is long and random (32+ characters)
- [ ] Environment variables not committed to Git
- [ ] Cloudinary upload presets secured
- [ ] Stripe webhook signature verified
- [ ] CORS configured if needed
- [ ] Rate limiting considered for API routes

---

## 💰 Cost Estimates (Free Tier)

| Service | Free Tier | Notes |
|---------|-----------|-------|
| **Vercel** | 100GB bandwidth/month | Unlimited deployments |
| **Supabase** | 500MB database, 1GB file storage | Pauses after 7 days inactivity |
| **Cloudinary** | 25GB storage, 25GB bandwidth | 25,000 transformations/month |
| **Stripe** | Free (pay per transaction) | 2.9% + $0.30 per transaction |

**Total:** $0/month for development and low-traffic production!

---

## 🎉 You're Live!

Your RentUSA platform is now:
- ✅ Deployed to Vercel (global CDN)
- ✅ Connected to Supabase (PostgreSQL)
- ✅ Automatically deploys on git push
- ✅ HTTPS enabled
- ✅ Scalable and production-ready

Share your link: `https://your-app.vercel.app` 🚀

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs

---

## 🔄 Next Features to Add

After successful deployment, consider adding:
- [ ] Email notifications (SendGrid, Resend)
- [ ] SMS notifications (Twilio)
- [ ] Analytics (Google Analytics, Vercel Analytics)
- [ ] Error tracking (Sentry)
- [ ] Custom domain
- [ ] SEO optimization
- [ ] Performance monitoring
