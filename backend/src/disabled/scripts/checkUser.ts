import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function checkUser() {
  try {
    console.log('Checking test user...')
    
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })
    
    if (!user) {
      console.log('No user found with email: test@example.com')
      return
    }
    
    console.log('User found:', {
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt
    })
    
    // Test password validation
    const testPassword = 'password123'
    const isValid = await bcrypt.compare(testPassword, user.password)
    console.log('Password validation result:', isValid)
    
    // Let's also test with a fresh hash
    const freshHash = await bcrypt.hash(testPassword, 12)
    const freshValidation = await bcrypt.compare(testPassword, freshHash)
    console.log('Fresh hash validation result:', freshValidation)
    
  } catch (error) {
    console.error('Error checking user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()
