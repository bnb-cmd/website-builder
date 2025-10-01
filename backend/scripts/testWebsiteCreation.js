const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testWebsiteCreation() {
  try {
    console.log('🔧 Testing website creation...')
    
    // Test data
    const testData = {
      name: 'Test Website',
      description: 'Test description',
      templateId: 'business-1',
      businessType: 'OTHER',
      language: 'ENGLISH',
      userId: 'dev-user-id'
    }
    
    console.log('🔧 Test data:', testData)
    
    // Generate subdomain
    let subdomain = testData.name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    
    if (!subdomain) {
      subdomain = 'website'
    }
    
    console.log('🔧 Generated subdomain:', subdomain)
    
    // Check if subdomain is taken
    const existingWebsite = await prisma.website.findFirst({
      where: { subdomain }
    })
    
    if (existingWebsite) {
      console.log('⚠️ Subdomain already taken:', subdomain)
      subdomain = `${subdomain}-1`
      console.log('🔧 Using subdomain:', subdomain)
    }
    
    // Create website
    const website = await prisma.website.create({
      data: {
        name: testData.name,
        description: testData.description,
        templateId: testData.templateId,
        businessType: testData.businessType,
        language: testData.language,
        userId: testData.userId,
        subdomain,
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    console.log('✅ Website created successfully:', website)
    
  } catch (error) {
    console.error('❌ Error creating website:', error)
    console.error('❌ Error details:', error.message)
    console.error('❌ Error stack:', error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

testWebsiteCreation()
