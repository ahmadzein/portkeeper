import { Command } from 'commander';
import chalk from 'chalk';
import { PortService } from '../../core/services/PortService.js';
import { formatError } from '../utils/format.js';

export const importCommand = new Command('import')
  .description('Import port configuration from JSON')
  .argument('[file]', 'Import file (default: stdin)')
  .option('--merge', 'Merge with existing ports instead of replacing')
  .option('--dry-run', 'Show what would be imported without making changes')
  .action(async (file: string | undefined, options: any) => {
    try {
      const service = new PortService();
      let jsonData: string;

      if (file) {
        const fs = await import('fs/promises');
        jsonData = await fs.readFile(file, 'utf-8');
      } else {
        // Read from stdin
        jsonData = await new Promise<string>((resolve) => {
          let data = '';
          process.stdin.on('data', chunk => data += chunk);
          process.stdin.on('end', () => resolve(data));
        });
      }

      const importData = JSON.parse(jsonData);

      // Validate import data
      if (!importData.version || !importData.ports || !Array.isArray(importData.ports)) {
        throw new Error('Invalid import file format');
      }

      console.log(chalk.gray(`Importing from export version ${importData.version}`));
      console.log(chalk.gray(`Export date: ${new Date(importData.exportDate).toLocaleString()}`));
      console.log(chalk.gray(`Ports to import: ${importData.ports.length}`));

      if (options.dryRun) {
        console.log(chalk.yellow('\nDry run mode - no changes will be made'));
        importData.ports.forEach((port: any) => {
          console.log(`  - Port ${port.number}: ${port.projectName}`);
        });
        return;
      }

      // Get existing ports if merging
      const existingPorts = options.merge ? await service.listPorts() : [];
      const existingPortNumbers = new Set(existingPorts.map(p => p.number));

      let imported = 0;
      let skipped = 0;
      let errors = 0;

      for (const portData of importData.ports) {
        try {
          // Skip if port exists and we're merging
          if (options.merge && existingPortNumbers.has(portData.number)) {
            console.log(chalk.yellow(`⚠ Skipping port ${portData.number} (already exists)`));
            skipped++;
            continue;
          }

          // Check if port is currently in use
          const status = await service.checkPort(portData.number);
          if (status === 'in-use') {
            console.log(chalk.red(`✗ Cannot import port ${portData.number} (currently in use)`));
            errors++;
            continue;
          }

          // Reserve the port
          await service.reservePort(portData.number, {
            projectName: portData.projectName,
            description: portData.description,
            tags: portData.tags,
          });

          console.log(chalk.green(`✓ Imported port ${portData.number} for ${portData.projectName}`));
          imported++;
        } catch (error) {
          console.log(chalk.red(`✗ Failed to import port ${portData.number}: ${(error as Error).message}`));
          errors++;
        }
      }

      console.log(chalk.gray(`\nImport complete: ${imported} imported, ${skipped} skipped, ${errors} errors`));
    } catch (error) {
      console.error(formatError(error));
      process.exit(1);
    }
  });