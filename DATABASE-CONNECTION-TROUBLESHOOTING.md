# Database Connection Troubleshooting

## Issue: Featured Listings Not Showing

The featured listings aren't showing because:
1. ✅ The database hasn't been set up yet (no tables)
2. ✅ The database connection is failing

## Steps to Fix:

### 1. Check Supabase Project Status

1. Go to https://supabase.com/dashboard
2. Find your project: `qjienjhenbpxppmzwxbl`
3. **Check if it's PAUSED** (free tier projects pause after inactivity)
4. If paused, click **"Resume Project"** and wait 2-3 minutes

### 2. Get Correct Connection String

1. In Supabase Dashboard → **Project Settings** → **Database**
2. Scroll to **Connection String** section
3. Select **URI** tab
4. Copy the string (it looks like):
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```
5. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with your actual database password
6. **URL-encode special characters**:
   - `@` becomes `%40`
   - `!` becomes `%21`
   - `#` becomes `%23`
   - `$` becomes `%24`

### 3. Update .env File

Replace both `DATABASE_URL` and `DIRECT_URL` with your correct connection string:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.qjienjhenbpxppmzwxbl.supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.qjienjhenbpxppmzwxbl.supabase.co:5432/postgres?sslmode=require"
```

### 4. Test Connection

```powershell
# Test if connection works
npx prisma db pull
```

If successful, you should see: ✔ Introspected X models

### 5. Run SQL Setup Script

1. Open Supabase Dashboard → **SQL Editor**
2. Copy ALL content from `supabase-setup.sql` (319 lines)
3. Paste and click **Run**
4. Wait for success message

### 6. Seed Database

```powershell
npm run db:seed
```

This creates:
- 51 states (all 50 + DC)
- ~50 cities
- 120 listings (many marked as featured)
- ~480 professional apartment photos
- 12 test users

### 7. Restart Dev Server

```powershell
npm run dev
```

Visit http://localhost:3000 - you should now see featured listings!

## Common Issues:

### "Can't reach database server"
- ✅ Project is paused → Resume it
- ✅ Wrong connection string → Get fresh one from dashboard
- ✅ Special characters in password → URL-encode them
- ✅ Firewall blocking → Try different network

### "relation does not exist"
- ✅ Tables not created → Run SQL script in Supabase
- ✅ Wrong database → Check you're using "postgres" database

### Featured listings still empty
- ✅ Database not seeded → Run `npm run db:seed`
- ✅ Seed script failed → Check error messages

## Your Current Setup:

**Database Host**: `db.qjienjhenbpxppmzwxbl.supabase.co`
**Port**: `5432`
**Database**: `postgres`
**Password**: `Derq@038!.` (needs URL encoding: `Derq%40038!.`)

**Correct Connection String**:
```
postgresql://postgres:Derq%40038!.@db.qjienjhenbpxppmzwxbl.supabase.co:5432/postgres?sslmode=require
```

## Test Credentials (after seeding):

```
Admin: admin@rentusa.com / password123
Landlord: landlord1@rentusa.com / password123
Renter: renter@rentusa.com / password123
```
