#!/bin/bash

# Fix native modules for both Node.js and Electron
echo "🔧 Fixing native modules..."

# Check if we're running CLI or GUI
if [ "$1" == "electron" ]; then
    echo "📦 Rebuilding for Electron..."
    npm rebuild better-sqlite3 --runtime=electron --target=28.0.0 --dist-url=https://electronjs.org/headers --abi=119
    echo "✅ Native modules fixed for Electron"
else
    echo "📦 Rebuilding for Node.js..."
    npm rebuild better-sqlite3
    echo "✅ Native modules fixed for Node.js"
fi