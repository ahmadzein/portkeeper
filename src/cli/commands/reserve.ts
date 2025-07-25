import { Command } from 'commander';
import chalk from 'chalk';
import { PortService } from '../../core/services/PortService.js';
import { ReserveOptions } from '../../core/models/Port.js';
import { formatError } from '../utils/format.js';

export const reserveCommand = new Command('reserve')
  .description('Reserve a port for a project')
  .argument('<port>', 'Port number to reserve')
  .requiredOption('-n, --name <name>', 'Project name')
  .option('-d, --desc <description>', 'Port description')
  .option('-t, --tags <tags...>', 'Tags for categorization')
  .option('--auto-release', 'Auto-release when process stops')
  .action(async (portStr: string, options: any) => {
    try {
      const port = parseInt(portStr, 10);
      const service = new PortService();

      const reserveOptions: ReserveOptions = {
        projectName: options.name,
        description: options.desc,
        tags: options.tags,
        autoRelease: options.autoRelease,
      };

      const reserved = await service.reservePort(port, reserveOptions);
      
      console.log(chalk.green(`✓ Port ${port} reserved for "${reserved.projectName}"`));
      
      if (reserved.description) {
        console.log(chalk.gray(`  Description: ${reserved.description}`));
      }
      
      if (reserved.tags && reserved.tags.length > 0) {
        console.log(chalk.gray(`  Tags: ${reserved.tags.join(', ')}`));
      }
    } catch (error) {
      console.error(formatError(error));
      process.exit(1);
    }
  });