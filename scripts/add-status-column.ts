/**
 * Add status column to Listing table
 * Adds rental-specific status tracking
 */

import { supabaseAdmin } from '@/lib/supabase'

async function addStatusColumn() {
  console.log('\n📝 Adding status column to Listing table...\n')

  try {
    // Add status column with default value 'AVAILABLE'
    const { error } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        ALTER TABLE "Listing" 
        ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'AVAILABLE';
        
        CREATE INDEX IF NOT EXISTS idx_listing_status ON "Listing"(status);
      `
    })

    if (error) {
      console.error('❌ Error adding column:', error)
      
      // Alternative: Use direct SQL if RPC doesn't work
      console.log('\n⚠️  Trying alternative method...\n')
      console.log('Please run this SQL manually in Supabase SQL Editor:')
      console.log(`
ALTER TABLE "Listing" 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'AVAILABLE';

CREATE INDEX IF NOT EXISTS idx_listing_status ON "Listing"(status);

-- Update existing records
UPDATE "Listing" SET status = 'AVAILABLE' WHERE status IS NULL;
      `)
      return
    }

    console.log('✅ Status column added successfully!')
    
    // Update existing listings to have 'AVAILABLE' status
    const { data, error: updateError } = await supabaseAdmin
      .from('Listing')
      .update({ status: 'AVAILABLE' })
      .is('status', null)

    if (updateError) {
      console.error('⚠️  Warning: Could not update existing records:', updateError)
    } else {
      console.log('✅ Updated existing listings with AVAILABLE status')
    }

    console.log('\n✨ Migration complete!')
    console.log('\nAvailable statuses:')
    console.log('  - AVAILABLE (ready to rent)')
    console.log('  - PENDING (application in review)')
    console.log('  - RESERVED (holding for specific tenant)')
    console.log('  - RENTED (currently occupied)')
    console.log('  - UNAVAILABLE (off market temporarily)')

  } catch (error) {
    console.error('❌ Migration failed:', error)
  }
}

addStatusColumn()
