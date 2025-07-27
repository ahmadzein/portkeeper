#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure images directory exists
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// SVG templates for each image
const svgs = {
    'logo.png': `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#667eea"/>
        <circle cx="100" cy="100" r="80" fill="white"/>
        <text x="100" y="120" font-family="Arial" font-size="100" font-weight="bold" text-anchor="middle" fill="#667eea">P</text>
        <circle cx="140" cy="60" r="8" fill="#10b981"/>
        <circle cx="140" cy="140" r="8" fill="#10b981"/>
    </svg>`,

    'og-image.png': `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#bg)"/>
        <circle cx="600" cy="200" r="60" fill="white"/>
        <text x="600" y="220" font-family="Arial" font-size="80" font-weight="bold" text-anchor="middle" fill="#667eea">P</text>
        <text x="600" y="350" font-family="Arial" font-size="72" font-weight="bold" text-anchor="middle" fill="white">Port Keeper</text>
        <text x="600" y="420" font-family="Arial" font-size="36" text-anchor="middle" fill="white">Intelligent Port Management for Developers</text>
        <text x="600" y="520" font-family="Arial" font-size="24" text-anchor="middle" fill="white">🚀 Reserve Ports  •  🔍 Detect Conflicts  •  👥 Team Collaboration</text>
    </svg>`,

    'twitter-card.png': `<svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="1200" height="600" fill="url(#bg2)"/>
        <circle cx="600" cy="180" r="60" fill="white"/>
        <text x="600" y="200" font-family="Arial" font-size="80" font-weight="bold" text-anchor="middle" fill="#667eea">P</text>
        <text x="600" y="320" font-family="Arial" font-size="72" font-weight="bold" text-anchor="middle" fill="white">Port Keeper</text>
        <text x="600" y="390" font-family="Arial" font-size="36" text-anchor="middle" fill="white">Intelligent Port Management for Developers</text>
        <text x="600" y="490" font-family="Arial" font-size="28" font-family="monospace" text-anchor="middle" fill="white">npm install -g portkeeper</text>
    </svg>`,

    'screenshot.png': `<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
        <rect width="1280" height="720" fill="#1a1a1a"/>
        <rect x="100" y="100" width="1080" height="520" fill="#2d2d2d"/>
        <rect x="100" y="100" width="1080" height="40" fill="#3d3d3d"/>
        <circle cx="130" cy="120" r="6" fill="#ff5f56"/>
        <circle cx="150" cy="120" r="6" fill="#ffbd2e"/>
        <circle cx="170" cy="120" r="6" fill="#27c93f"/>
        <text x="140" y="200" font-family="monospace" font-size="20" fill="#10b981">$ portman list</text>
        <text x="140" y="250" font-family="monospace" font-size="18" fill="#e5e5e5">PORT   SERVICE          PROJECT      STATUS</text>
        <text x="140" y="280" font-family="monospace" font-size="18" fill="#e5e5e5">----   -------          -------      ------</text>
        <text x="140" y="310" font-family="monospace" font-size="18" fill="#e5e5e5">3000   React Dev        my-app       Active</text>
        <text x="140" y="340" font-family="monospace" font-size="18" fill="#e5e5e5">8080   API Server       backend      Reserved</text>
        <text x="140" y="370" font-family="monospace" font-size="18" fill="#e5e5e5">5432   PostgreSQL       database     Active</text>
        <text x="140" y="400" font-family="monospace" font-size="18" fill="#e5e5e5">6379   Redis           cache        Reserved</text>
        <text x="140" y="480" font-family="monospace" font-size="20" fill="#10b981">$ portman check 3000</text>
        <text x="140" y="510" font-family="monospace" font-size="18" fill="#e5e5e5">✓ Port 3000 is in use by: React Dev (my-app)</text>
    </svg>`
};

// Create a simple SVG to PNG converter using canvas (if available)
// For now, we'll save as SVG files which modern browsers support
console.log('Generating SEO images...\n');

Object.entries(svgs).forEach(([filename, svg]) => {
    const svgPath = path.join(imagesDir, filename.replace('.png', '.svg'));
    fs.writeFileSync(svgPath, svg);
    console.log(`✅ Created: ${svgPath}`);
});

console.log('\n📝 Note: Generated as SVG files. To convert to PNG:');
console.log('1. Use an online converter like https://cloudconvert.com/svg-to-png');
console.log('2. Or install ImageMagick and run:');
console.log('   for file in images/*.svg; do convert "$file" "${file%.svg}.png"; done');
console.log('3. Or use the browser-based generator: open images/generate-seo-images.html');

// Also create a simple redirect HTML for social media images
const redirectHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Port Keeper</title>
    <meta property="og:image" content="/images/og-image.png">
    <meta property="twitter:image" content="/images/twitter-card.png">
    <meta http-equiv="refresh" content="0; url=/">
</head>
<body>
    <p>Redirecting to Port Keeper...</p>
</body>
</html>`;

fs.writeFileSync(path.join(imagesDir, 'social.html'), redirectHtml);
console.log('\n✅ Created social media redirect page: images/social.html');