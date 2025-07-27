# Port Manager AI Agent Guide

This guide is specifically designed for AI agents and automation tools to interact with Port Manager CLI. All commands support JSON output for easy parsing.

## Quick Start

Port Manager now includes a built-in AI instruction command:

```bash
# Get comprehensive human-readable instructions
portman ai

# Get machine-readable JSON schema with complete command details
portman ai --json
```

The `ai` command provides:
- Complete command syntax and options
- JSON response structures for all commands
- Integration examples for Bash, Python, and Node.js
- Best practices and automation patterns
- Exit codes and error handling information

## Table of Contents
- [Installation](#installation)
- [Global Options](#global-options)
- [Commands Reference](#commands-reference)
  - [ai](#ai---ai-agent-instructions)
  - [check](#check---check-port-status)
  - [reserve](#reserve---reserve-a-port)
  - [release](#release---release-ports)
  - [list](#list---list-all-ports)
  - [scan](#scan---scan-active-ports)
  - [kill](#kill---kill-process-on-port)
  - [request](#request---request-multiple-ports)
  - [export](#export---export-configuration)
  - [import](#import---import-configuration)
  - [gui](#gui---launch-gui)
- [JSON Output Structure](#json-output-structure)
- [Exit Codes](#exit-codes)
- [Error Handling](#error-handling)
- [Automation Examples](#automation-examples)

## Installation

```bash
# Install globally from npm
npm install -g portmanager

# Or clone and install locally
git clone https://github.com/ahmadzein/portmanager.git
cd portmanager
npm install
npm link
```

## Global Options

All commands support these global options:

- `--json` - Output in JSON format for machine parsing
- `-h, --help` - Display help for command
- `-V, --version` - Output version number

## Commands Reference

### ai - AI Agent Instructions

Display comprehensive instructions for AI agents and automation tools.

**Syntax:**
```bash
portman ai [options]
```

**Options:**
- `--json` - Output complete command schema in JSON format

**Examples:**
```bash
# Get human-readable instructions
portman ai

# Get JSON schema
portman ai --json
# Output: {
#   "name": "Port Manager",
#   "version": "1.0.0",
#   "commands": {
#     "check": { "syntax": "...", "description": "...", ... },
#     "reserve": { ... },
#     ...
#   },
#   "automation": { ... },
#   "bestPractices": [ ... ]
# }
```

**Use Cases:**
- Learning Port Manager commands and options
- Generating automation scripts
- Building integrations
- Creating documentation

### check - Check Port Status

Check if a port is free, reserved, or in use.

**Syntax:**
```bash
portman check <port> [options]
```

**Options:**
- `--json` - Output as JSON

**Examples:**
```bash
# Standard output
portman check 3000
# Output: ✓ Port 3000 is free

# JSON output
portman check 3000 --json
# Output: {"port":3000,"status":"free"}

# Reserved port
portman check 3000 --json
# Output: {"port":3000,"status":"reserved","projectName":"my-api","description":"API server"}

# In-use port
portman check 3000 --json
# Output: {"port":3000,"status":"in-use","pid":12345,"processName":"node"}
```

**JSON Response Structure:**
```typescript
{
  port: number;
  status: "free" | "reserved" | "in-use";
  projectName?: string;    // Only if reserved
  description?: string;    // Only if reserved
  pid?: number;           // Only if in-use
  processName?: string;   // Only if in-use
}
```

### reserve - Reserve a Port

Reserve a port for a specific project.

**Syntax:**
```bash
portman reserve <port> [options]
```

**Options:**
- `-n, --name <name>` - Project name (required)
- `-d, --description <desc>` - Port description
- `-t, --tags <tags>` - Comma-separated tags
- `-a, --auto-release` - Auto-release when process exits
- `--json` - Output as JSON

**Examples:**
```bash
# Basic reservation
portman reserve 3000 -n "my-api" --json
# Output: {"number":3000,"projectName":"my-api","status":"reserved","reservedAt":"2025-07-26T10:00:00.000Z"}

# With description and tags
portman reserve 3000 -n "my-api" -d "Main API server" -t "backend,production" --json
# Output: {
#   "number": 3000,
#   "projectName": "my-api",
#   "description": "Main API server",
#   "status": "reserved",
#   "reservedAt": "2025-07-26T10:00:00.000Z",
#   "tags": ["backend", "production"]
# }

# With auto-release
portman reserve 3000 -n "temp-server" -a --json
```

**JSON Response Structure:**
```typescript
{
  number: number;
  projectName: string;
  description?: string;
  status: "reserved";
  reservedAt: string;  // ISO 8601 date
  tags?: string[];
  autoRelease?: boolean;
}
```

### release - Release Ports

Release one or more reserved ports.

**Syntax:**
```bash
portman release <ports...> [options]
```

**Options:**
- `--json` - Output as JSON

**Examples:**
```bash
# Release single port
portman release 3000 --json
# Output: {"results":[{"port":3000,"status":"success"}]}

# Release multiple ports
portman release 3000 3001 3002 --json
# Output: {
#   "results": [
#     {"port": 3000, "status": "success"},
#     {"port": 3001, "status": "success"},
#     {"port": 3002, "status": "error", "error": "Port not reserved"}
#   ]
# }
```

**JSON Response Structure:**
```typescript
{
  results: Array<{
    port: number;
    status: "success" | "error";
    error?: string;  // Only if status is "error"
  }>;
}
```

### list - List All Ports

List all reserved and in-use ports.

**Syntax:**
```bash
portman list [options]
```

**Options:**
- `-s, --status <status>` - Filter by status (reserved/in-use)
- `-p, --project <name>` - Filter by project name (partial match)
- `-t, --tags <tags>` - Filter by tags
- `--json` - Output as JSON

**Examples:**
```bash
# List all ports
portman list --json
# Output: [
#   {
#     "number": 3000,
#     "projectName": "my-api",
#     "status": "reserved",
#     "reservedAt": "2025-07-26T10:00:00.000Z"
#   }
# ]

# Filter by status
portman list -s reserved --json

# Filter by project
portman list -p "api" --json

# Filter by tags
portman list -t "backend" --json
```

**JSON Response Structure:**
```typescript
Array<{
  number: number;
  projectName: string;
  description?: string;
  status: "reserved" | "in-use";
  pid?: number;
  reservedAt: string;
  lastUsed?: string;
  autoRelease: boolean;
  tags: string[];
}>
```

### scan - Scan Active Ports

Scan for all currently active ports on the system.

**Syntax:**
```bash
portman scan [options]
```

**Options:**
- `--json` - Output as JSON

**Examples:**
```bash
# Scan all active ports
portman scan --json
# Output: [
#   {
#     "number": 3000,
#     "pid": 12345,
#     "processName": "node",
#     "state": "LISTEN",
#     "address": "127.0.0.1",
#     "projectName": "my-api",      // If managed by Port Manager
#     "description": "API server"    // If managed by Port Manager
#   }
# ]
```

**JSON Response Structure:**
```typescript
Array<{
  number: number;
  pid: number;
  processName?: string;
  state?: string;
  address?: string;
  projectName?: string;    // If port is managed
  description?: string;    // If port is managed
  tags?: string[];        // If port is managed
  reservedAt?: string;    // If port is managed
}>
```

### kill - Kill Process on Port

Kill the process using a specific port.

**Syntax:**
```bash
portman kill <ports...> [options]
```

**Options:**
- `-f, --force` - Force kill without confirmation
- `--json` - Output as JSON

**Examples:**
```bash
# Kill single port
portman kill 3000 --json
# Output: {"results":[{"port":3000,"status":"success","pid":12345}]}

# Kill multiple ports
portman kill 3000 3001 --json
# Output: {
#   "results": [
#     {"port": 3000, "status": "success", "pid": 12345},
#     {"port": 3001, "status": "error", "error": "No process found"}
#   ]
# }

# Force kill
portman kill 3000 -f --json
```

**JSON Response Structure:**
```typescript
{
  results: Array<{
    port: number;
    status: "success" | "error";
    pid?: number;        // Only if success
    error?: string;      // Only if error
  }>;
}
```

### request - Request Multiple Ports

Request and reserve multiple available ports.

**Syntax:**
```bash
portman request <count> [options]
```

**Options:**
- `-n, --name <name>` - Project name (required)
- `-d, --description <desc>` - Description for the ports
- `-t, --tags <tags>` - Comma-separated tags
- `-s, --sequential` - Find sequential ports (default: true)
- `-r, --random` - Find random ports
- `--start <port>` - Start port for search (default: 3000)
- `--end <port>` - End port for search (default: 9999)
- `--avoid <ports>` - Comma-separated ports to avoid
- `--json` - Output as JSON

**Examples:**
```bash
# Request 3 sequential ports
portman request 3 -n "microservices" --json
# Output: {
#   "ports": [
#     {"number": 3000, "projectName": "microservices-1"},
#     {"number": 3001, "projectName": "microservices-2"},
#     {"number": 3002, "projectName": "microservices-3"}
#   ],
#   "summary": "Successfully reserved 3 port(s) for \"microservices\": 3000, 3001, 3002"
# }

# Request random ports
portman request 5 -n "test-suite" -r --json

# Request with custom range
portman request 2 -n "api" --start 8000 --end 8999 --json

# Avoid specific ports
portman request 3 -n "app" --avoid "3000,3001,8080" --json
```

**JSON Response Structure:**
```typescript
{
  ports: Array<{
    number: number;
    projectName: string;
    description?: string;
    status: "reserved";
    reservedAt: string;
    tags?: string[];
  }>;
  summary: string;
}
```

### export - Export Configuration

Export port configuration to JSON.

**Syntax:**
```bash
portman export [options]
```

**Options:**
- `-o, --output <file>` - Output to file instead of stdout
- `-p, --pretty` - Pretty print JSON

**Examples:**
```bash
# Export to stdout
portman export
# Output: {"version":"1.0.0","exportDate":"2025-07-26T10:00:00.000Z","ports":[...]}

# Export to file
portman export -o backup.json

# Pretty print
portman export -p
```

**JSON Response Structure:**
```typescript
{
  version: string;
  exportDate: string;
  ports: Array<{
    number: number;
    projectName: string;
    description?: string;
    tags?: string[];
    reservedAt: string;
    autoRelease?: boolean;
  }>;
}
```

### import - Import Configuration

Import port configuration from JSON.

**Syntax:**
```bash
portman import [file] [options]
```

**Options:**
- `-f, --force` - Force import, skip conflicts
- `--json` - Output as JSON

**Examples:**
```bash
# Import from file
portman import backup.json --json
# Output: {
#   "imported": 5,
#   "skipped": 2,
#   "errors": 1,
#   "details": {
#     "imported": [3000, 3001, 3002, 3003, 3004],
#     "skipped": [8080, 8081],
#     "errors": [{"port": 9000, "error": "Port in use"}]
#   }
# }

# Force import
portman import backup.json -f --json

# Import from stdin
cat backup.json | portman import --json
```

**JSON Response Structure:**
```typescript
{
  imported: number;
  skipped: number;
  errors: number;
  details: {
    imported: number[];
    skipped: number[];
    errors: Array<{
      port: number;
      error: string;
    }>;
  };
}
```

### gui - Launch GUI

Launch the Port Manager GUI application.

**Syntax:**
```bash
portman gui
```

**Note:** This command launches the Electron-based GUI and does not support JSON output.

## JSON Output Structure

All JSON outputs follow consistent patterns:

1. **Success responses** include the requested data
2. **Error responses** include error messages and status codes
3. **Batch operations** return arrays with individual results
4. **Timestamps** use ISO 8601 format
5. **Arrays** are used for multiple items
6. **null** is used for missing optional fields

## Exit Codes

- `0` - Success
- `1` - General error
- `2` - Port not found
- `3` - Port already in use
- `4` - Port already reserved
- `5` - Permission denied
- `127` - Command not found

## Error Handling

When using `--json`, errors are returned as JSON:

```json
{
  "error": "Port 3000 is already in use",
  "code": "PORT_IN_USE",
  "port": 3000
}
```

Without `--json`, errors are printed to stderr and the process exits with appropriate code.

## Automation Examples

### Bash Script
```bash
#!/bin/bash

# Check if port is available
if [ $(portman check 3000 --json | jq -r '.status') = "free" ]; then
  portman reserve 3000 -n "my-app" --json
fi

# Get all ports for a project
PROJECT_PORTS=$(portman list -p "my-app" --json | jq -r '.[].number')

# Kill all processes on reserved ports
for port in $PROJECT_PORTS; do
  portman kill $port -f --json
done
```

### Python Integration
```python
import subprocess
import json

def check_port(port):
    result = subprocess.run(
        ['portman', 'check', str(port), '--json'],
        capture_output=True,
        text=True
    )
    return json.loads(result.stdout)

def reserve_ports(count, name):
    result = subprocess.run(
        ['portman', 'request', str(count), '-n', name, '--json'],
        capture_output=True,
        text=True
    )
    return json.loads(result.stdout)

# Usage
status = check_port(3000)
if status['status'] == 'free':
    ports = reserve_ports(3, 'my-service')
    print(f"Reserved ports: {[p['number'] for p in ports['ports']]}")
```

### Node.js Integration
```javascript
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function getPorts(project) {
  const { stdout } = await execPromise(`portman list -p "${project}" --json`);
  return JSON.parse(stdout);
}

async function releaseAllPorts(project) {
  const ports = await getPorts(project);
  const portNumbers = ports.map(p => p.number).join(' ');
  
  if (portNumbers) {
    const { stdout } = await execPromise(`portman release ${portNumbers} --json`);
    return JSON.parse(stdout);
  }
}
```

### Docker Integration
```dockerfile
# In Dockerfile
RUN npm install -g portmanager

# In entrypoint script
#!/bin/sh
PORT=$(portman request 1 -n "container-$HOSTNAME" --json | jq -r '.ports[0].number')
export APP_PORT=$PORT
exec node server.js
```

### CI/CD Pipeline
```yaml
# GitHub Actions example
- name: Reserve test ports
  run: |
    PORTS=$(portman request 5 -n "ci-test-${{ github.run_id }}" --json)
    echo "PORTS=$PORTS" >> $GITHUB_ENV
    
- name: Run tests
  run: npm test
  
- name: Release test ports
  if: always()
  run: |
    NUMBERS=$(echo $PORTS | jq -r '.ports[].number' | tr '\n' ' ')
    portman release $NUMBERS --json
```

## Best Practices for AI Agents

1. **Always use `--json`** for machine parsing
2. **Check exit codes** for error handling
3. **Parse JSON responses** properly before use
4. **Handle errors gracefully** - ports might be in use
5. **Clean up resources** - always release ports when done
6. **Use descriptive names** for port reservations
7. **Implement retries** for transient failures
8. **Log operations** for debugging
9. **Use appropriate timeouts** for long operations
10. **Validate inputs** before passing to commands

## Common Patterns

### Port Allocation Pattern
```bash
# 1. Check availability
STATUS=$(portman check $PORT --json | jq -r '.status')

# 2. Reserve if free
if [ "$STATUS" = "free" ]; then
  portman reserve $PORT -n "$PROJECT" --json
elif [ "$STATUS" = "reserved" ]; then
  # Check if it's our reservation
  OWNER=$(portman check $PORT --json | jq -r '.projectName')
  if [ "$OWNER" != "$PROJECT" ]; then
    echo "Port already reserved by $OWNER"
    exit 1
  fi
fi

# 3. Use the port
# ... your application logic ...

# 4. Clean up
portman release $PORT --json
```

### Batch Operations Pattern
```bash
# Request multiple ports
RESULT=$(portman request 10 -n "load-test" --json)
PORTS=$(echo $RESULT | jq -r '.ports[].number')

# Use ports in parallel
for PORT in $PORTS; do
  start_service $PORT &
done

# Wait for completion
wait

# Release all ports
portman release $PORTS --json
```

### Monitoring Pattern
```bash
# Monitor port usage
while true; do
  ACTIVE=$(portman scan --json | jq length)
  RESERVED=$(portman list -s reserved --json | jq length)
  echo "Active: $ACTIVE, Reserved: $RESERVED"
  sleep 60
done
```

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Some operations require sudo on ports < 1024
   - Solution: Use ports >= 1024 or run with appropriate permissions

2. **Module Version Mismatch**
   - Error about NODE_MODULE_VERSION
   - Solution: Run `npm run fix:node` for CLI

3. **Port Already in Use**
   - Port is occupied by another process
   - Solution: Use `portman kill` or choose different port

4. **JSON Parse Errors**
   - Malformed JSON in import
   - Solution: Validate JSON before import

5. **Network Interfaces**
   - Scan might miss ports on specific interfaces
   - Solution: Check all network interfaces

## Version Compatibility

- Port Manager CLI: 1.0.0+
- Node.js: 14.0.0+
- Operating Systems: macOS, Linux, Windows
- JSON Output: Available in all versions

## Additional Resources

- [CLI Command Reference](./CLI_REFERENCE.md)
- [API Documentation](./API_DOCS.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [GitHub Repository](https://github.com/ahmadzein/portmanager)