import { Command } from 'commander';
import chalk from 'chalk';

export const guiCommand = new Command('gui')
  .description('Information about the Port Keeper GUI application')
  .action(() => {
    console.log(chalk.blue('\n🖥️  Port Keeper GUI\n'));
    
    console.log(chalk.yellow('The Port Keeper GUI is a standalone desktop application.'));
    console.log(chalk.yellow('It is not included in the npm package to keep the CLI lightweight.\n'));
    
    console.log(chalk.green('Download the GUI from:'));
    console.log(chalk.white('  🌐 https://portkeeper.net/download'));
    console.log(chalk.white('  📦 https://github.com/ahmadzein/portkeeper/releases\n'));
    
    console.log(chalk.cyan('Available for:'));
    console.log('  • macOS (Intel & Apple Silicon)');
    console.log('  • Windows (64-bit)');
    console.log('  • Linux (AppImage, deb, rpm)\n');
    
    console.log(chalk.gray('The GUI provides:'));
    console.log('  • Visual port dashboard');
    console.log('  • Real-time port scanning');
    console.log('  • Drag-and-drop import/export');
    console.log('  • Dark/Light themes');
    console.log('  • All CLI features in a visual interface\n');
    
    console.log(chalk.magenta('For developers who want to run from source:'));
    console.log(chalk.gray('  git clone https://github.com/ahmadzein/portkeeper.git'));
    console.log(chalk.gray('  cd portkeeper'));
    console.log(chalk.gray('  npm install'));
    console.log(chalk.gray('  npm run dev:gui\n'));
  });