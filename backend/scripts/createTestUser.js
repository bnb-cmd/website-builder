const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: 'dev-user-id' }
    })

    if (existingUser) {
      console.log('✅ Test user already exists:', existingUser.email)
      return existingUser
    }

    // Create test user
    const user = await prisma.user.create({
      data: {
        id: 'dev-user-id',
        email: 'dev@example.com',
        name: 'Development User',
        password: 'hashed-password', // In real app, this would be properly hashed
        role: 'USER',
        status: 'ACTIVE'
      }
    })

    console.log('✅ Test user created:', user.email)
    return user
  } catch (error) {
    console.error('❌ Error creating test user:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
