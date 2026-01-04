const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addSampleTags() {
  try {
    console.log('Creating sample tags...');

    // Create tags
    const tags = await Promise.all([
      prisma.tag.create({
        data: { name: 'Web Development', slug: 'web-development' },
      }),
      prisma.tag.create({ data: { name: 'JavaScript', slug: 'javascript' } }),
      prisma.tag.create({ data: { name: 'React', slug: 'react' } }),
      prisma.tag.create({ data: { name: 'Next.js', slug: 'nextjs' } }),
      prisma.tag.create({ data: { name: 'TypeScript', slug: 'typescript' } }),
      prisma.tag.create({ data: { name: 'Tutorial', slug: 'tutorial' } }),
      prisma.tag.create({ data: { name: 'SEO', slug: 'seo' } }),
    ]);

    console.log('✅ Created', tags.length, 'tags');

    // Get all published blogs
    const blogs = await prisma.blog.findMany({
      where: { status: 'published' },
      take: 10,
    });

    if (blogs.length === 0) {
      console.log('⚠️  No published blogs found. Create some blogs first!');
      return;
    }

    console.log('Found', blogs.length, 'published blogs');

    // Assign random tags to blogs
    for (const blog of blogs) {
      const randomTags = tags
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 2); // 2-4 tags per blog

      await Promise.all(
        randomTags.map((tag) =>
          prisma.blogTag.create({
            data: {
              blog_id: blog.id,
              tag_id: tag.id,
            },
          }),
        ),
      );

      console.log(`✅ Added ${randomTags.length} tags to blog: ${blog.title}`);
    }

    console.log('-----------------------------------');
    console.log('✅ Sample tags added successfully!');
    console.log('Visit blog detail pages to see related posts based on tags');
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('ℹ️  Tags already exist, skipping creation...');
    } else {
      console.error('❌ Error:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

addSampleTags();
