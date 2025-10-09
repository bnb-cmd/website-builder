import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function compareUsers() {
  try {
    console.log('Comparing old vs new users...')
    
    // Get the old test user
    const oldUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })
    
    // Get the new user
    const newUser = await prisma.user.findUnique({
      where: { email: 'newuser@example.com' }
    })
    
    console.log('Old user:', oldUser ? {
      id: oldUser.id,
      email: oldUser.email,
      status: oldUser.status,
      passwordLength: oldUser.password.length,
      passwordStart: oldUser.password.substring(0, 10) + '...'
    } : 'Not found')
    
    console.log('New user:', newUser ? {
      id: newUser.id,
      email: newUser.email,
      status: newUser.status,
      passwordLength: newUser.password.length,
      passwordStart: newUser.password.substring(0, 10) + '...'
    } : 'Not found')
    
    // Test password validation for both
    if (oldUser) {
      const oldPasswordValid = await bcrypt.compare('password123', oldUser.password)
      console.log('Old user password validation:', oldPasswordValid)
    }
    
    if (newUser) {
      const newPasswordValid = await bcrypt.compare('password123', newUser.password)
      console.log('New user password validation:', newPasswordValid)
    }
    
  } catch (error) {
    console.error('Error comparing users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

compareUsers()
