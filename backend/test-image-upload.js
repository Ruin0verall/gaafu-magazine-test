const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testImageUpload() {
  try {
    // First, get available categories
    console.log('Fetching available categories...');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*');

    if (catError) {
      console.error('Error fetching categories:', catError);
      throw new Error('Failed to fetch categories');
    }

    console.log('Available categories:', categories);
    const categoryId = categories[0]?.id; // Use the first available category

    if (!categoryId) {
      throw new Error('No categories found in the database');
    }

    // Sign in to Supabase
    console.log('Signing in to Supabase...');
    console.log('Using email:', process.env.SUPABASE_USER_EMAIL);
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: process.env.SUPABASE_USER_EMAIL,
      password: process.env.SUPABASE_USER_PASSWORD,
    });

    if (authError) {
      console.error('Authentication error:', authError);
      throw new Error(`Authentication failed: ${authError.message}`);
    }

    console.log('Successfully authenticated with Supabase');
    console.log('User:', authData.user.email);
    console.log('Access token:', authData.session.access_token.substring(0, 20) + '...');

    // Download a test image
    console.log('Downloading test image...');
    const imageResponse = await fetch('https://picsum.photos/400/300');
    const imageBuffer = await imageResponse.buffer();
    const sampleImagePath = path.join(__dirname, 'sample-image.jpg');
    fs.writeFileSync(sampleImagePath, imageBuffer);
    console.log('Test image downloaded successfully');
    
    // Create FormData instance
    const formData = new FormData();
    
    // Add the article data
    const articleData = {
      title: 'Test Article with Image',
      content: 'This is the full content of the test article.',
      category_id: categoryId
    };

    // Add excerpt if the column exists
    try {
      const { error } = await supabase
        .from('articles')
        .select('excerpt')
        .limit(1);
      
      if (!error) {
        articleData.excerpt = 'This is a test article with an uploaded image.';
      }
    } catch (error) {
      console.log('Excerpt column not available, skipping...');
    }

    // Add all fields to FormData
    Object.entries(articleData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // Add the image file
    const fileStream = fs.createReadStream(sampleImagePath);
    formData.append('image', fileStream);

    // Add authentication header
    const headers = {
      'Authorization': `Bearer ${authData.session.access_token}`
    };

    console.log('Sending request to create article...');
    console.log('Article data:', articleData);
    console.log('Headers:', headers);
    
    // Send the request
    const response = await fetch('http://localhost:5000/api/articles', {
      method: 'POST',
      headers,
      body: formData,
    });

    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response text:', responseText);

    if (!response.ok) {
      throw new Error(`Failed to create article: ${responseText}`);
    }

    const result = JSON.parse(responseText);
    console.log('Article created successfully:', result);
    console.log('Image URL:', result.image_url);

    // Clean up the test image
    fs.unlinkSync(sampleImagePath);
  } catch (error) {
    console.error('Error:', error);
    if (error.cause) {
      console.error('Error cause:', error.cause);
    }
  }
}

testImageUpload(); 