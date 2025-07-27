#!/bin/bash

echo "🌐 Starting documentation server..."
echo "📍 URL: http://localhost:8001/docs"
echo "Press Ctrl+C to stop"
echo ""

cd ..
python3 -m http.server 8001 || python -m SimpleHTTPServer 8001