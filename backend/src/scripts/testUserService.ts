import { PrismaClient } from '@prisma/client'
import { UserService } from '../services/userService'

const prisma = new PrismaClient()

async function testUserService() {
  try {
    console.log('Testing UserService methods...')
    
    const userService = new UserService()
    const email = 'test@example.com'
    const password = 'password123'
    
    console.log('Testing findByEmail...')
    const user = await userService.findByEmail(email)
    console.log('findByEmail result:', user ? 'User found' : 'User not found')
    
    if (user) {
      console.log('User details:', {
        id: user.id,
        email: user.email,
        status: user.status,
        role: user.role
      })
      
      console.log('Testing validatePassword...')
      const isValid = await userService.validatePassword(user, password)
      console.log('validatePassword result:', isValid)
      
      if (isValid && user.status === 'ACTIVE') {
        console.log('✅ UserService login should work!')
      } else {
        console.log('❌ UserService login failed:', {
          isValidPassword: isValid,
          isActive: user.status === 'ACTIVE'
        })
      }
    }
    
  } catch (error) {
    console.error('Error testing UserService:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testUserService()
