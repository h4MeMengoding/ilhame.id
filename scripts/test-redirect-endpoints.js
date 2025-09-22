#!/usr/bin/env node

/**
 * Test script for URL shortener endpoints
 * Usage: node test-redirect-endpoints.js [slug]
 */

const https = require('https');
const http = require('http');

const baseUrl = process.env.VERCEL_URL || 'https://ilhame.id';
const testSlug = process.argv[2] || 'haii';

const endpoints = ['/api/direct', '/api/ultra-fast', '/api/fast', '/api/r'];

function testEndpoint(endpoint, slug) {
  return new Promise((resolve) => {
    const url = `${baseUrl}${endpoint}/${slug}`;
    const startTime = Date.now();

    console.log(`\n🔍 Testing: ${url}`);

    const client = url.startsWith('https') ? https : http;

    const req = client.request(url, { method: 'HEAD' }, (res) => {
      const endTime = Date.now();
      const duration = endTime - startTime;

      resolve({
        endpoint,
        status: res.statusCode,
        location: res.headers.location,
        duration: `${duration}ms`,
        cacheControl: res.headers['cache-control'],
        success: res.statusCode >= 200 && res.statusCode < 400,
      });
    });

    req.on('error', (error) => {
      const endTime = Date.now();
      const duration = endTime - startTime;

      resolve({
        endpoint,
        status: 'ERROR',
        error: error.message,
        duration: `${duration}ms`,
        success: false,
      });
    });

    req.setTimeout(10000, () => {
      const endTime = Date.now();
      const duration = endTime - startTime;

      resolve({
        endpoint,
        status: 'TIMEOUT',
        duration: `${duration}ms`,
        success: false,
      });
      req.destroy();
    });

    req.end();
  });
}

async function runTests() {
  console.log(`🚀 Testing URL shortener endpoints for slug: "${testSlug}"`);
  console.log(`📍 Base URL: ${baseUrl}`);
  console.log('='.repeat(60));

  const results = [];

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint, testSlug);
    results.push(result);

    const statusIcon = result.success ? '✅' : '❌';
    const statusText =
      result.status === 'ERROR' ? `ERROR: ${result.error}` : result.status;

    console.log(
      `${statusIcon} ${endpoint}: ${statusText} (${result.duration})`,
    );

    if (result.location) {
      console.log(`   → Redirects to: ${result.location}`);
    }

    if (result.cacheControl) {
      console.log(`   → Cache: ${result.cacheControl}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY:');

  const successful = results.filter((r) => r.success);
  const fastest = successful.reduce((prev, current) => {
    return parseInt(prev.duration) < parseInt(current.duration)
      ? prev
      : current;
  }, successful[0]);

  if (fastest) {
    console.log(`🏆 Fastest: ${fastest.endpoint} (${fastest.duration})`);
  }

  console.log(`✅ Success: ${successful.length}/${results.length}`);
  console.log(
    `❌ Failed: ${results.length - successful.length}/${results.length}`,
  );

  if (successful.length === 0) {
    console.log('\n⚠️  All endpoints failed! Check:');
    console.log('   - Database connection');
    console.log('   - Vercel deployment status');
    console.log('   - Short URL exists in database');
  }
}

runTests().catch(console.error);
