#!/usr/bin/env node

// This wrapper ensures native modules are built correctly before loading the main CLI
const { execSync } = require('child_process');
const { join } = require('path');

// Function to check if rebuild is needed
function checkAndRebuildIfNeeded() {
  try {
    // Try to actually instantiate better-sqlite3 to trigger native module load
    const Database = require('better-sqlite3');
    const db = new Database(':memory:');
    db.close();
    return false; // No rebuild needed
  } catch (error) {
    if (error.message && error.message.includes('NODE_MODULE_VERSION')) {
      return true; // Rebuild needed
    } else if (error.code === 'MODULE_NOT_FOUND') {
      console.error('\x1b[31mError: better-sqlite3 is not installed.\x1b[0m');
      console.log('\x1b[33mThis should not happen. Please reinstall portkeeper.\x1b[0m');
      process.exit(1);
    } else {
      // Some other error
      console.error('\x1b[31mError checking native modules:\x1b[0m', error.message);
      return true; // Try rebuild anyway
    }
  }
}

// Main execution
async function main() {
  const needsRebuild = checkAndRebuildIfNeeded();
  
  if (needsRebuild) {
    console.log('\x1b[33m🔧 First time setup: Building native modules for your Node.js version...\x1b[0m');
    try {
      const packageRoot = join(__dirname, '..', '..');
      execSync('npm rebuild better-sqlite3', { 
        stdio: 'inherit',
        cwd: packageRoot
      });
      console.log('\x1b[32m✅ Setup complete!\x1b[0m');
      console.log('\x1b[36m\nStarting Port Keeper...\n\x1b[0m');
      
      // Small delay to ensure everything is ready
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (rebuildError) {
      console.error('\x1b[31m❌ Failed to build native modules automatically.\x1b[0m');
      console.log('\x1b[33m\nPlease run this command manually:\x1b[0m');
      console.log('\x1b[36m  npm rebuild better-sqlite3\x1b[0m');
      console.log('\x1b[33m\nIf you continue to have issues, try:\x1b[0m');
      console.log('\x1b[36m  npm uninstall -g portkeeper\x1b[0m');
      console.log('\x1b[36m  npm install -g portkeeper\x1b[0m');
      process.exit(1);
    }
  }

  // Now import and run the actual CLI using dynamic import
  try {
    await import('./index-real.js');
  } catch (error) {
    console.error('\x1b[31mFailed to start Port Keeper:\x1b[0m', error.message);
    if (error.message.includes('NODE_MODULE_VERSION')) {
      console.log('\x1b[33m\nThe automatic rebuild failed. Please try manually:\x1b[0m');
      console.log('\x1b[36m  npm rebuild better-sqlite3\x1b[0m');
    }
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('\x1b[31mUnexpected error:\x1b[0m', error);
  process.exit(1);
});