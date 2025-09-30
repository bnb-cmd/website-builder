import { PrismaClient } from '@prisma/client'
import { UserService } from '../services/userService'

const prisma = new PrismaClient()

async function clearCacheAndTest() {
  try {
    console.log('Clearing cache and testing login...')
    
    const userService = new UserService()
    const email = 'test@example.com'
    const password = 'password123'
    
    // Clear any cached user data
    console.log('Clearing cache...')
    await userService.invalidateCache(`user:email:${email}`)
    await userService.invalidateCache('users:*')
    
    console.log('Testing login after cache clear...')
    
    // Test the exact same flow as the login route
    const user = await userService.findByEmail(email)
    console.log('findByEmail result:', user ? 'User found' : 'User not found')
    
    if (!user) {
      console.log('❌ User not found - this is the issue!')
      return
    }
    
    console.log('User details:', {
      id: user.id,
      email: user.email,
      status: user.status,
      role: user.role
    })
    
    const isValidPassword = await userService.validatePassword(user, password)
    console.log('Password validation:', isValidPassword)
    
    if (user.status !== 'ACTIVE') {
      console.log('❌ User is not active:', user.status)
      return
    }
    
    if (isValidPassword && user.status === 'ACTIVE') {
      console.log('✅ Login should work!')
    } else {
      console.log('❌ Login failed:', {
        isValidPassword,
        isActive: user.status === 'ACTIVE'
      })
    }
    
  } catch (error) {
    console.error('Error testing login:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearCacheAndTest()
