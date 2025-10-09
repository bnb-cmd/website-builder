#!/usr/bin/env node

/**
 * Test script to verify authentication and template loading flow
 * Run this after starting both frontend and backend servers
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3005/v1';
const FRONTEND_URL = 'http://localhost:3000';

async function testAuthFlow() {
  console.log('🧪 Testing Authentication Flow...\n');

  try {
    // Test 1: Login with admin credentials
    console.log('1️⃣ Testing login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@pakistan-website-builder.com',
      password: 'Admin123!@#'
    });

    if (loginResponse.data.success) {
      console.log('✅ Login successful');
      console.log('   User:', loginResponse.data.data.user.email);
      console.log('   Token:', loginResponse.data.data.accessToken.substring(0, 20) + '...');
    } else {
      console.log('❌ Login failed:', loginResponse.data.error);
      return;
    }

    const token = loginResponse.data.data.accessToken;

    // Test 2: Get user profile
    console.log('\n2️⃣ Testing user profile...');
    const profileResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (profileResponse.data.success) {
      console.log('✅ Profile fetch successful');
      console.log('   User:', profileResponse.data.data.user.email);
    } else {
      console.log('❌ Profile fetch failed:', profileResponse.data.error);
    }

    // Test 3: Get templates
    console.log('\n3️⃣ Testing template listing...');
    const templatesResponse = await axios.get(`${API_BASE_URL}/templates`);

    if (templatesResponse.data.success) {
      console.log('✅ Templates fetch successful');
      console.log('   Templates found:', templatesResponse.data.data.templates.length);
      
      // Test 4: Get specific template
      if (templatesResponse.data.data.templates.length > 0) {
        const templateId = templatesResponse.data.data.templates[0].id;
        console.log(`\n4️⃣ Testing template details for: ${templateId}`);
        
        const templateResponse = await axios.get(`${API_BASE_URL}/templates/${templateId}`);
        
        if (templateResponse.data.success) {
          console.log('✅ Template details fetch successful');
          console.log('   Template name:', templateResponse.data.data.name);
          console.log('   Elements:', templateResponse.data.data.elements?.length || 0);
        } else {
          console.log('❌ Template details fetch failed:', templateResponse.data.error);
        }
      }
    } else {
      console.log('❌ Templates fetch failed:', templatesResponse.data.error);
    }

    // Test 5: Create website
    console.log('\n5️⃣ Testing website creation...');
    const websiteResponse = await axios.post(`${API_BASE_URL}/websites`, {
      name: 'Test Website',
      templateId: 'business-1',
      description: 'Test website created via API',
      businessType: 'SERVICE',
      language: 'ENGLISH'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (websiteResponse.data.success) {
      console.log('✅ Website creation successful');
      console.log('   Website ID:', websiteResponse.data.data.id);
      console.log('   Website name:', websiteResponse.data.data.name);
    } else {
      console.log('❌ Website creation failed:', websiteResponse.data.error);
    }

    console.log('\n🎉 Authentication flow test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
  }
}

// Run the test
testAuthFlow();
