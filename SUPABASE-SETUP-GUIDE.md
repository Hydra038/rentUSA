# 🎯 Quick Setup Guide - Manual SQL in Supabase

## Step-by-Step Instructions

### **Step 1: Open Supabase SQL Editor**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `qjienjhenbpxppmzwxbl`
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New query"**

---

### **Step 2: Run the SQL Script**

1. Open the file: `supabase-setup.sql` in this project
2. **Copy ALL the SQL code** (Ctrl+A, Ctrl+C)
3. **Paste it into the Supabase SQL Editor**
4. Click **"Run"** button (bottom right)

**What this does:**
- ✅ Creates all 10 tables (User, Account, Session, State, City, Listing, Photo, Inquiry, SavedListing, Subscription)
- ✅ Creates all necessary indexes for performance
- ✅ Sets up foreign key relationships
- ✅ Adds triggers for `updatedAt` timestamps
- ✅ Enables Row Level Security (RLS)
- ✅ Sets up basic access policies

---

### **Step 3: Verify Tables Were Created**

1. Click **"Table Editor"** in Supabase sidebar
2. You should see these tables:
   - ✅ User
   - ✅ Account
   - ✅ Session
   - ✅ VerificationToken
   - ✅ State
   - ✅ City
   - ✅ Listing
   - ✅ Photo
   - ✅ Inquiry
   - ✅ SavedListing
   - ✅ Subscription

---

### **Step 4: Seed the Database**

Back in your VS Code terminal:

```powershell
npm run db:seed
```

This will populate:
- **51 states** (all 50 + DC)
- **~50 cities** across major states
- **120 property listings** with real apartment photos
- **~480 photos** (3-5 per listing)
- **12 test users** (1 admin, 10 landlords, 1 renter)
- **20 sample inquiries**
- **10 saved listings**

---

### **Step 5: Test Your Application**

Visit: http://localhost:3000

You should now see:
- 🏙️ Beautiful hero with Chicago skyline background
- 🏠 Featured listings with real apartment photos
- 🔍 Working search functionality
- 🗺️ State browsing cards

---

## 🔐 Test Login Credentials

After seeding, use these accounts:

**Admin Account:**
```
Email: admin@rentusa.com
Password: password123
```

**Landlord Account:**
```
Email: landlord1@rentusa.com
Password: password123
```

**Renter Account:**
```
Email: renter@rentusa.com
Password: password123
```

---

## 🔍 Search Bar - Now Fixed!

The search bar now matches Apartments.com exactly:
- ✅ **Rounded pill shape** (rounded-full)
- ✅ **Clean white background**
- ✅ **Simple placeholder**: "Chicago, IL"
- ✅ **Green search icon** (like Apartments.com logo)
- ✅ **Centered on page**
- ✅ **Large, clickable**
- ✅ **Smooth shadow** (shadow-xl)

---

## 🎨 What Changed in SearchBar

**Before:**
- Blue button with text
- MapPin icon on left
- Squared corners
- Long placeholder text

**After (Apartments.com style):**
- Round pill shape
- Green search icon only
- Centered input
- Simple "Chicago, IL" placeholder
- Cleaner, more minimal

---

## 📊 Database Structure

```
User (authentication)
├── Account (OAuth providers)
├── Session (active sessions)
├── Listing (properties)
│   ├── Photo (property images)
│   ├── Inquiry (messages from renters)
│   └── SavedListing (favorites)
└── Subscription (Stripe payments)

State
└── City
    └── Listing (properties in that city)
```

---

## ⚡ Performance Features

The SQL script includes:
- **21 indexes** for fast queries
- **Foreign key constraints** for data integrity
- **Automatic timestamp updates** via triggers
- **Row Level Security** for multi-tenant access
- **Optimized for 100,000+ listings**

---

## 🚨 Troubleshooting

### "Error: relation already exists"
**Solution:** Tables already created, you're good to go! Skip to Step 4.

### "Error: permission denied"
**Solution:** Make sure you're in the SQL Editor, not the Table Editor.

### Seed fails with connection error
**Solution:** Check your `.env` file has correct DATABASE_URL

### No images showing
**Solution:** Make sure `images.unsplash.com` is in `next.config.js` (already configured!)

---

## ✅ Success Checklist

- [ ] SQL script ran without errors
- [ ] All 11 tables appear in Table Editor
- [ ] Seed script completed (120 listings created)
- [ ] Homepage loads with hero background
- [ ] Featured listings show apartment photos
- [ ] Search bar is rounded and has green icon
- [ ] Can log in with test credentials

---

## 🎉 Next Steps

Once everything is working:

1. **Test the search** - Try searching for cities
2. **Browse states** - Click on state cards
3. **View listings** - Click on apartment cards
4. **Test auth** - Sign in with test accounts
5. **Check dashboards** - Landlord/Renter/Admin views

---

## 📞 Need Help?

If you encounter issues:
1. Check Supabase logs (Logs → Postgres logs)
2. Verify `.env` connection string
3. Make sure dev server is running (`npm run dev`)
4. Check browser console for errors

Your RentUSA platform is now ready to go! 🚀
