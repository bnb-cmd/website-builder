import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { authConfig } from '../config/environment'

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    console.log('Creating test user...')
    
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })
    
    if (existingUser) {
      console.log('Test user already exists:', existingUser.email)
      return existingUser
    }
    
    // Create test user
    const hashedPassword = await bcrypt.hash('password123', authConfig.bcryptRounds)
    
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        phone: '+92-300-1234567',
        businessType: 'SERVICE',
        city: 'Karachi',
        companyName: 'Test Company',
        role: 'USER',
        status: 'ACTIVE'
      }
    })
    
    console.log('Test user created successfully:', {
      id: user.id,
      email: user.email,
      name: user.name
    })
    
    console.log('\nLogin credentials:')
    console.log('Email: test@example.com')
    console.log('Password: password123')
    
    return user
  } catch (error) {
    console.error('Error creating test user:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  createTestUser()
    .then(() => {
      console.log('Script completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Script failed:', error)
      process.exit(1)
    })
}

export { createTestUser }
