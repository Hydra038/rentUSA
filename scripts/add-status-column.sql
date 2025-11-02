-- Add status column to Listing table for rental status tracking
-- Run this in Supabase SQL Editor

-- Add the status column
ALTER TABLE "Listing" 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'AVAILABLE';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_listing_status ON "Listing"(status);

-- Update all existing listings to have AVAILABLE status
UPDATE "Listing" 
SET status = 'AVAILABLE' 
WHERE status IS NULL OR status = '';

-- Verify the changes
SELECT id, title, status, published, featured 
FROM "Listing" 
LIMIT 10;
