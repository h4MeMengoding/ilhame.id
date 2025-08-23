// Test script to verify API endpoints work correctly
const fetch = require('node-fetch');

async function testAPIs() {
  try {
    console.log('Testing blog APIs...');

    // Test blog list API
    console.log('\n1. Testing /api/blog...');
    const blogListResponse = await fetch(
      'http://localhost:3000/api/blog?page=1&per_page=5',
    );
    if (blogListResponse.ok) {
      const blogList = await blogListResponse.json();
      console.log('✅ Blog list API works');
      console.log('Found posts:', blogList.data?.posts?.length || 0);

      if (blogList.data?.posts?.length > 0) {
        const firstPost = blogList.data.posts[0];
        console.log('First post:', firstPost.title?.rendered);

        // Test blog detail API
        console.log('\n2. Testing /api/blog/[id]...');
        const blogDetailResponse = await fetch(
          `http://localhost:3000/api/blog/${firstPost.id}`,
        );
        if (blogDetailResponse.ok) {
          const blogDetail = await blogDetailResponse.json();
          console.log('✅ Blog detail API works');
          console.log(
            'Content length:',
            blogDetail.data?.content?.rendered?.length || 0,
          );
          console.log('Has content:', !!blogDetail.data?.content?.rendered);
        } else {
          console.log('❌ Blog detail API failed:', blogDetailResponse.status);
        }
      }
    } else {
      console.log('❌ Blog list API failed:', blogListResponse.status);
    }

    // Test featured blogs API
    console.log('\n3. Testing /api/blog/featured...');
    const featuredResponse = await fetch(
      'http://localhost:3000/api/blog/featured',
    );
    if (featuredResponse.ok) {
      const featured = await featuredResponse.json();
      console.log('✅ Featured blog API works');
      console.log('Featured posts:', featured.data?.posts?.length || 0);
    } else {
      console.log('❌ Featured blog API failed:', featuredResponse.status);
    }
  } catch (error) {
    console.error('Error testing APIs:', error.message);
    console.log('Note: Make sure to run "yarn dev" first in another terminal');
  }
}

testAPIs();
