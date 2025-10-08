import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample image data
const imageData = [
  {
    name: 'Modern Office Building',
    category: 'hero',
    tags: 'business,office,corporate,modern,architecture',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },
  {
    name: 'Team Meeting',
    category: 'hero',
    tags: 'business,team,meeting,collaboration,office',
    url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },
  {
    name: 'Delicious Food Spread',
    category: 'hero',
    tags: 'food,restaurant,delicious,cooking,cuisine',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },
  {
    name: 'Modern Medical Facility',
    category: 'hero',
    tags: 'medical,healthcare,hospital,clinic,medicine',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },
  {
    name: 'Luxury Home',
    category: 'hero',
    tags: 'real-estate,home,luxury,property,architecture',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  }
]

async function seedImageLibrary() {
  try {
    console.log('🌱 Seeding image library...')
    
    // Clear existing data
    await prisma.imageLibrary.deleteMany({})
    console.log('✅ Cleared existing image data')
    
    // Insert seed data
    for (const image of imageData) {
      await prisma.imageLibrary.create({
        data: image
      })
    }
    
    console.log(`✅ Successfully seeded ${imageData.length} images`)
  } catch (error) {
    console.error('❌ Error seeding image library:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding
seedImageLibrary()
  .then(() => {
    console.log('🎉 Image library seeding completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Image library seeding failed:', error)
    process.exit(1)
  })
