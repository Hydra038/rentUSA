-- Add Lease Length Feature to RentUSA
-- Run this in your Supabase SQL Editor

-- Step 1: Create LeaseLength enum type
CREATE TYPE "LeaseLength" AS ENUM (
  'ONE_MONTH',
  'THREE_MONTHS',
  'SIX_MONTHS',
  'NINE_MONTHS',
  'TWELVE_MONTHS',
  'EIGHTEEN_MONTHS',
  'TWENTY_FOUR_MONTHS',
  'MONTH_TO_MONTH',
  'FLEXIBLE'
);

-- Step 2: Add leaseLength column to Listing table
ALTER TABLE "Listing" 
ADD COLUMN "leaseLength" "LeaseLength";

-- Step 3: Add index for better query performance
CREATE INDEX "idx_listing_lease_length" ON "Listing"("leaseLength");

-- Step 4: (Optional) Set default values for existing listings
-- Uncomment if you want to set a default for existing listings
-- UPDATE "Listing" SET "leaseLength" = 'TWELVE_MONTHS' WHERE "leaseLength" IS NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Listing' AND column_name = 'leaseLength';
