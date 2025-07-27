#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")/.."

# Build the GUI first
echo "Building GUI..."
npm run build:gui

# Fix sqlite3 for Electron
echo "Fixing native modules for Electron..."
npm run fix:electron

# Run the GUI
echo "Launching GUI..."
npm start