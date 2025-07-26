import { Command } from 'commander';
import chalk from 'chalk';

export const aiCommand = new Command('ai')
  .description('Display AI agent instructions and integration guide')
  .option('--json', 'Output in JSON format')
  .action((options) => {
    if (options.json) {
      const jsonOutput = {
        name: 'Port Keeper',
        version: '1.0.0',
        description: 'A comprehensive tool for managing local development ports',
        packageName: 'portkeeper',
        cliCommand: 'portman',
        capabilities: [
          'Check port status (free/reserved/in-use)',
          'Reserve ports for projects',
          'Release reserved ports',
          'List all managed ports',
          'Scan active system ports',
          'Kill processes on ports',
          'Request multiple available ports',
          'Export/Import configurations',
          'Launch GUI interface'
        ],
        commands: {
          check: {
            syntax: 'portman check <port> [--json]',
            description: 'Check if a port is free, reserved, or in use',
            examples: ['portman check 3000', 'portman check 3000 --json'],
            jsonResponse: {
              port: 'number',
              status: 'free | reserved | in-use',
              projectName: 'string (if reserved)',
              pid: 'number (if in-use)',
              processName: 'string (if in-use)'
            }
          },
          reserve: {
            syntax: 'portman reserve <port> -n <name> [options]',
            description: 'Reserve a port for a project',
            options: {
              '--name, -n': 'Project name (required)',
              '--description, -d': 'Port description',
              '--tags, -t': 'Comma-separated tags',
              '--auto-release, -a': 'Auto-release when process exits',
              '--json': 'Output as JSON'
            },
            examples: [
              'portman reserve 3000 -n "my-api"',
              'portman reserve 3000 -n "my-api" -d "API server" -t "backend,prod"'
            ]
          },
          release: {
            syntax: 'portman release <ports...> [--json]',
            description: 'Release one or more reserved ports',
            examples: ['portman release 3000', 'portman release 3000 3001 3002']
          },
          list: {
            syntax: 'portman list [options]',
            description: 'List all reserved and in-use ports',
            options: {
              '--status, -s': 'Filter by status (reserved/in-use)',
              '--project, -p': 'Filter by project name',
              '--tags, -t': 'Filter by tags',
              '--json': 'Output as JSON array'
            }
          },
          scan: {
            syntax: 'portman scan [--json]',
            description: 'Scan for all active ports on the system',
            notes: 'Shows process information and reservation details'
          },
          kill: {
            syntax: 'portman kill <ports...> [options]',
            description: 'Kill process using specified port(s)',
            options: {
              '--force, -f': 'Skip confirmation prompt',
              '--json': 'Output as JSON'
            }
          },
          request: {
            syntax: 'portman request <count> -n <name> [options]',
            description: 'Request and reserve multiple available ports',
            options: {
              '--name, -n': 'Project name (required)',
              '--description, -d': 'Description for ports',
              '--tags, -t': 'Comma-separated tags',
              '--sequential, -s': 'Find sequential ports (default)',
              '--random, -r': 'Find random ports',
              '--start': 'Start port for search (default: 3000)',
              '--end': 'End port for search (default: 9999)',
              '--avoid': 'Comma-separated ports to avoid',
              '--json': 'Output as JSON'
            }
          },
          export: {
            syntax: 'portman export [options]',
            description: 'Export port configuration to JSON',
            options: {
              '--output, -o': 'Output to file instead of stdout',
              '--pretty, -p': 'Pretty print JSON'
            }
          },
          import: {
            syntax: 'portman import [file] [options]',
            description: 'Import port configuration from JSON',
            options: {
              '--force, -f': 'Skip conflicts',
              '--json': 'Output results as JSON'
            }
          },
          gui: {
            syntax: 'portman gui',
            description: 'Launch the Port Manager desktop application'
          }
        },
        workflow: {
          description: 'IMPORTANT: Always follow this workflow when using ports',
          steps: [
            '1. Check port availability with "portman check <port>"',
            '2. Reserve the port with "portman reserve <port> -n <project>"',
            '3. Use the reserved port in your application',
            '4. Release the port with "portman release <port>" when done'
          ],
          critical: 'NEVER use a port without reserving it first!'
        },
        automation: {
          jsonSupport: 'All commands support --json flag for machine-readable output',
          exitCodes: {
            0: 'Success',
            1: 'General error',
            2: 'Port not found',
            3: 'Port already in use',
            4: 'Port already reserved',
            5: 'Permission denied'
          },
          integration: {
            bash: 'Use with jq for JSON parsing',
            python: 'subprocess.run() with json.loads()',
            nodejs: 'child_process.exec() with JSON.parse()',
            docker: 'Dynamic port allocation in containers',
            cicd: 'GitHub Actions, Jenkins, GitLab CI'
          }
        },
        bestPractices: [
          'ALWAYS reserve ports before using them in your application',
          'Check port status before attempting to reserve',
          'Always use --json flag for automation',
          'Check exit codes for error handling',
          'Use descriptive project names',
          'Tag ports for better organization',
          'Release ports when done',
          'Use request command for multiple ports',
          'Export configurations for team sharing',
          'Never use a port without reserving it first'
        ]
      };

      console.log(JSON.stringify(jsonOutput, null, 2));
      return;
    }

    // Human-readable output
    console.log(chalk.blue.bold('\n🤖 Port Manager - AI Agent Integration Guide\n'));
    
    console.log(chalk.yellow('PURPOSE:'));
    console.log('Port Manager helps manage local development ports to prevent conflicts');
    console.log('and enable team collaboration through port reservation and tracking.\n');

    console.log(chalk.yellow('KEY CAPABILITIES:'));
    console.log('• Check port availability and status');
    console.log('• Reserve ports for specific projects');
    console.log('• Detect and display active ports with process info');
    console.log('• Kill processes occupying ports');
    console.log('• Request multiple available ports automatically');
    console.log('• Export/import port configurations');
    console.log('• JSON output for all commands (add --json flag)\n');

    console.log(chalk.yellow('COMMAND OVERVIEW:'));
    console.log(chalk.cyan('Check port status:'));
    console.log('  portman check <port> [--json]');
    console.log('  Example: portman check 3000 --json\n');

    console.log(chalk.cyan('Reserve a port:'));
    console.log('  portman reserve <port> -n <project> [-d <desc>] [-t <tags>] [--json]');
    console.log('  Example: portman reserve 3000 -n "my-api" -d "API server"\n');

    console.log(chalk.cyan('Release ports:'));
    console.log('  portman release <port1> [port2...] [--json]');
    console.log('  Example: portman release 3000 3001\n');

    console.log(chalk.cyan('List managed ports:'));
    console.log('  portman list [-s <status>] [-p <project>] [--json]');
    console.log('  Example: portman list -s reserved --json\n');

    console.log(chalk.cyan('Scan active ports:'));
    console.log('  portman scan [--json]');
    console.log('  Shows all listening ports with process details\n');

    console.log(chalk.cyan('Request multiple ports:'));
    console.log('  portman request <count> -n <project> [--sequential|--random] [--json]');
    console.log('  Example: portman request 3 -n "microservices" --json\n');

    console.log(chalk.yellow('PROPER WORKFLOW:'));
    console.log('1. Check if port is available');
    console.log('2. Reserve the port for your project');
    console.log('3. Start your application on the reserved port');
    console.log('4. Release the port when done\n');

    console.log(chalk.yellow('AUTOMATION EXAMPLES:'));
    console.log(chalk.cyan('Correct workflow in Bash:'));
    console.log(`  # 1. Check port status
  STATUS=$(portman check 3000 --json | jq -r '.status')
  
  # 2. Reserve if free
  if [ "$STATUS" = "free" ]; then
    portman reserve 3000 -n "my-app" --json
    
    # 3. Start your app
    npm start -- --port 3000
    
    # 4. Release when done (in cleanup/trap)
    portman release 3000
  else
    echo "Port 3000 is not available"
    exit 1
  fi\n`);

    console.log(chalk.cyan('Python integration:'));
    console.log(`  import subprocess, json
  result = subprocess.run(['portman', 'check', '3000', '--json'], 
                         capture_output=True, text=True)
  data = json.loads(result.stdout)
  print(f"Port 3000 is {data['status']}")\n`);

    console.log(chalk.cyan('Node.js integration:'));
    console.log(`  const { exec } = require('child_process');
  exec('portman check 3000 --json', (err, stdout) => {
    const data = JSON.parse(stdout);
    console.log(\`Port 3000 is \${data.status}\`);
  });\n`);

    console.log(chalk.yellow('JSON RESPONSE STRUCTURES:'));
    console.log(chalk.cyan('Check response:'));
    console.log('  {"port": 3000, "status": "free|reserved|in-use", ...}\n');

    console.log(chalk.cyan('List response:'));
    console.log('  [{"number": 3000, "projectName": "my-api", "status": "reserved", ...}]\n');

    console.log(chalk.cyan('Request response:'));
    console.log('  {"ports": [{"number": 3000, ...}], "summary": "..."}\n');

    console.log(chalk.yellow('BEST PRACTICES:'));
    console.log('• Always use --json flag for parsing');
    console.log('• ALWAYS reserve ports before using them');
    console.log('• Check port status before reserving');
    console.log('• Check exit codes (0=success, non-zero=error)');
    console.log('• Use descriptive project names');
    console.log('• Release ports when done');
    console.log('• Handle errors gracefully\n');

    console.log(chalk.red('IMPORTANT:'));
    console.log('Always reserve a port before using it in your application!');
    console.log('This prevents conflicts and enables team collaboration.\n');

    console.log(chalk.green('For full documentation: https://portkeeper.net'));
    console.log(chalk.green('For detailed AI guide: Use "portman ai --json" for complete schema\n'));
  });