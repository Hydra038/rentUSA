# Vercel Environment Variables Setup

## Critical: Set These in Vercel Dashboard

Go to your Vercel project → Settings → Environment Variables and add:

### 1. NEXTAUTH_URL (CRITICAL FOR AUTHENTICATION)
```
NEXTAUTH_URL=https://rent-usa.vercel.app
```
**This is the most important one!** Without this, NextAuth won't work properly in production.

### 2. NEXTAUTH_SECRET
```
NEXTAUTH_SECRET=a8f5e2c9b1d4f7a3e6c8b2d5f9a1c4e7b3d6f8a2c5e9b1d4f7a3e6c8b2d5f9a1
```
(Use the same value from your .env file)

### 3. Supabase Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://qjienjhenbpxppmzwxbl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqaWVuamhlbmJweHBwbXp3eGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNjA3OTksImV4cCI6MjA3NzYzNjc5OX0.hdzB-k355g6coSP3S_93NKj1geT0BVBewLggzhe6Ydw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqaWVuamhlbmJweHBwbXp3eGJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjA2MDc5OSwiZXhwIjoyMDc3NjM2Nzk5fQ.Douz_kCb1GPM-F4NzlkgFwX62I9gkaphvvzHKBbjgw8
```

### 4. Database URLs
```
DATABASE_URL=postgresql://postgres:Derq%40038!.@db.qjienjhenbpxppmzwxbl.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:Derq%40038!.@db.qjienjhenbpxppmzwxbl.supabase.co:5432/postgres
```

## Important Note:
Your production URL is: **https://rent-usa.vercel.app**
Make sure to use this exact URL for NEXTAUTH_URL (with https://)

## How to Add Variables in Vercel:

1. Go to https://vercel.com/dashboard
2. Select your project (rentUSA)
3. Go to **Settings** tab
4. Click **Environment Variables** in the left sidebar
5. For each variable:
   - Enter the **Key** (e.g., `NEXTAUTH_URL`)
   - Enter the **Value** 
   - Select which environments (Production, Preview, Development)
   - Click **Save**
6. After adding all variables, go to **Deployments** tab
7. Click the **...** menu on the latest deployment
8. Click **Redeploy**

## Why NEXTAUTH_URL is Critical:

NextAuth uses this to:
- Generate callback URLs
- Set secure cookies
- Handle OAuth redirects
- Create session tokens

Without it set to your production URL (`https://rent-usa.vercel.app`), authentication will fail or redirect to localhost.

## Quick Check:

After redeploying, test by:
1. Sign out completely
2. Try signing in again
3. Should redirect to dashboard immediately after successful sign-in
