import { writeFileSync } from 'fs';
import { join } from 'path';

// Simple script to create placeholder PNG icons
const sizes = [16, 48, 128];

function createPlaceholderSVG(size: number): string {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size/6}" fill="url(#grad)"/>
  <text x="${size/2}" y="${size*0.7}" font-size="${size*0.6}" text-anchor="middle" fill="white">📎</text>
</svg>`;
}

// Create SVG files for each size
sizes.forEach(size => {
  const svg = createPlaceholderSVG(size);
  const filename = join('public', 'icons', `icon${size}.svg`);
  writeFileSync(filename, svg);
  console.log(`Created ${filename}`);
});

console.log('\nNote: For production, convert SVG to PNG using:');
console.log('  npm install -g sharp-cli');
console.log('  sharp -i icon.svg -o icon16.png resize 16 16');
