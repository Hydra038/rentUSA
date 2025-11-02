import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function testPrismaAuth() {
  console.log('\n🔍 Testing Prisma authentication...\n')

  try {
    const user = await prisma.user.findUnique({
      where: { email: 'admin@rentusa.com' },
    })

    if (!user) {
      console.error('❌ User not found via Prisma')
      return
    }

    console.log('✅ User found via Prisma:')
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Has Password: ${!!user.hashedPassword}`)

    if (user.hashedPassword) {
      console.log(`   Password Hash (first 20 chars): ${user.hashedPassword.substring(0, 20)}...`)
    }

  } catch (error) {
    console.error('❌ Prisma Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testPrismaAuth()
