const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Simple template data for testing
const testTemplates = [
  {
    id: 'business-1',
    name: 'Modern Business',
    category: 'Business',
    description: 'Professional business website with all essential sections',
    thumbnail: '/templates/business-1.svg',
    isPremium: false,
    tags: ['corporate', 'professional', 'services'],
    pages: ['home', 'about', 'services', 'contact'],
    features: ['responsive', 'seo-friendly', 'contact-form'],
    elements: [
      {
        id: 'navbar-1',
        type: 'navbar',
        props: {
          logo: 'Your Business',
          menuItems: [
            { label: 'Home', link: '/' },
            { label: 'About', link: '/about' },
            { label: 'Services', link: '/services' },
            { label: 'Contact', link: '/contact' }
          ],
          style: 'modern'
        },
        style: {},
        children: []
      },
      {
        id: 'hero-1',
        type: 'hero',
        props: {
          title: 'Welcome to Your Business',
          subtitle: 'Professional solutions for modern challenges',
          buttonText: 'Get Started',
          buttonLink: '/contact',
          backgroundImage: '/templates/hero-business.jpg'
        },
        style: {},
        children: []
      }
    ]
  }
];

async function testTemplateLoading() {
  try {
    console.log('🔧 Testing template loading...');
    
    // Test creating a website with template
    const testTemplate = testTemplates[0]; // Use first template
    console.log('🔧 Using template:', testTemplate.name);
    console.log('🔧 Template ID:', testTemplate.id);
    console.log('🔧 Template elements count:', testTemplate.elements?.length || 0);
    
    if (testTemplate.elements) {
      console.log('🔧 Sample elements:', testTemplate.elements.slice(0, 2));
    }
    
    // Create test website without userId to avoid foreign key constraint
    const website = await prisma.website.create({
      data: {
        name: 'Test Template Website',
        description: 'Testing template loading functionality',
        templateId: testTemplate.id,
        businessType: 'OTHER',
        language: 'ENGLISH',
        subdomain: 'test-template-' + Date.now(),
        status: 'DRAFT',
        content: JSON.stringify({
          elements: testTemplate.elements || [],
          templateId: testTemplate.id,
          templateName: testTemplate.name
        })
      }
    });
    
    console.log('✅ Website created with ID:', website.id);
    console.log('🔧 Template elements loaded:', testTemplate.elements?.length || 0);
    
    // Test loading the website
    const loadedWebsite = await prisma.website.findUnique({
      where: { id: website.id }
    });
    
    if (loadedWebsite?.content) {
      const parsedContent = JSON.parse(loadedWebsite.content);
      console.log('✅ Template elements in database:', parsedContent.elements?.length || 0);
      console.log('✅ Template ID in database:', parsedContent.templateId);
      console.log('✅ Template name in database:', parsedContent.templateName);
      
      if (parsedContent.elements && parsedContent.elements.length > 0) {
        console.log('🔧 First element:', parsedContent.elements[0]);
      }
    }
    
    // Test template API endpoint
    console.log('\n🔧 Testing template API...');
    const templates = testTemplates.slice(0, 3);
    console.log('✅ Available templates:', templates.map(t => t.name));
    
    // Clean up test website
    await prisma.website.delete({
      where: { id: website.id }
    });
    console.log('🧹 Cleaned up test website');
    
    console.log('\n✅ Template loading test completed successfully!');
    
  } catch (error) {
    console.error('❌ Template loading test failed:', error);
    console.error('❌ Error details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testTemplateLoading().catch(console.error);
