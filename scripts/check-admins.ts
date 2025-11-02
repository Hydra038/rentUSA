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

async function checkAdmins() {
  try {
    console.log('\n🔍 Checking for admin users in database...\n')

    // Get all users
    const { data: allUsers, error } = await supabase
      .from('User')
      .select('id, name, email, role, createdAt, hashedPassword')
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('❌ Error fetching users:', error)
      return
    }

    if (!allUsers || allUsers.length === 0) {
      console.log('⚠️  No users found in database')
      return
    }

    console.log(`📊 Total users in database: ${allUsers.length}\n`)

    // Filter admin users
    const adminUsers = allUsers.filter(user => user.role === 'ADMIN')

    if (adminUsers.length === 0) {
      console.log('⚠️  No ADMIN users found in the database!')
      console.log('\nTo create an admin user, you can:')
      console.log('1. Run: npx tsx scripts/create-admin-user.ts')
      console.log('2. Or sign up via the UI and manually change role in database\n')
    } else {
      console.log(`✅ Found ${adminUsers.length} ADMIN user(s):\n`)
      adminUsers.forEach((admin, index) => {
        console.log(`${index + 1}. Admin User:`)
        console.log(`   ID: ${admin.id}`)
        console.log(`   Name: ${admin.name || '(not set)'}`)
        console.log(`   Email: ${admin.email}`)
        console.log(`   Has Password: ${admin.hashedPassword ? '✓ Yes' : '✗ No'}`)
        console.log(`   Created: ${admin.createdAt.toLocaleString()}`)
        console.log('')
      })
    }

    // Show all users by role
    console.log('\n📋 Users by Role:')
    const roleGroups = allUsers.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(roleGroups).forEach(([role, count]) => {
      console.log(`   ${role}: ${count}`)
    })

    console.log('\n✅ Database check complete!\n')

  } catch (error) {
    console.error('❌ Error checking database:', error)
  }
}

checkAdmins()
