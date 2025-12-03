# Quick Deploy Script untuk VPS (PowerShell)
# Usage: .\quick-deploy.ps1

Write-Host "🚀 Starting deployment..." -ForegroundColor Green

# 1. Pull latest code
Write-Host "`n📥 Pulling latest code from GitHub..." -ForegroundColor Cyan
git pull origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git pull failed!" -ForegroundColor Red
    exit 1
}

# 2. Build Docker image (with cache)
Write-Host "`n🏗️  Building Docker image..." -ForegroundColor Cyan
docker build -t ilhame-id .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}

# 3. Stop old container
Write-Host "`n🛑 Stopping old container..." -ForegroundColor Cyan
docker stop ilhame-id-container 2>$null
docker rm ilhame-id-container 2>$null

# 4. Run new container
Write-Host "`n🎬 Starting new container..." -ForegroundColor Cyan
docker run -d `
  --name ilhame-id-container `
  -p 3000:3000 `
  --env-file .env `
  --restart unless-stopped `
  ilhame-id

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start container!" -ForegroundColor Red
    exit 1
}

# 5. Check container status
Write-Host "`n✅ Checking container status..." -ForegroundColor Cyan
Start-Sleep -Seconds 3
docker ps | Select-String "ilhame-id-container"

Write-Host "`n✨ Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Website should be available at http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "📊 View logs: docker logs -f ilhame-id-container" -ForegroundColor Gray
Write-Host "🔄 Restart: docker restart ilhame-id-container" -ForegroundColor Gray
Write-Host "🛑 Stop: docker stop ilhame-id-container" -ForegroundColor Gray
