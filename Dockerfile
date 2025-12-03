FROM node:20-alpine AS base

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat openssl

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci --ignore-scripts; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

# Increase timeout for font downloads
ENV NEXT_FONT_GOOGLE_TIMEOUT=30000

# Set dummy environment variables for build
# These will be replaced at runtime with actual values
ENV NEXT_PUBLIC_SUPABASE_URL="https://placeholder.supabase.co"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="placeholder-key"
ENV DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
ENV DIRECT_URL="postgresql://user:password@localhost:5432/dbname?schema=public"

# Firebase dummy configuration (required for guestbook page build)
ENV NEXT_PUBLIC_FIREBASE_API_KEY="placeholder-api-key"
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="placeholder.firebaseapp.com"
ENV NEXT_PUBLIC_FIREBASE_DB_URL="https://placeholder.firebaseio.com"
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID="placeholder-project"
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="placeholder.appspot.com"
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
ENV NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:placeholder"
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-PLACEHOLDER"
ENV NEXT_PUBLIC_FIREBASE_CHAT_DB="messages"

# Build with Turborepo for faster builds and caching
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
