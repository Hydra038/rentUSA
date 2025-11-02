-- =====================================================
-- RentUSA Database Setup - Supabase SQL Editor
-- =====================================================
-- Run this entire script in Supabase SQL Editor
-- This will create all tables and enable RLS policies
-- =====================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CREATE ENUMS
-- =====================================================

-- User Role Enum
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('ADMIN', 'LANDLORD', 'RENTER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Property Type Enum
DO $$ BEGIN
    CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'HOUSE', 'CONDO', 'TOWNHOUSE', 'STUDIO', 'LOFT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Inquiry Status Enum
DO $$ BEGIN
    CREATE TYPE "InquiryStatus" AS ENUM ('PENDING', 'RESPONDED', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 2. CREATE TABLES
-- =====================================================

-- Users Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    "emailVerified" TIMESTAMP(3),
    image TEXT,
    "hashedPassword" TEXT,
    role "Role" NOT NULL DEFAULT 'RENTER',
    phone TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- NextAuth Account Table
CREATE TABLE IF NOT EXISTS "Account" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Account_provider_providerAccountId_key" UNIQUE (provider, "providerAccountId")
);

-- NextAuth Session Table
CREATE TABLE IF NOT EXISTS "Session" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "sessionToken" TEXT UNIQUE NOT NULL,
    "userId" TEXT NOT NULL,
    expires TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- NextAuth Verification Token Table
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VerificationToken_identifier_token_key" UNIQUE (identifier, token)
);

-- States Table
CREATE TABLE IF NOT EXISTS "State" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT UNIQUE NOT NULL,
    code TEXT UNIQUE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Cities Table
CREATE TABLE IF NOT EXISTS "City" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "City_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "City_slug_stateId_key" UNIQUE (slug, "stateId")
);

-- Listings Table
CREATE TABLE IF NOT EXISTS "Listing" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    zip TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms DECIMAL(3,1) NOT NULL,
    sqft INTEGER,
    "propertyType" "PropertyType" NOT NULL DEFAULT 'APARTMENT',
    "petsAllowed" BOOLEAN NOT NULL DEFAULT false,
    amenities TEXT[],
    featured BOOLEAN NOT NULL DEFAULT false,
    published BOOLEAN NOT NULL DEFAULT false,
    "availableDate" TIMESTAMP(3) NOT NULL,
    "listedByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Listing_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Listing_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Listing_listedByUserId_fkey" FOREIGN KEY ("listedByUserId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Photos Table
CREATE TABLE IF NOT EXISTS "Photo" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "listingId" TEXT NOT NULL,
    url TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Photo_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Inquiries Table
CREATE TABLE IF NOT EXISTS "Inquiry" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "listingId" TEXT NOT NULL,
    "userId" TEXT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status "InquiryStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Inquiry_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Inquiry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Saved Listings Table
CREATE TABLE IF NOT EXISTS "SavedListing" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SavedListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SavedListing_userId_listingId_key" UNIQUE ("userId", "listingId")
);

-- Subscriptions Table (for future Stripe integration)
CREATE TABLE IF NOT EXISTS "Subscription" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT UNIQUE NOT NULL,
    "stripeCustomerId" TEXT UNIQUE NOT NULL,
    "stripeSubscriptionId" TEXT UNIQUE NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    status TEXT NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- =====================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"(email);
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"(role);

-- Account indexes
CREATE INDEX IF NOT EXISTS "Account_userId_idx" ON "Account"("userId");

-- Session indexes
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");
CREATE INDEX IF NOT EXISTS "Session_sessionToken_idx" ON "Session"("sessionToken");

-- State indexes
CREATE INDEX IF NOT EXISTS "State_code_idx" ON "State"(code);

-- City indexes
CREATE INDEX IF NOT EXISTS "City_stateId_idx" ON "City"("stateId");
CREATE INDEX IF NOT EXISTS "City_slug_idx" ON "City"(slug);

-- Listing indexes
CREATE INDEX IF NOT EXISTS "Listing_cityId_idx" ON "Listing"("cityId");
CREATE INDEX IF NOT EXISTS "Listing_stateId_idx" ON "Listing"("stateId");
CREATE INDEX IF NOT EXISTS "Listing_listedByUserId_idx" ON "Listing"("listedByUserId");
CREATE INDEX IF NOT EXISTS "Listing_published_idx" ON "Listing"(published);
CREATE INDEX IF NOT EXISTS "Listing_featured_idx" ON "Listing"(featured);
CREATE INDEX IF NOT EXISTS "Listing_price_idx" ON "Listing"(price);
CREATE INDEX IF NOT EXISTS "Listing_bedrooms_idx" ON "Listing"(bedrooms);
CREATE INDEX IF NOT EXISTS "Listing_propertyType_idx" ON "Listing"("propertyType");

-- Photo indexes
CREATE INDEX IF NOT EXISTS "Photo_listingId_idx" ON "Photo"("listingId");
CREATE INDEX IF NOT EXISTS "Photo_isPrimary_idx" ON "Photo"("isPrimary");

-- Inquiry indexes
CREATE INDEX IF NOT EXISTS "Inquiry_listingId_idx" ON "Inquiry"("listingId");
CREATE INDEX IF NOT EXISTS "Inquiry_userId_idx" ON "Inquiry"("userId");
CREATE INDEX IF NOT EXISTS "Inquiry_status_idx" ON "Inquiry"(status);

-- SavedListing indexes
CREATE INDEX IF NOT EXISTS "SavedListing_userId_idx" ON "SavedListing"("userId");
CREATE INDEX IF NOT EXISTS "SavedListing_listingId_idx" ON "SavedListing"("listingId");

-- Subscription indexes
CREATE INDEX IF NOT EXISTS "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX IF NOT EXISTS "Subscription_stripeCustomerId_idx" ON "Subscription"("stripeCustomerId");

-- =====================================================
-- 4. CREATE UPDATE TRIGGERS
-- =====================================================

-- Function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updatedAt
DROP TRIGGER IF EXISTS update_user_updated_at ON "User";
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_listing_updated_at ON "Listing";
CREATE TRIGGER update_listing_updated_at BEFORE UPDATE ON "Listing"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscription_updated_at ON "Subscription";
CREATE TRIGGER update_subscription_updated_at BEFORE UPDATE ON "Subscription"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. ENABLE ROW LEVEL SECURITY (Optional but recommended)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "State" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "City" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Listing" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Photo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Inquiry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SavedListing" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;

-- Public read access for states and cities
CREATE POLICY "States are viewable by everyone" ON "State" FOR SELECT USING (true);
CREATE POLICY "Cities are viewable by everyone" ON "City" FOR SELECT USING (true);

-- Published listings are viewable by everyone
CREATE POLICY "Published listings are viewable by everyone" ON "Listing" FOR SELECT USING (published = true);

-- Photos for published listings are viewable by everyone
CREATE POLICY "Photos for published listings are viewable" ON "Photo" FOR SELECT 
    USING (EXISTS (SELECT 1 FROM "Listing" WHERE id = "Photo"."listingId" AND published = true));

-- Users can view their own data
CREATE POLICY "Users can view own profile" ON "User" FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can update own profile" ON "User" FOR UPDATE USING (auth.uid()::text = id);

-- =====================================================
-- 6. GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Grant all privileges on all tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant all privileges on all sequences
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Next step: Run the seed script with: npm run db:seed
-- =====================================================

SELECT 'Database setup completed successfully!' as message;
