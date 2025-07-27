import { Command } from 'commander';
import { PortService } from '../../core/services/PortService.js';
import { formatError } from '../utils/format.js';

export const exportCommand = new Command('export')
  .description('Export port configuration to JSON')
  .option('-o, --output <file>', 'Output file (default: stdout)')
  .option('--pretty', 'Pretty print JSON output')
  .action(async (options: any) => {
    try {
      const service = new PortService();
      const ports = await service.listPorts();
      
      // Create export data
      const exportData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        ports: ports.map(port => ({
          number: port.number,
          projectName: port.projectName,
          description: port.description,
          tags: port.tags,
          reservedAt: port.reservedAt,
        })),
      };

      const jsonOutput = options.pretty 
        ? JSON.stringify(exportData, null, 2)
        : JSON.stringify(exportData);

      if (options.output) {
        const fs = await import('fs/promises');
        await fs.writeFile(options.output, jsonOutput, 'utf-8');
        console.log(`✓ Exported ${ports.length} ports to ${options.output}`);
      } else {
        console.log(jsonOutput);
      }
    } catch (error) {
      console.error(formatError(error));
      process.exit(1);
    }
  });