import { Command } from 'commander';
import { spawn } from 'child_process';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const guiCommand = new Command('gui')
  .description('Launch the Port Manager GUI application')
  .action(() => {
    console.log(chalk.blue('🚀 Launching Port Manager GUI...'));
    
    // Get the path to the Electron app
    const projectRoot = path.resolve(__dirname, '..', '..', '..');
    const electronPath = path.join(projectRoot, 'node_modules', '.bin', 'electron');
    const mainPath = path.join(projectRoot, 'dist', 'electron', 'main', 'index.js');
    
    // Check if the GUI is built
    if (!fs.existsSync(mainPath)) {
      console.error(chalk.red('❌ GUI is not built. Please run "npm run build:gui" first.'));
      process.exit(1);
    }
    
    // Check if electron is installed
    if (!fs.existsSync(electronPath)) {
      console.error(chalk.red('❌ Electron is not installed. Please run "npm install" first.'));
      process.exit(1);
    }
    
    // Change to project directory and run npm start
    console.log(chalk.gray(`Working directory: ${projectRoot}`));
    
    // Spawn npm start process
    const electronProcess = spawn('npm', ['start'], {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: true,
      detached: false
    });
    
    electronProcess.on('error', (error) => {
      console.error(chalk.red(`❌ Failed to launch GUI: ${error.message}`));
      process.exit(1);
    });
    
    electronProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        console.error(chalk.red(`❌ GUI exited with code ${code}`));
      }
    });
  });