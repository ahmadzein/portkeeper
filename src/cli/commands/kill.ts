import { Command } from 'commander';
import chalk from 'chalk';
import { PortService } from '../../core/services/PortService.js';
import { formatError } from '../utils/format.js';

export const killCommand = new Command('kill')
  .description('Kill process using specified port(s)')
  .argument('<ports...>', 'Port numbers to kill processes on')
  .option('-f, --force', 'Force kill without confirmation')
  .option('--json', 'Output as JSON')
  .action(async (portStrs: string[], options: any) => {
    try {
      const service = new PortService();
      const ports = portStrs.map(p => parseInt(p, 10));
      
      if (options.json) {
        const results = [];
        for (const port of ports) {
          try {
            const status = await service.checkPort(port);
            if (status !== 'in-use') {
              results.push({ port, status: 'warning', message: 'Port is not in use' });
              continue;
            }
            await service.killProcess(port);
            results.push({ port, status: 'success' });
          } catch (error) {
            results.push({ port, status: 'error', message: (error as Error).message });
          }
        }
        console.log(JSON.stringify({ results }, null, 2));
        const hasErrors = results.some(r => r.status === 'error');
        if (hasErrors) {
          process.exit(1);
        }
        return;
      }
      
      let successCount = 0;
      let failCount = 0;

      for (const port of ports) {
        try {
          // Check if port is in use first
          const status = await service.checkPort(port);
          if (status !== 'in-use') {
            console.log(chalk.yellow(`⚠ Port ${port} is not in use`));
            continue;
          }

          if (!options.force) {
            console.log(chalk.yellow(`Killing process on port ${port}...`));
          }

          await service.killProcess(port);
          console.log(chalk.green(`✓ Process on port ${port} killed`));
          successCount++;
        } catch (error) {
          console.error(chalk.red(`✗ Failed to kill process on port ${port}: ${(error as Error).message}`));
          failCount++;
        }
      }

      if (ports.length > 1) {
        console.log(chalk.gray(`\nSummary: ${successCount} killed, ${failCount} failed`));
      }

      if (failCount > 0) {
        process.exit(1);
      }
    } catch (error) {
      console.error(formatError(error));
      process.exit(1);
    }
  });