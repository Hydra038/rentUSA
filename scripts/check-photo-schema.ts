/**
 * Check Photo Table Schema
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkPhotoSchema() {
  // Get a sample photo to see the structure
  const { data: photo } = await supabase
    .from('Photo')
    .select('*')
    .limit(1)
    .single()

  if (photo) {
    console.log('📋 Photo table columns:')
    Object.keys(photo).sort().forEach(key => {
      console.log(`   ${key}: ${typeof photo[key]}`)
    })
  }
}

checkPhotoSchema()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
