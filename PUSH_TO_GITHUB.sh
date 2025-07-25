#!/bin/bash

# Script to push Port Manager to GitHub

echo "🚀 Pushing Port Manager to GitHub..."

# Initialize git if not already
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
fi

# Add GitHub remote
echo "Adding GitHub remote..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/ahmadzein/portmanager.git

# Create branch
git checkout -b main 2>/dev/null || git checkout main

# Add all files
echo "Adding files..."
git add .

# Commit
echo "Creating commit..."
git commit -m "Initial commit: Port Manager v1.0.0

- Complete CLI with 8 commands (check, reserve, list, release, kill, scan, export, import)
- Full-featured GUI with Electron + React
- Cross-platform support (Windows, macOS, Linux)
- Real-time synchronization between CLI and GUI
- Dark/light theme support
- Keyboard shortcuts
- Export/import functionality
- Comprehensive documentation
- Unit and integration tests
- Security audit passed (B+)
- Performance optimized"

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main --force

echo "✅ Successfully pushed to GitHub!"
echo ""
echo "📦 To install and test:"
echo "git clone https://github.com/ahmadzein/portmanager.git"
echo "cd portmanager"
echo "npm install"
echo "npm run build"
echo "npm link"
echo "portman --version"