import { Command } from 'commander';
import chalk from 'chalk';
import { PortService } from '../../core/services/PortService.js';
import { formatError } from '../utils/format.js';

export const requestCommand = new Command('request')
  .description('Request and reserve multiple available ports')
  .argument('<count>', 'Number of ports to request')
  .requiredOption('-n, --name <name>', 'Project name')
  .option('-d, --desc <description>', 'Description')
  .option('-t, --tags <tags>', 'Comma-separated tags')
  .option('-s, --sequential', 'Find sequential ports (default)', true)
  .option('-r, --random', 'Find random ports')
  .option('--start <port>', 'Start port range', '3000')
  .option('--end <port>', 'End port range', '9999')
  .option('--avoid <ports>', 'Additional ports to avoid (comma-separated)')
  .option('--json', 'Output as JSON')
  .action(async (countStr: string, options) => {
    try {
      const count = parseInt(countStr, 10);
      if (isNaN(count) || count < 1) {
        console.error(chalk.red('Count must be a positive number'));
        process.exit(1);
      }

      const service = new PortService();
      
      // Parse options
      const requestOptions = {
        count,
        projectName: options.name,
        description: options.desc,
        tags: options.tags ? options.tags.split(',').map((t: string) => t.trim()) : undefined,
        sequential: !options.random,
        startPort: parseInt(options.start, 10),
        endPort: parseInt(options.end, 10),
        avoid: options.avoid ? 
          options.avoid.split(',').map((p: string) => parseInt(p.trim(), 10)) : 
          undefined,
      };

      if (!options.json) {
        console.log(chalk.blue(`🔍 Searching for ${count} available port(s)...`));
      }
      
      const result = await service.requestPorts(requestOptions);
      
      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
        return;
      }
      
      console.log(chalk.green(`\n✓ ${result.summary}\n`));
      
      // Display detailed information
      console.log(chalk.bold('Reserved Ports:'));
      for (const port of result.ports) {
        console.log(chalk.cyan(`  • Port ${port.number}: ${port.projectName}`));
        if (port.description) {
          console.log(chalk.gray(`    ${port.description}`));
        }
        if (port.tags && port.tags.length > 0) {
          console.log(chalk.gray(`    Tags: ${port.tags.join(', ')}`));
        }
      }
      
      // Show quick usage example
      if (result.ports.length > 0) {
        console.log(chalk.gray(`\nExample usage:`));
        const firstPort = result.ports[0];
        if (firstPort) {
          console.log(chalk.gray(`  # Check status`));
          console.log(chalk.gray(`  portman check ${firstPort.number}`));
          console.log(chalk.gray(`  # Release when done`));
          console.log(chalk.gray(`  portman release ${result.ports.map(p => p.number).join(' ')}`));
        }
      }
    } catch (error) {
      console.error(formatError(error));
      process.exit(1);
    }
  });