#!/bin/bash

echo "🚀 Starting Port Manager Website Server..."
echo "📍 URL: http://localhost:8000"
echo "Press Ctrl+C to stop"
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
# Check if Python 2 is available
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 8000
# Use Node.js if available
elif command -v npx &> /dev/null; then
    npx serve -p 8000
else
    echo "❌ Error: No suitable web server found."
    echo "Please install Python or Node.js"
    exit 1
fi