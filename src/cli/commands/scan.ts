import { Command } from 'commander';
import chalk from 'chalk';
import { PortService } from '../../core/services/PortService.js';
import { formatError, formatTable } from '../utils/format.js';

export const scanCommand = new Command('scan')
  .description('Scan for all ports currently in use')
  .option('--json', 'Output as JSON')
  .option('--range <range>', 'Port range to scan (e.g., 3000-4000)')
  .action(async (options: any) => {
    try {
      const service = new PortService();
      
      if (!options.json) {
        console.log(chalk.gray('Scanning for active ports...'));
      }
      const activePorts = await service.scanActivePorts();

      // Filter by range if specified
      let filteredPorts = activePorts;
      if (options.range) {
        const [min, max] = options.range.split('-').map((n: string) => parseInt(n, 10));
        filteredPorts = activePorts.filter(p => p.number >= min && p.number <= max);
      }

      // Sort by port number
      filteredPorts.sort((a, b) => a.number - b.number);

      if (options.json) {
        console.log(JSON.stringify(filteredPorts, null, 2));
        return;
      }

      if (filteredPorts.length === 0) {
        console.log(chalk.gray('No active ports found'));
        return;
      }

      console.log(chalk.green(`\nFound ${filteredPorts.length} active port(s):\n`));

      const headers = ['Port', 'PID', 'Process'];
      const rows = filteredPorts.map(port => [
        port.number.toString(),
        port.pid.toString(),
        port.processName || 'Unknown',
      ]);

      console.log(formatTable(headers, rows));

      // Check for reserved ports that are now in use
      const ports = await service.listPorts({ status: 'reserved' });
      const reservedInUse = ports.filter(p => 
        filteredPorts.some(ap => ap.number === p.number)
      );

      if (reservedInUse.length > 0) {
        console.log(chalk.yellow('\n⚠ Reserved ports that are now in use:'));
        reservedInUse.forEach(port => {
          console.log(chalk.yellow(`  - Port ${port.number} (${port.projectName})`));
        });
      }
    } catch (error) {
      console.error(formatError(error));
      process.exit(1);
    }
  });