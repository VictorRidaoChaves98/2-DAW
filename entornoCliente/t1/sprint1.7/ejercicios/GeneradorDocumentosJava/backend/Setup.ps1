<#
Setup.ps1 - Prepare environment and run docker-compose for GeneradorDocumentosJava backend+frontend

This script checks for Docker and docker-compose and then builds and runs the services.
Run as Administrator if you need to install software.
#>

Write-Host "== Setup script for GeneradorDocumentosJava ==" -ForegroundColor Cyan

function Check-Command($cmd) {
  $null -ne (Get-Command $cmd -ErrorAction SilentlyContinue)
}

if (-not (Check-Command docker)) {
  Write-Host "Docker is not installed or not on PATH. Please install Docker Desktop for Windows and re-run." -ForegroundColor Red
  exit 1
}

if (-not (Check-Command docker-compose)) {
  Write-Host "docker-compose not found. Docker Compose v2 is included in Docker Desktop; ensure 'docker-compose' is available." -ForegroundColor Yellow
}

# Set default environment variables if not present
if (-not $env:LMSTUDIO_URL) { $env:LMSTUDIO_URL = 'http://host.docker.internal:1234' }
if (-not $env:LMSTUDIO_API_PATH) { $env:LMSTUDIO_API_PATH = '/api/generate' }
if (-not $env:LMSTUDIO_MODEL) { $env:LMSTUDIO_MODEL = 'qwen/qwen3-4b-2507' }
if (-not $env:USE_IA) { $env:USE_IA = 'false' }

Write-Host "LMStudio URL: $env:LMSTUDIO_URL" -ForegroundColor Green
Write-Host "LMStudio API Path: $env:LMSTUDIO_API_PATH" -ForegroundColor Green
Write-Host "LMStudio Model: $env:LMSTUDIO_MODEL" -ForegroundColor Green
Write-Host "USE_IA: $env:USE_IA" -ForegroundColor Green

# Build and run
Write-Host "Building and starting services with docker-compose..." -ForegroundColor Cyan
docker-compose up --build -d

if ($LASTEXITCODE -ne 0) {
  Write-Host "docker-compose failed. Check Docker Desktop is running and try again." -ForegroundColor Red
  exit 1
}

Write-Host "Services started. Backend: http://localhost:3000  Frontend: http://localhost:8978" -ForegroundColor Green
Write-Host "If your LMStudio is running on the host, docker-compose config uses host.docker.internal to reach it." -ForegroundColor Yellow
