#!/usr/bin/env node

const { execSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

console.log('🔧 Setting up portkeeper...');

try {
  // Get the installation directory - for npm install, we need the actual package directory
  const installDir = path.resolve(__dirname, '..');
  console.log('Installation directory:', installDir);
  
  // Always rebuild for Node.js first
  console.log('Rebuilding native modules for Node.js...');
  execSync('npm rebuild better-sqlite3', { 
    stdio: 'inherit',
    cwd: installDir
  });
  console.log('✅ Native modules prepared for CLI');
  
  // Check if Electron is installed
  const electronPath = path.join(installDir, 'node_modules', 'electron');
  const hasElectron = existsSync(electronPath);
  
  if (hasElectron) {
    console.log('\nElectron detected. Preparing GUI support...');
    try {
      // Create a separate build for Electron
      execSync(
        'npm rebuild better-sqlite3 --runtime=electron --target=28.0.0 --dist-url=https://electronjs.org/headers --abi=119',
        { 
          stdio: 'inherit',
          cwd: installDir
        }
      );
      console.log('✅ Native modules prepared for GUI');
    } catch (electronError) {
      console.log('⚠️  Could not prepare Electron modules. GUI may require manual setup.');
    }
  }
  
  console.log('\n✨ Portkeeper installation complete!');
  console.log('\nUsage:');
  console.log('  portman --help     Show all available commands');
  console.log('  portman list       List all managed ports');
  console.log('  portman gui        Launch the GUI (requires Electron)');
  
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  console.log('\nYou may need to manually rebuild native modules:');
  console.log('  npm rebuild better-sqlite3');
  // Don't exit with error as this might cause npm install to fail
}