import { Command } from 'commander';
import chalk from 'chalk';
import { PortService } from '../../core/services/PortService.js';
import { PortStatus } from '../../core/models/Port.js';
import { formatError, formatTable } from '../utils/format.js';

export const listCommand = new Command('list')
  .description('List all reserved and in-use ports')
  .option('-s, --status <status>', 'Filter by status (reserved, in-use, free)')
  .option('-p, --project <name>', 'Filter by project name')
  .option('-t, --tags <tags...>', 'Filter by tags')
  .option('--json', 'Output as JSON')
  .action(async (options: any) => {
    try {
      const service = new PortService();
      
      const filter: any = {};
      if (options.status) {
        filter.status = options.status as PortStatus;
      }
      if (options.project) {
        filter.projectName = options.project;
      }
      if (options.tags) {
        filter.tags = options.tags;
      }

      const ports = await service.listPorts(filter);

      if (options.json) {
        console.log(JSON.stringify(ports, null, 2));
        return;
      }

      if (ports.length === 0) {
        console.log(chalk.gray('No ports found'));
        return;
      }

      const headers = ['Port', 'Project', 'Status', 'Description', 'Reserved At'];
      const rows = ports.map(port => [
        port.number.toString(),
        port.projectName,
        formatStatus(port.status),
        port.description || '-',
        new Date(port.reservedAt).toLocaleString(),
      ]);

      console.log(formatTable(headers, rows));
    } catch (error) {
      console.error(formatError(error));
      process.exit(1);
    }
  });

function formatStatus(status: PortStatus): string {
  switch (status) {
    case 'free':
      return chalk.green('free');
    case 'reserved':
      return chalk.yellow('reserved');
    case 'in-use':
      return chalk.red('in-use');
  }
}