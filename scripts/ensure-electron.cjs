#!/usr/bin/env node

const { execSync } = require('child_process');
const { existsSync } = require('fs');
const { join } = require('path');

function ensureElectron() {
  // Check if Electron is installed
  const electronPaths = [
    './node_modules/electron',
    '../node_modules/electron',
    '../../node_modules/electron',
    '../../../node_modules/electron'
  ];
  
  const hasElectron = electronPaths.some(path => existsSync(path));
  
  if (!hasElectron) {
    console.log('\n📦 Electron is not installed. Installing now...');
    console.log('This is a one-time setup (~100MB download)\n');
    
    try {
      // Install electron as an optional dependency
      execSync('npm install electron@28.0.0 --no-save', { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      // Rebuild native modules for Electron
      console.log('\nRebuilding native modules for Electron...');
      execSync(
        'npm rebuild better-sqlite3 --runtime=electron --target=28.0.0 --dist-url=https://electronjs.org/headers --abi=119',
        { stdio: 'inherit' }
      );
      
      console.log('\n✅ Electron installed successfully!');
      return true;
    } catch (error) {
      console.error('\n❌ Failed to install Electron:', error.message);
      console.log('\nPlease install manually with:');
      console.log('  npm install -g electron@28.0.0');
      return false;
    }
  }
  
  return true;
}

// Export for use in other scripts
module.exports = { ensureElectron };

// Run if called directly
if (require.main === module) {
  ensureElectron();
}