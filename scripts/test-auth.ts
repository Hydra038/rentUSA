import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

// Load environment variables
dotenv.config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testAuth() {
  console.log('\n🔍 Testing authentication...\n')

  const email = 'admin@rentusa.com'
  const password = 'admin123'

  // Get user from database
  const { data: user, error } = await supabase
    .from('User')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
    console.error('❌ User not found:', error)
    return
  }

  console.log('✅ User found:')
  console.log(`   ID: ${user.id}`)
  console.log(`   Email: ${user.email}`)
  console.log(`   Name: ${user.name}`)
  console.log(`   Role: ${user.role}`)
  console.log(`   Has Password: ${!!user.hashedPassword}`)
  
  if (!user.hashedPassword) {
    console.error('\n❌ No hashed password found!')
    return
  }

  // Test password comparison
  const isValid = await bcrypt.compare(password, user.hashedPassword)
  
  if (isValid) {
    console.log('\n✅ Password verification: SUCCESS')
    console.log('   The password "admin123" matches the hashed password')
  } else {
    console.log('\n❌ Password verification: FAILED')
    console.log('   The password does not match')
  }

  // Test with wrong password
  const isWrong = await bcrypt.compare('wrongpassword', user.hashedPassword)
  console.log(`\n🔒 Wrong password test: ${isWrong ? 'FAILED (should be false)' : 'PASSED'}`)
}

testAuth()
