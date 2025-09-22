#!/usr/bin/env node

/**
 * Database Connection and Performance Test
 * This script tests the actual database connection and performance in production
 */

const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection and Performance...\n');
  console.log('Time:', new Date().toISOString());
  console.log('Environment:', process.env.NODE_ENV || 'development');

  // Test different Prisma configurations
  const configs = [
    {
      name: 'Default Config',
      client: new PrismaClient(),
    },
    {
      name: 'Optimized for Serverless',
      client: new PrismaClient({
        log: ['error'],
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
      }),
    },
    {
      name: 'With Connection Pool',
      client: new PrismaClient({
        log: ['error'],
        datasources: {
          db: {
            url:
              process.env.DATABASE_URL +
              (process.env.DATABASE_URL?.includes('?') ? '&' : '?') +
              'connection_limit=5&pool_timeout=0',
          },
        },
      }),
    },
  ];

  for (const config of configs) {
    console.log(`\n📋 Testing: ${config.name}`);
    console.log('='.repeat(50));

    try {
      // Test 1: Basic Connection
      const startTime = Date.now();
      await config.client.$connect();
      const connectTime = Date.now() - startTime;
      console.log(`✅ Connection: ${connectTime}ms`);

      // Test 2: Simple Query
      const queryStart = Date.now();
      const count = await config.client.shortUrl.count();
      const queryTime = Date.now() - queryStart;
      console.log(`✅ Count Query: ${queryTime}ms (${count} records)`);

      // Test 3: Find Query (typical redirect query)
      const findStart = Date.now();
      const testRecord = await config.client.shortUrl.findFirst({
        where: {
          is_active: true,
        },
        select: {
          slug: true,
          original_url: true,
        },
      });
      const findTime = Date.now() - findStart;
      console.log(`✅ Find Query: ${findTime}ms`);

      // Test 4: Specific slug lookup (realistic test)
      if (testRecord) {
        const slugStart = Date.now();
        const slugRecord = await config.client.shortUrl.findFirst({
          where: {
            slug: testRecord.slug,
            is_active: true,
          },
          select: {
            original_url: true,
            id: true,
          },
        });
        const slugTime = Date.now() - slugStart;
        console.log(`✅ Slug Lookup: ${slugTime}ms`);
      }

      // Test 5: Update operation (click tracking)
      if (testRecord) {
        const updateStart = Date.now();
        await config.client.shortUrl.updateMany({
          where: {
            slug: testRecord.slug,
          },
          data: {
            updated_at: new Date(),
          },
        });
        const updateTime = Date.now() - updateStart;
        console.log(`✅ Update Query: ${updateTime}ms`);
      }

      const totalTime = Date.now() - startTime;
      console.log(`🕒 Total Time: ${totalTime}ms`);

      // Performance assessment
      if (totalTime < 1000) {
        console.log('🟢 Performance: EXCELLENT');
      } else if (totalTime < 2000) {
        console.log('🟡 Performance: GOOD');
      } else if (totalTime < 4000) {
        console.log('🟠 Performance: FAIR');
      } else {
        console.log('🔴 Performance: POOR (Likely to timeout)');
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      console.log(
        `   Connection string length: ${process.env.DATABASE_URL?.length || 0}`,
      );
      console.log(`   Error type: ${error.constructor.name}`);
    } finally {
      try {
        await config.client.$disconnect();
        console.log('✅ Disconnected successfully');
      } catch (disconnectError) {
        console.log(`⚠️  Disconnect error: ${disconnectError.message}`);
      }
    }
  }

  // Environment checks
  console.log('\n🔧 Environment Analysis:');
  console.log('='.repeat(50));
  console.log(`DATABASE_URL defined: ${!!process.env.DATABASE_URL}`);
  console.log(`DATABASE_URL length: ${process.env.DATABASE_URL?.length || 0}`);
  console.log(
    `DATABASE_URL preview: ${process.env.DATABASE_URL?.substring(0, 50)}...`,
  );
  console.log(`Node.js version: ${process.version}`);
  console.log(`Platform: ${process.platform}`);
  console.log(
    `Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
  );

  // Connection string analysis
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    console.log(`\n🌐 Database Info:`);
    console.log(`Protocol: ${url.protocol}`);
    console.log(`Host: ${url.hostname}`);
    console.log(`Port: ${url.port || 'default'}`);
    console.log(`Database: ${url.pathname.substring(1)}`);
    console.log(`Parameters: ${url.search}`);

    // Check for common connection parameters
    const params = new URLSearchParams(url.search);
    console.log(
      `Connection limit: ${params.get('connection_limit') || 'not set'}`,
    );
    console.log(`Pool timeout: ${params.get('pool_timeout') || 'not set'}`);
    console.log(`SSL mode: ${params.get('sslmode') || 'not set'}`);
  }

  console.log('\n🎯 Recommendations:');
  console.log('='.repeat(50));
  console.log('1. If total time > 2000ms: Database is too slow for Vercel');
  console.log('2. If connection fails: Check DATABASE_URL and network');
  console.log('3. If queries are slow: Add database indexes');
  console.log('4. Consider connection pooling service (PgBouncer)');
  console.log('5. Use same region for database and Vercel functions');
}

testDatabaseConnection().catch(console.error);
