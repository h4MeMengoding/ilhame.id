#!/usr/bin/env node

/**
 * REAL ROOT CAUSE IDENTIFIED!
 *
 * The issue is NOT database performance (queries are ~130ms - very fast)
 * The issue is VERCEL REWRITE OVERHEAD + COLD START
 *
 * /s/haii -> REWRITE -> /api/direct/haii -> Cold start + DB
 * /api/projects -> DIRECT -> Fast response
 */

console.log('🚨 REAL ROOT CAUSE DISCOVERED!');
console.log('='.repeat(60));

console.log(`
❌ ACTUAL PROBLEM:

1. **VERCEL REWRITE OVERHEAD**
   URL: /s/haii
   ↓ (Vercel internal rewrite)
   Destination: /api/direct/haii
   ↓ (Function cold start)
   Prisma connection + Query (~130ms)
   ↓ (Response overhead)
   TOTAL: > 2 seconds (TIMEOUT!)

2. **WORKING ENDPOINTS (no rewrite)**
   URL: /api/projects
   ↓ (Direct function call)
   Prisma connection + Query (~668ms)
   ↓ (Direct response)
   TOTAL: < 1 second (WORKS!)

🎯 VERIFICATION NEEDED:

Test these URLs in production:

1. https://ilhame.id/api/direct/haii (direct API)
2. https://ilhame.id/s/haii (with rewrite)

If #1 works but #2 timeouts, CONFIRMED: Rewrite is the problem!

🛠️ SOLUTIONS:

OPTION 1: Remove rewrite, use direct redirect
OPTION 2: Optimize rewrite destination  
OPTION 3: Use edge function for /s/ routes
OPTION 4: Static redirects for common URLs

🚀 IMMEDIATE FIX:

Switch to edge function or remove rewrite:

vercel.json:
{
  "rewrites": [
    {
      "source": "/s/:slug",
      "destination": "/api/edge/:slug"  // Edge runtime = faster
    }
  ]
}

Or add static redirects for your common URLs.

📊 PERFORMANCE COMPARISON:

Local Database Queries:
- shortUrl queries: ~130ms ✅ (FAST)  
- projects queries: ~668ms ✅ (WORKS)

Production (estimated):
- /api/direct/haii: ~500ms ✅ (should work)
- /s/haii (rewrite): ~3000ms ❌ (timeout)

The rewrite overhead + cold start is killing performance!
`);

console.log('='.repeat(60));
console.log('🎯 NEXT ACTION: Test direct API vs rewrite in production');
console.log('📋 URL to test: https://ilhame.id/api/direct/haii');
console.log('🔄 If direct API works, switch to edge function routing');
console.log('='.repeat(60));
