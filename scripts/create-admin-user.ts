/**
 * Create Admin User
 * Creates an admin account for testing
 */

import { createClient } from '@supabase/supabase-js'
import * as bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdminUser() {
  console.log('🔐 Creating admin user...\n')

  const adminEmail = 'admin@rentusa.com'
  const adminPassword = 'admin123'
  const adminName = 'Admin User'

  // Check if admin already exists
  const { data: existing } = await supabase
    .from('User')
    .select('*')
    .eq('email', adminEmail)
    .single()

  if (existing) {
    console.log('✅ Admin user already exists!')
    console.log('\n📧 Login Credentials:')
    console.log('   Email: admin@rentusa.com')
    console.log('   Password: admin123')
    console.log(`   Role: ${existing.role}`)
    console.log(`   ID: ${existing.id}`)
    console.log('\n🌐 Login at: http://localhost:3000/auth/signin')
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  // Create admin user
  const { data: admin, error } = await supabase
    .from('User')
    .insert({
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: 'ADMIN',
      emailVerified: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('❌ Error creating admin:', error.message)
    return
  }

  console.log('✅ Admin user created successfully!\n')
  console.log('📧 Login Credentials:')
  console.log('   Email: admin@rentusa.com')
  console.log('   Password: admin123')
  console.log('   Role: ADMIN')
  console.log(`   ID: ${admin.id}`)
  console.log('\n🌐 Login at: http://localhost:3000/auth/signin')
  console.log('🎯 Then visit: http://localhost:3000/dashboard/admin')
}

createAdminUser()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })
