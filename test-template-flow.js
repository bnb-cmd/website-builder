#!/usr/bin/env node

/**
 * Test script to verify template loading and website creation flow
 * Run this after starting both frontend and backend servers
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3005/v1';

async function testTemplateFlow() {
  console.log('🧪 Testing Template Loading and Website Creation Flow...\n');

  try {
    // Step 1: Login
    console.log('1️⃣ Logging in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@pakistan-website-builder.com',
      password: 'Admin123!@#'
    });

    if (!loginResponse.data.success) {
      console.log('❌ Login failed:', loginResponse.data.error);
      return;
    }

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login successful');

    // Step 2: Get available templates
    console.log('\n2️⃣ Fetching available templates...');
    const templatesResponse = await axios.get(`${API_BASE_URL}/templates`);
    
    if (!templatesResponse.data.success) {
      console.log('❌ Templates fetch failed:', templatesResponse.data.error);
      return;
    }

    const templates = templatesResponse.data.data.templates;
    console.log(`✅ Found ${templates.length} templates`);

    // Step 3: Test each template
    for (let i = 0; i < Math.min(3, templates.length); i++) {
      const template = templates[i];
      console.log(`\n3️⃣ Testing template: ${template.name} (${template.id})`);
      
      // Get template details
      const templateDetailsResponse = await axios.get(`${API_BASE_URL}/templates/${template.id}`);
      
      if (!templateDetailsResponse.data.success) {
        console.log(`❌ Template details fetch failed for ${template.id}:`, templateDetailsResponse.data.error);
        continue;
      }

      const templateData = templateDetailsResponse.data.data;
      console.log(`✅ Template details loaded`);
      console.log(`   Elements: ${templateData.elements?.length || 0}`);
      console.log(`   Category: ${templateData.category}`);
      console.log(`   Premium: ${templateData.isPremium}`);

      // Step 4: Create website from template
      console.log(`\n4️⃣ Creating website from template: ${template.name}`);
      const websiteResponse = await axios.post(`${API_BASE_URL}/websites`, {
        name: `Test Website - ${template.name}`,
        templateId: template.id,
        description: `Test website created from ${template.name} template`,
        businessType: 'SERVICE',
        language: 'ENGLISH',
        content: {
          pages: [{
            id: 'home',
            name: 'Home',
            path: '/',
            components: templateData.elements || [],
            seo: {
              title: template.name,
              description: template.description,
              keywords: template.tags || []
            }
          }]
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (websiteResponse.data.success) {
        console.log(`✅ Website created successfully`);
        console.log(`   Website ID: ${websiteResponse.data.data.id}`);
        console.log(`   Website name: ${websiteResponse.data.data.name}`);
        console.log(`   Status: ${websiteResponse.data.data.status}`);
      } else {
        console.log(`❌ Website creation failed:`, websiteResponse.data.error);
      }
    }

    // Step 5: Test template categories
    console.log('\n5️⃣ Testing template categories...');
    const categoriesResponse = await axios.get(`${API_BASE_URL}/templates/categories`);
    
    if (categoriesResponse.data.success) {
      console.log('✅ Categories fetch successful');
      const categories = categoriesResponse.data.data.categories;
      console.log(`   Categories: ${categories.map(c => `${c.name} (${c.count})`).join(', ')}`);
    } else {
      console.log('❌ Categories fetch failed:', categoriesResponse.data.error);
    }

    console.log('\n🎉 Template loading and website creation flow test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
  }
}

// Run the test
testTemplateFlow();
