import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const imageLibrarySeedData = [
  // Hero Images - Business
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
    name: 'Startup Workspace',
    category: 'hero',
    tags: 'startup,workspace,tech,innovation,modern',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },

  // Hero Images - Technology
  {
    name: 'Digital Technology',
    category: 'hero',
    tags: 'technology,digital,tech,innovation,futuristic',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },
  {
    name: 'AI and Machine Learning',
    category: 'hero',
    tags: 'ai,artificial-intelligence,machine-learning,tech,data',
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },

  // Hero Images - Food & Restaurant
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
    name: 'Restaurant Interior',
    category: 'hero',
    tags: 'restaurant,interior,dining,ambiance,elegant',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },

  // Hero Images - Medical
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
    name: 'Healthcare Professional',
    category: 'hero',
    tags: 'healthcare,doctor,nurse,medical,professional',
    url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },

  // Hero Images - Real Estate
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
  },
  {
    name: 'Modern Apartment',
    category: 'hero',
    tags: 'real-estate,apartment,modern,living,property',
    url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },

  // Hero Images - Education
  {
    name: 'Modern Classroom',
    category: 'hero',
    tags: 'education,school,classroom,learning,students',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },
  {
    name: 'Online Learning',
    category: 'hero',
    tags: 'education,online-learning,e-learning,digital,technology',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },

  // Hero Images - E-commerce
  {
    name: 'Online Shopping',
    category: 'hero',
    tags: 'ecommerce,shopping,online,retail,commerce',
    url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },
  {
    name: 'Fashion Store',
    category: 'hero',
    tags: 'fashion,clothing,store,retail,style',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },

  // Hero Images - Portfolio/Creative
  {
    name: 'Creative Workspace',
    category: 'hero',
    tags: 'creative,portfolio,design,art,workspace',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },
  {
    name: 'Design Studio',
    category: 'hero',
    tags: 'design,studio,creative,art,professional',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },

  // Hero Images - Fitness
  {
    name: 'Modern Gym',
    category: 'hero',
    tags: 'fitness,gym,workout,health,exercise',
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },
  {
    name: 'Yoga Studio',
    category: 'hero',
    tags: 'yoga,wellness,fitness,meditation,peaceful',
    url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },

  // Hero Images - Travel
  {
    name: 'Beautiful Landscape',
    category: 'hero',
    tags: 'travel,tourism,landscape,nature,adventure',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },
  {
    name: 'Travel Destination',
    category: 'hero',
    tags: 'travel,destination,vacation,tourism,explore',
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
    width: 1920,
    height: 1080,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },

  // Business Images
  {
    name: 'Professional Handshake',
    category: 'business',
    tags: 'business,handshake,professional,partnership,deal',
    url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop',
    width: 800,
    height: 600,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },
  {
    name: 'Business Charts',
    category: 'business',
    tags: 'business,charts,analytics,data,graph',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    width: 800,
    height: 600,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },

  // Technology Images
  {
    name: 'Coding on Laptop',
    category: 'technology',
    tags: 'technology,coding,programming,laptop,development',
    url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    width: 800,
    height: 600,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },
  {
    name: 'Server Room',
    category: 'technology',
    tags: 'technology,servers,data-center,infrastructure,tech',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    width: 800,
    height: 600,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },

  // Food Images
  {
    name: 'Fresh Ingredients',
    category: 'food',
    tags: 'food,ingredients,fresh,cooking,healthy',
    url: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400&h=300&fit=crop',
    width: 800,
    height: 600,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },
  {
    name: 'Chef Cooking',
    category: 'food',
    tags: 'food,chef,cooking,kitchen,culinary',
    url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    width: 800,
    height: 600,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },

  // Medical Images
  {
    name: 'Medical Equipment',
    category: 'medical',
    tags: 'medical,equipment,healthcare,hospital,technology',
    url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop',
    width: 800,
    height: 600,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },
  {
    name: 'Pharmacy',
    category: 'medical',
    tags: 'medical,pharmacy,medicine,drugs,healthcare',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
    width: 800,
    height: 600,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },

  // Real Estate Images
  {
    name: 'House Keys',
    category: 'real-estate',
    tags: 'real-estate,house,keys,property,home',
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
    width: 800,
    height: 600,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },
  {
    name: 'Property Sign',
    category: 'real-estate',
    tags: 'real-estate,property,sign,sale,house',
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
    width: 800,
    height: 600,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },

  // Education Images
  {
    name: 'Books and Learning',
    category: 'education',
    tags: 'education,books,learning,study,knowledge',
    url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    width: 800,
    height: 600,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },
  {
    name: 'Graduation Cap',
    category: 'education',
    tags: 'education,graduation,cap,diploma,success',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
    width: 800,
    height: 600,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },

  // E-commerce Images
  {
    name: 'Shopping Cart',
    category: 'ecommerce',
    tags: 'ecommerce,shopping,cart,online,retail',
    url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    width: 800,
    height: 600,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },
  {
    name: 'Product Photography',
    category: 'ecommerce',
    tags: 'ecommerce,product,photography,shopping,retail',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    width: 800,
    height: 600,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },

  // Lifestyle Images
  {
    name: 'Happy Family',
    category: 'lifestyle',
    tags: 'lifestyle,family,happy,home,life',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=300&fit=crop',
    width: 800,
    height: 600,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },
  {
    name: 'Coffee Break',
    category: 'lifestyle',
    tags: 'lifestyle,coffee,break,relax,work',
    url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
    width: 800,
    height: 600,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },

  // Abstract Images
  {
    name: 'Geometric Patterns',
    category: 'abstract',
    tags: 'abstract,geometric,patterns,design,modern',
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop',
    width: 800,
    height: 600,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  },
  {
    name: 'Colorful Background',
    category: 'abstract',
    tags: 'abstract,colorful,background,art,creative',
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop',
    width: 800,
    height: 600,
    source: 'unsplash',
    license: 'free',
    isPremium: false
  }
]

export async function seedImageLibrary() {
  try {
    console.log('🌱 Seeding image library...')
    
    // Clear existing data
    await prisma.imageLibrary.deleteMany({})
    
    // Insert seed data
    for (const image of imageLibrarySeedData) {
      await prisma.imageLibrary.create({
        data: image
      })
    }
    
    console.log(`✅ Successfully seeded ${imageLibrarySeedData.length} images`)
  } catch (error) {
    console.error('❌ Error seeding image library:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedImageLibrary()
    .then(() => {
      console.log('🎉 Image library seeding completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Image library seeding failed:', error)
      process.exit(1)
    })
}
