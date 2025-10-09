import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { authConfig } from '../config/environment'

const prisma = new PrismaClient()

async function updateUserPassword() {
  try {
    console.log('Updating test user password...')
    
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })
    
    if (!user) {
      console.log('No user found with email: test@example.com')
      return
    }
    
    // Create fresh password hash
    const newPassword = 'password123'
    const hashedPassword = await bcrypt.hash(newPassword, authConfig.bcryptRounds)
    
    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })
    
    console.log('Password updated successfully')
    
    // Verify the new password works
    const updatedUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })
    
    const isValid = await bcrypt.compare(newPassword, updatedUser!.password)
    console.log('Password validation after update:', isValid)
    
  } catch (error) {
    console.error('Error updating password:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateUserPassword()
