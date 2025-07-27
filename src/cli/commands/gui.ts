import { Command } from 'commander';
import chalk from 'chalk';
import { spawn, execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const findElectronExecutable = (): string | null => {
  const possiblePaths = [
    // When installed globally via npm
    join(__dirname, '..', '..', '..', 'node_modules', 'electron', 'dist', 'Electron.app', 'Contents', 'MacOS', 'Electron'),
    join(__dirname, '..', '..', '..', 'node_modules', 'electron', 'dist', 'electron.exe'),
    join(__dirname, '..', '..', '..', 'node_modules', 'electron', 'dist', 'electron'),
    
    // When running from source
    join(__dirname, '..', '..', '..', '..', 'node_modules', 'electron', 'dist', 'Electron.app', 'Contents', 'MacOS', 'Electron'),
    join(__dirname, '..', '..', '..', '..', 'node_modules', 'electron', 'dist', 'electron.exe'),
    join(__dirname, '..', '..', '..', '..', 'node_modules', 'electron', 'dist', 'electron'),
    
    // Global electron installation
    join(homedir(), '.npm-global', 'lib', 'node_modules', 'electron', 'dist', 'Electron.app', 'Contents', 'MacOS', 'Electron'),
    join(homedir(), '.npm-global', 'lib', 'node_modules', 'electron', 'dist', 'electron.exe'),
    join(homedir(), '.npm-global', 'lib', 'node_modules', 'electron', 'dist', 'electron'),
  ];
  
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }
  
  return null;
};

const findGuiEntry = (): string | null => {
  const possiblePaths = [
    // When installed via npm
    join(__dirname, '..', '..', 'electron', 'main', 'index.js'),
    join(__dirname, '..', '..', 'gui', 'main', 'index.js'),
    
    // When running from source
    join(__dirname, '..', '..', '..', 'dist', 'electron', 'main', 'index.js'),
    join(__dirname, '..', '..', '..', 'dist', 'gui', 'main', 'index.js'),
  ];
  
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }
  
  return null;
};

const ensureElectronAndModules = (): boolean => {
  try {
    // First check if Electron is available
    const hasElectron = findElectronExecutable() !== null;
    
    if (!hasElectron) {
      console.log(chalk.yellow('\n📦 Electron is required for the GUI'));
      console.log(chalk.gray('Installing Electron and preparing native modules...\n'));
      
      try {
        // Install Electron locally in the global node_modules
        const globalModulesPath = join(__dirname, '..', '..', '..');
        execSync(
          'npm install electron@28.0.0 --no-save --prefix ' + globalModulesPath,
          { stdio: 'inherit' }
        );
        
        // Rebuild native modules for Electron
        console.log(chalk.gray('\nRebuilding native modules for Electron...'));
        execSync(
          `npm rebuild better-sqlite3 --runtime=electron --target=28.0.0 --dist-url=https://electronjs.org/headers --abi=119`,
          { 
            cwd: globalModulesPath,
            stdio: 'inherit' 
          }
        );
        
        console.log(chalk.green('✅ Electron installed and modules prepared!\n'));
        return true;
      } catch (installError) {
        console.error(chalk.red('Failed to install Electron:'), installError instanceof Error ? installError.message : String(installError));
        return false;
      }
    }
    
    // Electron exists, just ensure modules are rebuilt
    console.log(chalk.gray('Checking native modules compatibility...'));
    const testPath = join(__dirname, '..', '..', '..');
    
    try {
      execSync(
        `npm rebuild better-sqlite3 --runtime=electron --target=28.0.0 --dist-url=https://electronjs.org/headers --abi=119`,
        { 
          cwd: testPath,
          stdio: 'pipe' 
        }
      );
      return true;
    } catch (rebuildError) {
      // Silently continue - module might already be built correctly
      return true;
    }
  } catch (error) {
    console.error(chalk.red('Error preparing GUI:'), error instanceof Error ? error.message : String(error));
    return false;
  }
};

export const guiCommand = new Command('gui')
  .description('Launch the Port Keeper GUI application')
  .option('--dev', 'Run in development mode')
  .option('--skip-rebuild', 'Skip native module rebuild check')
  .action((options) => {
    try {
      const electronPath = findElectronExecutable();
      const guiEntry = findGuiEntry();
      
      if (!electronPath || !guiEntry) {
        console.log(chalk.yellow('\n⚠️  GUI components not found.\n'));
        
        if (!electronPath) {
          console.log(chalk.red('Electron is not installed.'));
        }
        
        if (!guiEntry) {
          console.log(chalk.red('GUI files are missing.'));
        }
        
        console.log(chalk.cyan('\nTo use the GUI, you have two options:\n'));
        
        console.log(chalk.white('Option 1: Install from source'));
        console.log(chalk.gray('  git clone https://github.com/ahmadzein/portkeeper.git'));
        console.log(chalk.gray('  cd portkeeper'));
        console.log(chalk.gray('  npm install'));
        console.log(chalk.gray('  npm run dev:gui\n'));
        
        console.log(chalk.white('Option 2: Reinstall portkeeper with optional dependencies'));
        console.log(chalk.gray('  npm uninstall -g portkeeper'));
        console.log(chalk.gray('  npm install -g portkeeper --include=optional\n'));
        
        console.log(chalk.yellow('Note: The GUI requires Electron which is a large dependency (~100MB).'));
        console.log(chalk.yellow('It is marked as optional to keep the CLI lightweight.\n'));
        
        return;
      }
      
      // Check and rebuild native modules if needed (unless skipped)
      if (!options.skipRebuild) {
        if (!ensureElectronAndModules()) {
          console.log(chalk.red('\n❌ Failed to prepare the GUI environment'));
          console.log(chalk.yellow('You can try:'));
          console.log(chalk.gray('  1. Running with --skip-rebuild flag'));
          console.log(chalk.gray('  2. Installing with: npm install -g portkeeper --include=optional'));
          return;
        }
      }
      
      console.log(chalk.blue('🚀 Launching Port Keeper GUI...\n'));
      
      const env = { ...process.env };
      if (options.dev) {
        env.ELECTRON_IS_DEV = '1';
      }
      
      const child = spawn(electronPath, [guiEntry], {
        detached: true,
        stdio: 'ignore',
        env
      });
      
      child.unref();
      
      console.log(chalk.green('✅ GUI launched!'));
      console.log(chalk.gray('\nThe Port Keeper GUI is now running.'));
      console.log(chalk.gray('You can close this terminal window.\n'));
      
    } catch (error) {
      console.error(chalk.red('\n❌ Error launching GUI:'), error instanceof Error ? error.message : String(error));
      console.error(chalk.gray('\nPlease try reinstalling with: npm install -g portkeeper --include=optional'));
    }
  });

// Add install subcommand that installs electron
guiCommand
  .command('install')
  .description('Install GUI dependencies (Electron)')
  .action(async () => {
    try {
      console.log(chalk.blue('📦 Installing GUI dependencies...\n'));
      console.log(chalk.yellow('This will install Electron (~100MB) as an optional dependency.\n'));
      
      console.log(chalk.cyan('Please run:'));
      console.log(chalk.white('  npm install -g portkeeper --include=optional\n'));
      
      console.log(chalk.gray('This ensures Electron is properly installed for the GUI.'));
      
    } catch (error) {
      console.error(chalk.red('\n❌ Installation failed:'), error instanceof Error ? error.message : String(error));
    }
  });