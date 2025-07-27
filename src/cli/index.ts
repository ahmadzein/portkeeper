#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { checkCommand } from './commands/check.js';
import { reserveCommand } from './commands/reserve.js';
import { listCommand } from './commands/list.js';
import { releaseCommand } from './commands/release.js';
import { killCommand } from './commands/kill.js';
import { scanCommand } from './commands/scan.js';
import { exportCommand } from './commands/export.js';
import { importCommand } from './commands/import.js';
import { guiCommand } from './commands/gui.js';
import { requestCommand } from './commands/request.js';
import { aiCommand } from './commands/ai.js';

// Check for native module issues and fix automatically
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = join(__dirname, '..', '..');

try {
  // Try to load better-sqlite3 to check if it works
  await import('better-sqlite3');
} catch (error: any) {
  if (error.message && error.message.includes('NODE_MODULE_VERSION')) {
    console.log(chalk.yellow('🔧 Fixing native modules compatibility...'));
    try {
      execSync('npm rebuild better-sqlite3', { 
        stdio: 'inherit',
        cwd: packageRoot
      });
      console.log(chalk.green('✅ Native modules fixed! Please run your command again.'));
      process.exit(0);
    } catch (rebuildError) {
      console.error(chalk.red('❌ Failed to rebuild native modules automatically.'));
      console.log(chalk.yellow('\nPlease run this command manually:'));
      console.log(chalk.cyan('  npm rebuild better-sqlite3'));
      process.exit(1);
    }
  } else {
    throw error;
  }
}

const program = new Command();

program
  .name('portman')
  .description('Port Keeper - Manage your local development ports')
  .version('1.2.4');

program.addCommand(checkCommand);
program.addCommand(reserveCommand);
program.addCommand(listCommand);
program.addCommand(releaseCommand);
program.addCommand(killCommand);
program.addCommand(scanCommand);
program.addCommand(exportCommand);
program.addCommand(importCommand);
program.addCommand(guiCommand);
program.addCommand(requestCommand);
program.addCommand(aiCommand);

program.on('command:*', () => {
  console.error(chalk.red(`Invalid command: ${program.args.join(' ')}`));
  console.log('See --help for a list of available commands.');
  process.exit(1);
});

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}