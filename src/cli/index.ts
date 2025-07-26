#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
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

const program = new Command();

program
  .name('portman')
  .description('Port Manager - Manage your local development ports')
  .version('1.0.0');

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