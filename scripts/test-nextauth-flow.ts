import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcrypt'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function testSupabaseAuth() {
  console.log('\n🔍 Testing Supabase auth flow...\n')
  
  const email = 'admin@rentusa.com'
  const password = 'admin123'

  console.log('1. Querying user from Supabase...')
  const { data: user, error } = await supabaseAdmin
    .from('User')
    .select('*')
    .eq('email', email)
    .single()

  if (error) {
    console.error('❌ Query error:', error)
    return
  }

  if (!user) {
    console.error('❌ User not found')
    return
  }

  console.log('✅ User found:', {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    hasPassword: !!user.hashedPassword
  })

  if (!user.hashedPassword) {
    console.error('❌ No hashed password')
    return
  }

  console.log('\n2. Verifying password...')
  const isValid = await bcrypt.compare(password, user.hashedPassword)
  
  if (isValid) {
    console.log('✅ Password valid!')
    console.log('\n3. Return object for NextAuth:')
    console.log({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
  } else {
    console.error('❌ Invalid password')
  }
}

testSupabaseAuth()
