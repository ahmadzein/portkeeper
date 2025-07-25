import { Command } from 'commander';
import chalk from 'chalk';
import { PortService } from '../../core/services/PortService.js';
import { formatError } from '../utils/format.js';

export const releaseCommand = new Command('release')
  .description('Release one or more reserved ports')
  .argument('<ports...>', 'Port numbers to release')
  .action(async (portStrs: string[]) => {
    try {
      const service = new PortService();
      const ports = portStrs.map(p => parseInt(p, 10));
      
      let successCount = 0;
      let failCount = 0;

      for (const port of ports) {
        try {
          await service.releasePort(port);
          console.log(chalk.green(`✓ Port ${port} released`));
          successCount++;
        } catch (error) {
          console.error(chalk.red(`✗ Failed to release port ${port}: ${(error as Error).message}`));
          failCount++;
        }
      }

      if (ports.length > 1) {
        console.log(chalk.gray(`\nSummary: ${successCount} released, ${failCount} failed`));
      }

      if (failCount > 0) {
        process.exit(1);
      }
    } catch (error) {
      console.error(formatError(error));
      process.exit(1);
    }
  });