#!/usr/bin/env python3
"""Generate missing icon sizes by copying existing ones"""

import shutil
import os

# Map of missing files to source files
icon_mapping = {
    'icon-72x72.png': 'apple-touch-icon.png',
    'icon-96x96.png': 'apple-touch-icon.png',
    'icon-128x128.png': 'apple-touch-icon.png',
    'icon-144x144.png': 'apple-touch-icon.png',
    'icon-152x152.png': 'apple-touch-icon.png',
    'icon-384x384.png': 'android-chrome-512x512.png',
    'mstile-150x150.png': 'apple-touch-icon.png'
}

def main():
    """Copy existing icons to create missing sizes"""
    print("Creating missing icon files...")
    
    for target, source in icon_mapping.items():
        if os.path.exists(source):
            shutil.copy2(source, target)
            print(f"Created: {target} (copied from {source})")
        else:
            print(f"Warning: Source file {source} not found")
    
    print("\nAll icon files created!")
    print("\nNote: These are placeholder copies. For production, you should:")
    print("1. Generate proper sized icons using an image editor")
    print("2. Or use an online favicon generator service")
    print("3. Or use ImageMagick: convert favicon.svg -resize 72x72 icon-72x72.png")

if __name__ == "__main__":
    main()