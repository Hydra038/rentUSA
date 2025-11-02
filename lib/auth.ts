/**
 * NextAuth Configuration
 * Handles email/password authentication with Supabase
 * with role-based session management
 */

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with service role for admin operations
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

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  providers: [
    // Email/Password Provider using Supabase
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🔐 Auth attempt for:', credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.error('❌ Missing credentials')
          throw new Error('Missing credentials')
        }

        // Query Supabase for user
        console.log('📊 Querying Supabase...')
        const { data: user, error } = await supabaseAdmin
          .from('User')
          .select('*')
          .eq('email', credentials.email)
          .single()

        if (error) {
          console.error('❌ Supabase error:', error)
          throw new Error('Invalid credentials')
        }

        if (!user) {
          console.error('❌ User not found')
          throw new Error('Invalid credentials')
        }

        console.log('✅ User found:', user.email, 'Role:', user.role)

        if (!user.hashedPassword) {
          console.error('❌ No password hash')
          throw new Error('Invalid credentials')
        }

        // Verify password
        console.log('🔑 Verifying password...')
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )

        if (!isPasswordValid) {
          console.error('❌ Invalid password')
          throw new Error('Invalid credentials')
        }

        console.log('✅ Auth successful!')
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    // Include role in JWT token
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      
      // Handle session updates
      if (trigger === 'update' && session?.user) {
        token.name = session.user.name
        token.email = session.user.email
      }
      
      return token
    },
    
    // Include role in session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}
