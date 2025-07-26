#!/bin/bash

echo "Checking GUI build files..."
echo "Main file exists: $(test -f dist/electron/main/index.js && echo "YES" || echo "NO")"
echo "Preload file exists: $(test -f dist/electron/preload/index.js && echo "YES" || echo "NO")"
echo "Renderer exists: $(test -f dist/electron/renderer/index.html && echo "YES" || echo "NO")"

echo -e "\nPreload file path in main:"
grep -n "preload:" dist/electron/main/index.js | head -5

echo -e "\nStarting GUI with debug..."
DEBUG_ELECTRON=1 npm start