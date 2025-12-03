#!/bin/bash

# Quick Deploy Script untuk VPS
# Usage: ./quick-deploy.sh

set -e

echo "🚀 Starting deployment..."

# 1. Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# 2. Build Docker image (with cache)
echo "🏗️  Building Docker image..."
docker build -t ilhame-id .

# 3. Stop old container
echo "🛑 Stopping old container..."
docker stop ilhame-id-container 2>/dev/null || true

# 4. Remove old container
echo "🗑️  Removing old container..."
docker rm ilhame-id-container 2>/dev/null || true

# 5. Run new container
echo "🎬 Starting new container..."
docker run -d \
  --name ilhame-id-container \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  ilhame-id

# 6. Check container status
echo "✅ Checking container status..."
sleep 3
docker ps | grep ilhame-id-container

echo ""
echo "✨ Deployment completed successfully!"
echo "🌐 Website should be available at http://localhost:3000"
echo ""
echo "📊 View logs: docker logs -f ilhame-id-container"
echo "🔄 Restart: docker restart ilhame-id-container"
echo "🛑 Stop: docker stop ilhame-id-container"
