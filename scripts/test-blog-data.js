// Test script to debug blog content loading
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testBlogData() {
  try {
    console.log('Testing blog data...');

    // Fetch all blogs
    const blogs = await prisma.blog.findMany({
      where: { status: 'published' },
      include: {
        author: true,
      },
      take: 5,
    });

    console.log('Found blogs:', blogs.length);

    if (blogs.length > 0) {
      const firstBlog = blogs[0];
      console.log('First blog details:');
      console.log('- ID:', firstBlog.id);
      console.log('- Title:', firstBlog.title);
      console.log('- Slug:', firstBlog.slug);
      console.log('- Content length:', firstBlog.content?.length || 0);
      console.log('- Excerpt length:', firstBlog.excerpt?.length || 0);
      console.log('- Status:', firstBlog.status);
      console.log(
        '- Author:',
        firstBlog.author?.name || firstBlog.author?.email,
      );

      // Check content meta
      const contentMeta = await prisma.contentmeta.findUnique({
        where: { slug: firstBlog.slug },
      });

      console.log('Content meta exists:', !!contentMeta);
      if (contentMeta) {
        console.log('- Views:', contentMeta.views);
      }
    }
  } catch (error) {
    console.error('Error testing blog data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBlogData();
