# Vercel Timeout Solutions for URL Shortener

## Multiple API Endpoints Created

### 1. `/api/direct/[slug].ts` (RECOMMENDED) ⚡

- **Timeout**: 2 seconds max
- **Features**: Promise.race with 2s timeout, minimal Prisma usage
- **Memory**: 128MB
- **Best for**: Production use

### 2. `/api/fast/[slug].ts` (BACKUP) 🚀

- **Timeout**: 2 seconds max
- **Features**: Static cache for common URLs, minimal database calls
- **Memory**: 128MB
- **Best for**: High-traffic redirects

### 3. `/api/r/[slug].ts` (FALLBACK) 🔄

- **Timeout**: 3 seconds max
- **Features**: Original optimized version
- **Memory**: 128MB
- **Best for**: Development testing

## Current Configuration

The system now uses `/api/direct/[slug]` as the primary endpoint via Vercel rewrites.

## Performance Optimizations Applied

### Database Level:

- ✅ Minimal field selection
- ✅ Optimized WHERE clauses
- ✅ Promise.race with timeout
- ✅ Async stats updates
- ✅ Connection pooling optimized

### Vercel Level:

- ✅ 2-second timeout limit
- ✅ 128MB memory allocation
- ✅ Aggressive caching headers
- ✅ Direct rewrites (no middleware overhead)

### Code Level:

- ✅ No try-catch overhead for fast path
- ✅ Early returns for validation
- ✅ Minimal imports
- ✅ writeHead() for fastest response

## Testing Different Endpoints

Test each endpoint directly:

```bash
# Primary (recommended)
curl -I https://your-domain.com/api/direct/your-slug

# Backup
curl -I https://your-domain.com/api/fast/your-slug

# Fallback
curl -I https://your-domain.com/api/r/your-slug
```

## Switching Endpoints

To switch to a different endpoint, update `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/s/:slug",
      "destination": "/api/fast/:slug" // Change this line
    }
  ]
}
```

## Emergency Fallback

If all APIs fail, you can use static redirects in `/api/fast/[slug].ts`:

```typescript
const staticRedirects: Record<string, string> = {
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourprofile',
  // Add your most important links here
};
```

## Database Connection Issues

If database timeouts persist:

1. **Check connection string**: Ensure `DATABASE_URL` is correct
2. **Database location**: Use same region as Vercel functions
3. **Connection pooling**: Consider using PgBouncer or similar
4. **Database performance**: Check slow query logs

## Monitoring

Watch these metrics in Vercel dashboard:

- Function duration (should be <1000ms)
- Error rate (should be <1%)
- Memory usage (should be <100MB)
- Cache hit rate

## Troubleshooting Commands

```bash
# Test database connection
vercel env ls

# Check function logs
vercel logs --function=api/direct/[slug]

# Monitor performance
vercel analytics
```

## Emergency Disable

If redirects completely fail, add this to `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/s/:slug",
      "destination": "https://your-main-site.com",
      "permanent": false
    }
  ]
}
```
