# URL Shortener Timeout Fix

## Problem

Getting "Vercel Runtime Timeout Error: Task timed out after 2 seconds" when accessing shortened links like `/s/haii` in production.

## Solution Applied

### 1. Increased Memory & Timeout Limits

- Memory: 128MB → 256MB
- Timeout: 2s → 5s for all redirect endpoints

### 2. Optimized Database Queries

- Added proper timeout handling (4s timeout)
- Optimized Prisma configuration for serverless
- Added connection pooling optimization
- Implemented async click tracking (non-blocking)

### 3. Multiple Endpoint Options

Current setup provides 4 different redirect endpoints:

#### `/api/direct/[slug]` (Current - Recommended)

- 5 second timeout
- Optimized database queries
- Async click tracking
- Better error handling

#### `/api/ultra-fast/[slug]` (Emergency Fallback)

- Static redirects for common links
- 3 second database timeout
- Emergency homepage fallback

#### `/api/fast/[slug]` (Alternative)

- Static cache support
- Minimal database calls

#### `/api/r/[slug]` (Original)

- Fallback option

## Quick Switch Instructions

If you still experience timeouts, you can quickly switch to the ultra-fast endpoint:

1. Edit `vercel.json`
2. Change the rewrite destination:

```json
{
  "rewrites": [
    {
      "source": "/s/:slug",
      "destination": "/api/ultra-fast/:slug"
    }
  ]
}
```

3. Redeploy to Vercel

## Static Redirects Setup

For your most common short links, you can add them as static redirects in `/api/ultra-fast/[slug].ts`:

```typescript
const staticRedirects: Record<string, string> = {
  github: 'https://github.com/h4MeMengoding',
  ig: 'https://instagram.com/ilhamshofaaa',
  linkedin: 'https://linkedin.com/in/ilham-shofa',
  haii: 'https://your-target-url-here', // Add your specific redirect
};
```

## Testing

Test the fix:

```bash
curl -I https://ilhame.id/s/haii
```

Should return a 301 redirect within 2-3 seconds instead of timing out.

## Database Optimization Recommendations

1. **Check Database Location**: Ensure your database is in the same region as Vercel functions
2. **Connection String**: Verify DATABASE_URL has proper connection pooling parameters
3. **Indexing**: Ensure `slug` field is properly indexed in your database

## Monitoring

Monitor function performance in Vercel dashboard:

- Function Duration
- Memory Usage
- Error Rate
- Cold Start Performance
