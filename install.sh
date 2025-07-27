#!/bin/bash

# Port Manager Installation Script
# This script clones and installs Port Manager from source

echo "🚀 Installing Port Manager..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 18.0.0 first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be >= 18.0.0. Current version: $(node -v)"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Create temporary directory
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

echo "📦 Cloning repository..."
git clone https://github.com/ahmadzein/portmanager.git
cd portmanager

echo "📥 Installing dependencies..."
npm install

echo "🔨 Building project..."
npm run build

echo "🔗 Linking globally..."
npm link

echo ""
echo "✅ Port Manager installed successfully!"
echo ""
echo "🎯 Quick start:"
echo "  - CLI: portman --help"
echo "  - GUI: portman gui"
echo ""
echo "📚 Documentation: https://github.com/ahmadzein/portmanager#readme"

# Cleanup
cd ~
rm -rf "$TEMP_DIR"