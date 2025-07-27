# CLI Command Reference

Complete reference for all Port Keeper CLI commands and options.

## 📋 Table of Contents

- [Global Options](#global-options)
- [check](#check) - Check port status
- [reserve](#reserve) - Reserve a port
- [list](#list) - List managed ports
- [release](#release) - Release ports
- [kill](#kill) - Kill processes
- [scan](#scan) - Scan active ports
- [request](#request) - Request multiple ports
- [export](#export) - Export configuration
- [import](#import) - Import configuration
- [gui](#gui) - Launch GUI
- [ai](#ai) - AI integration guide

## Global Options

Options available for all commands:

```bash
portman [command] [options]

Options:
  -V, --version  Output version number
  -h, --help     Display help for command
```

## check

Check if a port is available, reserved, or in use.

### Syntax
```bash
portman check <port> [options]
```

### Options
- `--json` - Output in JSON format

### Examples
```bash
# Check port 3000
portman check 3000

# JSON output for scripting
portman check 3000 --json
```

### Output
- **Free**: Port is available
- **Reserved**: Port is reserved for a project
- **In Use**: Port is actively being used

## reserve

Reserve a port for a specific project.

### Syntax
```bash
portman reserve <port> [options]
```

### Options
- `-n, --name <name>` - **Required**: Project name
- `-d, --desc <description>` - Description of port usage
- `-t, --tags <tags...>` - Tags for categorization
- `--json` - Output in JSON format

### Examples
```bash
# Basic reservation
portman reserve 3000 --name "my-app"

# With description
portman reserve 3000 -n "my-app" -d "React development server"

# With tags
portman reserve 3000 -n "my-app" -t frontend react development

# JSON output
portman reserve 3000 -n "my-app" --json
```

## list

List all managed ports with filtering options.

### Syntax
```bash
portman list [options]
```

### Options
- `-s, --status <status>` - Filter by status (reserved, in-use, all)
- `-p, --project <name>` - Filter by project name
- `-t, --tag <tag>` - Filter by tag
- `--json` - Output in JSON format
- `--format <format>` - Table format (ascii, unicode)

### Examples
```bash
# List all ports
portman list

# Only reserved ports
portman list --status reserved

# Ports for specific project
portman list --project "my-app"

# JSON output for parsing
portman list --json
```

## release

Release one or more reserved ports.

### Syntax
```bash
portman release <ports...> [options]
```

### Options
- `-f, --force` - Force release even if in use
- `--json` - Output in JSON format

### Examples
```bash
# Release single port
portman release 3000

# Release multiple ports
portman release 3000 3001 3002

# Force release
portman release 3000 --force
```

## kill

Kill processes using specified ports.

### Syntax
```bash
portman kill <ports...> [options]
```

### Options
- `-f, --force` - Force kill (SIGKILL)
- `--json` - Output in JSON format

### Examples
```bash
# Kill process on port 3000
portman kill 3000

# Kill multiple processes
portman kill 3000 8080

# Force kill
portman kill 3000 --force
```

## scan

Scan for all ports currently in use.

### Syntax
```bash
portman scan [options]
```

### Options
- `-r, --range <start-end>` - Port range (default: 1-65535)
- `--reserved` - Show only reserved ports
- `--json` - Output in JSON format

### Examples
```bash
# Scan all ports
portman scan

# Scan specific range
portman scan --range 3000-9000

# Show reserved port info
portman scan --reserved

# JSON output
portman scan --json
```

## request

Request and reserve multiple available ports.

### Syntax
```bash
portman request <count> [options]
```

### Options
- `-n, --name <name>` - **Required**: Project name
- `-r, --range <start-end>` - Port range to search
- `--sequential` - Find sequential ports
- `--random` - Find random ports
- `--json` - Output in JSON format

### Examples
```bash
# Request 3 ports
portman request 3 --name "microservices"

# Sequential ports
portman request 5 -n "api-cluster" --sequential

# In specific range
portman request 3 -n "test-suite" --range 8000-9000

# Random ports
portman request 4 -n "load-test" --random
```

## export

Export port configuration to JSON.

### Syntax
```bash
portman export [file] [options]
```

### Options
- `-p, --project <name>` - Export specific project only
- `--format <format>` - Output format (json, yaml)

### Examples
```bash
# Export to stdout
portman export

# Export to file
portman export ports.json

# Export specific project
portman export my-app.json --project "my-app"
```

## import

Import port configuration from JSON.

### Syntax
```bash
portman import [file] [options]
```

### Options
- `--merge` - Merge with existing (default)
- `--replace` - Replace existing configuration
- `--dry-run` - Preview changes without applying

### Examples
```bash
# Import from file
portman import ports.json

# Replace all existing
portman import ports.json --replace

# Preview changes
portman import ports.json --dry-run
```

## gui

Launch the Port Keeper GUI application.

### Syntax
```bash
portman gui [options]
```

### Options
- `--dev` - Run in development mode
- `--port <port>` - Dev server port (dev mode only)
- `--skip-rebuild` - Skip native module rebuild

### Examples
```bash
# Launch GUI
portman gui

# Development mode
portman gui --dev

# Skip module rebuild
portman gui --skip-rebuild
```

### Requirements
- Requires Electron (installed with `--include=optional`)
- First run may prompt to install Electron

## ai

Display AI agent integration guide.

### Syntax
```bash
portman ai [options]
```

### Options
- `--json` - Output complete JSON schema

### Examples
```bash
# Show human-readable guide
portman ai

# Get JSON schema for AI agents
portman ai --json
```

### Use Cases
- Integration with AI coding assistants
- Automation scripts
- CI/CD pipelines

## 🎯 Command Patterns

### Common Workflows

#### Development Setup
```bash
# Check and reserve ports for project
portman check 3000
portman reserve 3000 -n "frontend" -d "React app"
portman check 8080
portman reserve 8080 -n "backend" -d "API server"
```

#### Team Collaboration
```bash
# Export team configuration
portman export team-ports.json

# Share file with team
# Team members import
portman import team-ports.json
```

#### Cleanup
```bash
# Find and kill orphaned processes
portman scan --reserved
portman kill 3000 3001 --force
portman release 3000 3001
```

### Shell Aliases

Add to your shell configuration:

```bash
# ~/.bashrc or ~/.zshrc
alias pm="portman"
alias pmc="portman check"
alias pmr="portman reserve"
alias pml="portman list"
alias pmk="portman kill"
```

### Scripting Examples

#### Bash Script
```bash
#!/bin/bash
PORT=$(portman request 1 -n "test" --json | jq -r '.ports[0].number')
echo "Got port: $PORT"
# Use port...
portman release $PORT
```

#### Node.js
```javascript
const { exec } = require('child_process');

exec('portman check 3000 --json', (err, stdout) => {
  const result = JSON.parse(stdout);
  if (result.status === 'free') {
    console.log('Port is available!');
  }
});
```

## 📝 Exit Codes

- `0` - Success
- `1` - General error
- `2` - Port not found or invalid
- `3` - Permission denied
- `4` - Port already reserved/in use

## 🔍 Debugging

Enable debug output:
```bash
DEBUG=portkeeper:* portman list
```

## 💡 Tips

1. **Always use `--json` for scripting** - Ensures parseable output
2. **Reserve before use** - Prevents conflicts
3. **Tag liberally** - Makes filtering easier
4. **Export regularly** - Backup configuration
5. **Use request for multiple** - Automatically finds available ports

---

Need more help? Run `portman [command] --help` or visit our [Troubleshooting Guide](Troubleshooting).