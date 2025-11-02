import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

// Load environment variables
dotenv.config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setAdminPassword() {
  console.log('\n🔐 Setting admin password...\n')

  const email = 'admin@rentusa.com'
  const newPassword = 'Rentusa@'

  // Hash the password
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  // Update the user's hashedPassword
  const { data, error } = await supabase
    .from('User')
    .update({ hashedPassword: hashedPassword })
    .eq('email', email)
    .select()

  if (error) {
    console.error('❌ Error updating password:', error)
    return
  }

  console.log('✅ Admin password updated successfully!\n')
  console.log('📧 Email: admin@rentusa.com')
  console.log('🔑 Password: Rentusa@')
  console.log('\n🌐 Login at: http://localhost:3000/auth/signin')
  console.log('📊 Admin Dashboard: http://localhost:3000/dashboard/admin\n')
}

setAdminPassword()
