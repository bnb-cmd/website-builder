import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { authConfig } from '../config/environment'

const prisma = new PrismaClient()

async function debugLogin() {
  try {
    console.log('Debugging login process...')
    
    const email = 'test@example.com'
    const password = 'password123'
    
    console.log('Looking for user with email:', email)
    
    // Check exact email match
    const userExact = await prisma.user.findUnique({
      where: { email: email }
    })
    console.log('Exact email match:', userExact ? 'Found' : 'Not found')
    
    // Check lowercase email match
    const userLower = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })
    console.log('Lowercase email match:', userLower ? 'Found' : 'Not found')
    
    if (userLower) {
      console.log('User details:', {
        id: userLower.id,
        email: userLower.email,
        status: userLower.status,
        role: userLower.role
      })
      
      // Test password validation
      const isValid = await bcrypt.compare(password, userLower.password)
      console.log('Password validation:', isValid)
      
      if (isValid) {
        console.log('✅ Login should work!')
      } else {
        console.log('❌ Password validation failed')
      }
    }
    
  } catch (error) {
    console.error('Error debugging login:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugLogin()
