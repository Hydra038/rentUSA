import { supabaseAdmin } from './lib/supabase.ts'

async function checkInquiries() {
  console.log('🔍 Checking inquiries in database...\n')
  
  // Try lowercase table name (Prisma mapping)
  const { data: inquiriesLower, error: errorLower } = await supabaseAdmin
    .from('inquiries')
    .select('*')
    .limit(5)
  
  console.log('📊 Lowercase "inquiries" table:')
  if (errorLower) {
    console.error(' Error:', errorLower.message)
  } else {
    console.log( Found  inquiries)
    if (inquiriesLower && inquiriesLower.length > 0) {
      console.log('Sample inquiry:', inquiriesLower[0])
    }
  }
  
  console.log('\n---\n')
  
  // Try uppercase table name
  const { data: inquiriesUpper, error: errorUpper } = await supabaseAdmin
    .from('Inquiry')
    .select('*')
    .limit(5)
  
  console.log(' Uppercase "Inquiry" table:')
  if (errorUpper) {
    console.error(' Error:', errorUpper.message)
  } else {
    console.log( Found  inquiries)
    if (inquiriesUpper && inquiriesUpper.length > 0) {
      console.log('Sample inquiry:', inquiriesUpper[0])
    }
  }
}

checkInquiries()
