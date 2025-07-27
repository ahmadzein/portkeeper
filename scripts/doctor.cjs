#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🔧 Fixing portkeeper installation...');

try {
  // Get the directory where this script is located
  const scriptDir = __dirname;
  const packageDir = path.resolve(scriptDir, '..');
  
  console.log('Rebuilding native modules for Node.js...');
  execSync('npm rebuild better-sqlite3', { 
    stdio: 'inherit',
    cwd: packageDir
  });
  
  console.log('✅ Native modules fixed!');
  console.log('\nYou can now use portman commands.');
  
} catch (error) {
  console.error('❌ Fix failed:', error.message);
  console.log('\nPlease try manually running:');
  console.log('  npm rebuild better-sqlite3');
  process.exit(1);
}