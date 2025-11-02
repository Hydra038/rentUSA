import { supabaseAdmin } from '../lib/supabase'

async function checkInquiries() {
  console.log('🔍 Checking inquiries in database...\n')
  
  // Check lowercase table name (Prisma mapping)
  const { data: inquiriesLower, error: errorLower } = await supabaseAdmin
    .from('inquiries')
    .select('*')
    .limit(5)
  
  console.log('📊 Lowercase "inquiries" table:')
  if (errorLower) {
    console.error('❌ Error:', errorLower.message)
  } else {
    console.log(`✅ Found ${inquiriesLower?.length || 0} inquiries`)
    if (inquiriesLower && inquiriesLower.length > 0) {
      console.log('\nSample inquiry:')
      console.log('  ID:', inquiriesLower[0].id)
      console.log('  Email:', inquiriesLower[0].email)
      console.log('  User ID:', inquiriesLower[0].userId)
      console.log('  Status:', inquiriesLower[0].status)
      console.log('  Listing ID:', inquiriesLower[0].listingId)
    }
  }
  
  console.log('\n---\n')
  
  // Check uppercase table name
  const { data: inquiriesUpper, error: errorUpper } = await supabaseAdmin
    .from('Inquiry')
    .select('*')
    .limit(5)
  
  console.log('📊 Uppercase "Inquiry" table:')
  if (errorUpper) {
    console.error('❌ Error:', errorUpper.message)
  } else {
    console.log(`✅ Found ${inquiriesUpper?.length || 0} inquiries`)
    if (inquiriesUpper && inquiriesUpper.length > 0) {
      console.log('\nSample inquiry:')
      console.log('  ID:', inquiriesUpper[0].id)
      console.log('  Email:', inquiriesUpper[0].email)
    }
  }
}

checkInquiries()
