const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testShortUrlQueries() {
  console.log('🔍 Testing specific shortUrl queries...\n');

  try {
    // Test 1: Simple count
    const startTime = Date.now();
    const count = await prisma.shortUrl.count();
    console.log(`✅ ShortUrl count: ${count} (${Date.now() - startTime}ms)`);

    // Test 2: Simple findFirst without complex WHERE
    const start2 = Date.now();
    const simple = await prisma.shortUrl.findFirst();
    console.log(`✅ Simple findFirst: ${Date.now() - start2}ms`);

    // Test 3: Complex WHERE (like the timeout query)
    const start3 = Date.now();
    const complex = await prisma.shortUrl.findFirst({
      where: {
        is_active: true,
        OR: [{ expires_at: null }, { expires_at: { gt: new Date() } }],
      },
      select: {
        original_url: true,
        id: true,
        slug: true,
      },
    });
    console.log(`✅ Complex query: ${Date.now() - start3}ms`);

    if (complex) {
      console.log(`   Found slug: ${complex.slug}`);

      // Test 4: Test specific slug lookup (the exact timeout pattern)
      const start4 = Date.now();
      const specific = await prisma.shortUrl.findFirst({
        where: {
          slug: complex.slug,
          is_active: true,
        },
        select: {
          original_url: true,
          id: true,
        },
      });
      console.log(`✅ Specific slug lookup: ${Date.now() - start4}ms`);

      // Test 5: Test with exact production pattern
      const start5 = Date.now();
      const production = await prisma.shortUrl.findFirst({
        where: {
          slug: complex.slug,
          is_active: true,
          OR: [{ expires_at: null }, { expires_at: { gt: new Date() } }],
        },
        select: {
          original_url: true,
          id: true,
        },
      });
      console.log(`✅ Production pattern: ${Date.now() - start5}ms`);
    }

    // Test 6: Compare with projects query
    const start6 = Date.now();
    const projects = await prisma.projects.findMany({
      orderBy: { updated_at: 'desc' },
      take: 5,
    });
    console.log(`✅ Projects query (for comparison): ${Date.now() - start6}ms`);

    await prisma.$disconnect();

    console.log('\n🎯 CONCLUSION:');
    console.log('If shortUrl queries are fast here but timeout in production,');
    console.log(
      'the issue is likely in Vercel environment or specific routing.',
    );
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
  }
}

testShortUrlQueries();
