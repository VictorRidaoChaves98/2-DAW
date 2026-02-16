<#
Setup.ps1 — Windows helper to prepare environment for the project

Usage:
  .\Setup.ps1           # interactive
  .\Setup.ps1 -Auto    # non-interactive, accept defaults when possible

What it does:
  - Checks for `node`, `npm`, `docker` and `pandoc` on PATH
  - Optionally installs Node (via winget) and Docker Desktop (via winget) if missing
  - Runs `npm ci` in `backend` and `backend/frontend`
  - Optionally runs `docker compose up --build` to start services, or prepares local dev commands

Notes:
  - This script uses `winget` to install packages when available. It will NOT attempt to install silently without consent unless `-Auto` is provided.
  - You may need to run PowerShell as Administrator for installs.
#>

param(
  [switch]$Auto
)

function Test-Command($cmd) {
  $which = (Get-Command $cmd -ErrorAction SilentlyContinue)
  return $which -ne $null
}

function Prompt-YesNo($msg) {
  if ($Auto) { return $true }
  $r = Read-Host "$msg [y/N]"
  return $r -match '^[Yy]'
}

Write-Host "== Setup GeneradorDocumentosJava ==" -ForegroundColor Cyan

# Check Node
if (Test-Command node) {
  $nv = & node -v
  Write-Host "Node found: $nv"
} else {
  Write-Host "Node.js not found on PATH." -ForegroundColor Yellow
  if (Test-Command winget) {
    if (Prompt-YesNo "Install Node.js LTS via winget?") {
      Write-Host "Installing Node.js LTS... (requires admin)" -ForegroundColor Cyan
      winget install --id OpenJS.NodeJS.LTS -e --silent
    }
  } else {
    Write-Host "Please install Node.js LTS from https://nodejs.org/ and re-run this script." -ForegroundColor Yellow
  }
}

# Check Docker
if (Test-Command docker) {
  $dv = & docker --version
  Write-Host "Docker found: $dv"
} else {
  Write-Host "Docker not found on PATH." -ForegroundColor Yellow
  if (Test-Command winget) {
    if (Prompt-YesNo "Install Docker Desktop via winget?") {
      Write-Host "Installing Docker Desktop... (requires admin)" -ForegroundColor Cyan
      winget install --id Docker.DockerDesktop -e --silent
      Write-Host "After Docker installation, ensure WSL2 (if used) is set up and restart your machine if required." -ForegroundColor Yellow
    }
  } else {
    Write-Host "Please install Docker Desktop from https://www.docker.com/get-started and re-run this script." -ForegroundColor Yellow
  }
}

# Check Pandoc (optional)
if (Test-Command pandoc) {
  Write-Host "Pandoc found: $(pandoc --version | Select-Object -First 1)"
} else {
  Write-Host "Pandoc not found. It's optional (used if you prefer Pandoc for PDF)." -ForegroundColor Yellow
  if (Test-Command winget -and (Prompt-YesNo "Install Pandoc via winget?")) {
    winget install --id "JohnLyon.Pandoc" -e --silent
  }
}

# Install npm deps
Write-Host "\n== Installing backend dependencies ==" -ForegroundColor Cyan
Push-Location "backend"
if (Test-Command npm) {
  Write-Host "Running npm ci in backend..."
  npm ci
} else { Write-Host "npm not found — skipping npm install for backend." -ForegroundColor Yellow }
Pop-Location

Write-Host "\n== Installing frontend dependencies ==" -ForegroundColor Cyan
Push-Location "backend/frontend"
if (Test-Command npm) {
  Write-Host "Running npm install in frontend..."
  npm install
} else { Write-Host "npm not found — skipping frontend install." -ForegroundColor Yellow }
Pop-Location

# Offer to run using Docker or local dev
Write-Host "\n== Ready to start services ==" -ForegroundColor Cyan
if (Test-Command docker) {
  if (Prompt-YesNo "Start services with Docker Compose now? (docker compose up --build)") {
    Write-Host "Starting docker compose..."
    docker compose up --build
    return
  }
}

Write-Host "You can run the services locally with these commands:" -ForegroundColor Green
Write-Host "  Backend (dev): open a terminal and run: cd backend; npm run dev" -ForegroundColor Green
Write-Host "  Frontend (dev): open a terminal and run: cd backend/frontend; npm run dev -- --port 8978" -ForegroundColor Green
Write-Host "Or, to run in Docker: docker compose up --build" -ForegroundColor Green

Write-Host "Setup script finished." -ForegroundColor Cyan
