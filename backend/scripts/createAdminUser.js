const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [
          { email: 'admin@pakistan-website-builder.com' },
          { role: 'SUPER_ADMIN' }
        ]
      }
    })

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email)
      return existingAdmin
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin123!@#', 12)

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@pakistan-website-builder.com',
        name: 'System Administrator',
        password: hashedPassword,
        phone: '+92-300-0000000',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        businessType: 'SERVICE',
        city: 'Karachi',
        companyName: 'Pakistan Website Builder',
        preferredLanguage: 'ENGLISH',
        aiQuotaUsed: 0,
        aiQuotaResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    })

    console.log('✅ Admin user created successfully!')
    console.log('Email:', adminUser.email)
    console.log('Password: Admin123!@#')
    console.log('Role:', adminUser.role)
    console.log('Status:', adminUser.status)

    return adminUser
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
createAdminUser()
  .then(() => {
    console.log('Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
