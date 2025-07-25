import { Command } from 'commander';
import chalk from 'chalk';
import { PortService } from '../../core/services/PortService.js';
import { formatError } from '../utils/format.js';

export const checkCommand = new Command('check')
  .description('Check if a port is reserved or in use')
  .argument('<port>', 'Port number to check')
  .action(async (portStr: string) => {
    try {
      const port = parseInt(portStr, 10);
      const service = new PortService();
      const status = await service.checkPort(port);

      switch (status) {
        case 'free':
          console.log(chalk.green(`✓ Port ${port} is free`));
          break;
        case 'reserved':
          const ports = await service.listPorts({ status: 'reserved' });
          const reservedPort = ports.find(p => p.number === port);
          if (reservedPort) {
            console.log(chalk.yellow(`⚠ Port ${port} is reserved for "${reservedPort.projectName}"`));
            if (reservedPort.description) {
              console.log(chalk.gray(`  Description: ${reservedPort.description}`));
            }
          }
          break;
        case 'in-use':
          console.log(chalk.red(`✗ Port ${port} is in use`));
          try {
            const activePorts = await service.scanActivePorts();
            const activePort = activePorts.find(p => p.number === port);
            if (activePort) {
              console.log(chalk.gray(`  PID: ${activePort.pid}`));
              if (activePort.processName) {
                console.log(chalk.gray(`  Process: ${activePort.processName}`));
              }
            }
          } catch {
            // Ignore scan errors
          }
          break;
      }
    } catch (error) {
      console.error(formatError(error));
      process.exit(1);
    }
  });