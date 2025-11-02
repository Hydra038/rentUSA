import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

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

async function findUsers() {
  console.log('\n🔍 Finding existing users...\n')

  const { data: users, error } = await supabase
    .from('User')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('❌ Error fetching users:', error)
    return
  }

  if (!users || users.length === 0) {
    console.log('⚠️  No users found in database')
    return
  }

  console.log(`✅ Found ${users.length} user(s):\n`)

  users.forEach((user, index) => {
    console.log(`User ${index + 1}:`)
    console.log(`  ID: ${user.id}`)
    console.log(`  Name: ${user.name}`)
    console.log(`  Email: ${user.email}`)
    console.log(`  Role: ${user.role}`)
    console.log(`  Created: ${new Date(user.createdAt).toLocaleString()}`)
    console.log(`  Updated: ${new Date(user.updatedAt).toLocaleString()}`)
    console.log('')
  })

  console.log('📝 NOTE: Passwords are hashed in the database.')
  console.log('You need to either:')
  console.log('1. Use the sign-up page to create a new admin user')
  console.log('2. Reset password for an existing user')
  console.log('3. Create a new user with a known password\n')

  // Check if any admin users exist
  const adminUsers = users.filter(u => u.role === 'ADMIN')
  if (adminUsers.length > 0) {
    console.log(`✅ Found ${adminUsers.length} ADMIN user(s):`)
    adminUsers.forEach(admin => {
      console.log(`   - ${admin.email} (${admin.name})`)
    })
  } else {
    console.log('⚠️  No ADMIN users found. You need to create one!')
  }
}

findUsers()
