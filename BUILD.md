# ✅ Build Checklist for RentUSA

## Current Status: Installing Dependencies

Follow these steps in order:

---

## Step 1: Install Dependencies ⏳ IN PROGRESS
```powershell
npm install
```
**Status:** Currently running...
**Time:** 2-5 minutes depending on internet speed
**What it does:** Downloads all npm packages (~500MB)

---

## Step 2: Generate Prisma Client ⏱️ NEXT
```powershell
npx prisma generate
```
**Why:** Creates TypeScript types from your Prisma schema
**Required before:** Building or running the app
**Time:** ~30 seconds

---

## Step 3: Setup Environment Variables ⏱️ REQUIRED
**File:** `.env` (already created)
**Action needed:** Update these values:

### Required for build:
```bash
NEXTAUTH_SECRET="your-secret-here"
```
Generate a secret:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Required for runtime (not build):
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/rentusa"
```

---

## Step 4: Build the Application ⏱️ AFTER STEPS 1-3
```powershell
npm run build
```
**What it does:**
- TypeScript compilation
- Next.js optimization
- Static page generation for all 51 state pages
- Production bundle creation

**Time:** 2-4 minutes
**Output:** `.next` folder with production build

---

## Step 5: Verify Build ⏱️ FINAL
```powershell
npm run start
```
Opens production server at http://localhost:3000

---

## 🔧 If Build Fails

### Error: "Cannot find module '@prisma/client'"
**Fix:**
```powershell
npx prisma generate
```

### Error: "NEXTAUTH_SECRET is required"
**Fix:** Update `.env` with a real secret (see Step 3)

### Error: "Database connection failed"
**Note:** Build works without database! Database only needed for runtime.

### Error: TypeScript compilation errors
**Fix:**
```powershell
npm install
npx prisma generate
npm run build
```

---

## 📊 Expected Build Output

```
✓ Linting and checking validity of types
✓ Creating an optimized production build
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages (53/53)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB        120 kB
├ ○ /listing/[id]                        8.1 kB        125 kB
├ ● /state/[state]                       6.5 kB        122 kB
│   ├ /state/al
│   ├ /state/ca
│   └ [+49 more paths]
└ ○ /api/auth/[...nextauth]              0 B           0 B

○  (Static)  automatically rendered as static HTML
●  (SSG)     automatically generated as static HTML + JSON
```

---

## 🎯 Next Steps After Successful Build

1. **Setup Database:**
   ```powershell
   npx prisma migrate dev
   npm run db:seed
   ```

2. **Run Development Server:**
   ```powershell
   npm run dev
   ```

3. **Or Run Production Server:**
   ```powershell
   npm run start
   ```

---

## 📝 Notes

- Build can complete even without database connection
- All TypeScript errors from missing deps will resolve after `npm install`
- State pages (51 total) are pre-generated at build time (SSG)
- Production build is optimized and minified
- First build takes longer due to Next.js cache creation

---

## ⚡ Quick Commands Reference

```powershell
# Full setup from scratch
npm install
npx prisma generate
npm run build

# With database
npx prisma migrate dev
npm run db:seed
npm run start

# Development mode (recommended for local work)
npm run dev
```
