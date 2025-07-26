# CLI Command Reference

## Overview
Port Manager CLI provides a comprehensive set of commands to manage local development ports. All commands are available through the `portmanager` or `portman` command.

## Global Options
```bash
portmanager [command] [options]

Options:
  -V, --version     Display version number
  -h, --help        Display help for command
```

## JSON Output Support

All commands support `--json` flag for machine-readable output, perfect for automation and scripting:

```bash
# Get JSON output from any command
portmanager check 3000 --json
portmanager list --json
portmanager scan --json
```

## Commands

### `check` - Check Port Status
Check if a port is free, reserved, or in use.

**Syntax:**
```bash
portmanager check <port> [options]
```

**Options:**
- `--json` - Output as JSON

**Examples:**
```bash
# Check single port
portmanager check 3000
# Output: Port 3000 is free

# Check reserved port
portmanager check 8080
# Output: Port 8080 is reserved for project "api-server"

# Check port in use
portmanager check 5432
# Output: Port 5432 is in use by process "postgres" (PID: 1234)

# JSON output
portmanager check 3000 --json
# Output: {"port":3000,"status":"free"}

portmanager check 8080 --json
# Output: {"port":8080,"status":"reserved","projectName":"api-server","description":"REST API"}
```

### `reserve` - Reserve a Port
Reserve a port for a specific project to prevent conflicts.

**Syntax:**
```bash
portmanager reserve <port> [options]
```

**Options:**
- `-n, --name <name>` - Project name (required)
- `-d, --desc <description>` - Port description
- `-t, --tags <tags...>` - Tags for categorization
- `--auto-release` - Auto-release when process stops
- `--json` - Output as JSON

**Examples:**
```bash
# Basic reservation
portmanager reserve 3000 --name "my-react-app"

# With description
portmanager reserve 8080 --name "api-server" --desc "Express.js REST API"

# With tags
portmanager reserve 5000 --name "microservice" --tags docker api production

# With auto-release
portmanager reserve 3001 --name "dev-server" --auto-release

# Full example
portmanager reserve 9000 \
  --name "dashboard" \
  --desc "Admin dashboard with real-time updates" \
  --tags react websocket admin \
  --auto-release

# JSON output
portmanager reserve 3000 --name "my-app" --json
# Output: {"number":3000,"projectName":"my-app","status":"reserved","reservedAt":"2025-01-26T10:30:00.000Z"}
```

### `release` - Release a Port
Release a previously reserved port.

**Syntax:**
```bash
portmanager release <port> [port2] [port3] ... [options]
```

**Options:**
- `--json` - Output as JSON

**Examples:**
```bash
# Release single port
portmanager release 3000
# Output: Released port 3000

# Release multiple ports
portmanager release 3000 3001 3002
# Output: Released 3 ports: 3000, 3001, 3002

# Attempt to release non-reserved port
portmanager release 4000
# Output: Error: Port 4000 is not reserved

# JSON output
portmanager release 3000 3001 --json
# Output: {"results":[{"port":3000,"status":"success"},{"port":3001,"status":"success"}]}
```

### `list` - List Reserved Ports
Display all reserved ports with their details.

**Syntax:**
```bash
portmanager list [options]
```

**Options:**
- `-s, --status <status>` - Filter by status (reserved, in-use, free)
- `-p, --project <name>` - Filter by project name
- `--json` - Output in JSON format

**Examples:**
```bash
# List all reserved ports
portmanager list
# Output:
# Port | Project      | Description          | Status   | Reserved At
# 3000 | my-react-app | React dev server    | reserved | 2025-01-15 10:30
# 8080 | api-server   | Express REST API    | in-use   | 2025-01-14 15:45

# Filter by status
portmanager list --status in-use

# Filter by project
portmanager list --project "api"

# JSON output for scripting
portmanager list --json
# Output: [{"port":3000,"projectName":"my-react-app",...}]
```

### `scan` - Scan Active Ports
Scan system for all ports currently in use.

**Syntax:**
```bash
portmanager scan [options]
```

**Options:**
- `--range <start-end>` - Scan specific port range
- `--reserved` - Include reservation info
- `--json` - Output as JSON

**Examples:**
```bash
# Scan all active ports
portmanager scan
# Output:
# Port | PID   | Process      | State  | Address
# 3000 | 12345 | node         | LISTEN | 127.0.0.1
# 5432 | 67890 | postgres     | LISTEN | 0.0.0.0
# 8080 | 54321 | java         | LISTEN | ::1

# Scan with reservation info
portmanager scan --reserved
# Output includes project names for reserved ports

# Scan specific range
portmanager scan --range 3000-4000

# JSON output
portmanager scan --json
# Output: [{"number":3000,"pid":12345,"processName":"node","state":"LISTEN"},...]
```

### `kill` - Kill Process on Port
Terminate the process using a specific port.

**Syntax:**
```bash
portmanager kill <port> [port2] [port3] ... [options]
```

**Options:**
- `-f, --force` - Force kill without confirmation
- `--json` - Output as JSON

**Examples:**
```bash
# Kill single process
portmanager kill 3000
# Output: Killed process on port 3000 (node, PID: 12345)

# Kill multiple processes
portmanager kill 3000 3001 8080
# Output: Killed 3 processes

# Attempt to kill on free port
portmanager kill 4000
# Output: Error: No process found on port 4000

# Force kill with sudo (if needed)
sudo portmanager kill 80

# JSON output
portmanager kill 3000 --json
# Output: {"results":[{"port":3000,"status":"success"}]}
```

### `request` - Request Multiple Ports
Request multiple available ports for a project.

**Syntax:**
```bash
portmanager request <count> [options]
```

**Arguments:**
- `<count>` - Number of ports to request (required)

**Options:**
- `-n, --name <name>` - Project name (required)
- `-d, --desc <description>` - Project description
- `-t, --tags <tags...>` - Tags for all ports
- `--sequential` - Request sequential ports (default)
- `--random` - Request random available ports
- `--start <port>` - Starting port for search (default: 3000)
- `--end <port>` - Ending port for search (default: 9999)
- `--avoid <ports...>` - Ports to avoid
- `--json` - Output as JSON

**Examples:**
```bash
# Request 3 sequential ports
portmanager request 3 --name "microservices"
# Output: Reserved ports 3000, 3001, 3002 for "microservices"

# Request random ports
portmanager request 5 --name "test-suite" --random

# Request with specific range
portmanager request 4 \
  --name "dev-cluster" \
  --start 8000 \
  --end 8100

# Request avoiding specific ports
portmanager request 3 \
  --name "api-gateway" \
  --avoid 3000 3001 8080

# Full example
portmanager request 6 \
  --name "full-stack-app" \
  --desc "Frontend, backend, and microservices" \
  --tags development docker \
  --sequential \
  --start 4000 \
  --avoid 4200 4444

# JSON output
portmanager request 2 --name "test" --json
# Output: {"ports":[{"number":3000,...},{"number":3001,...}],"summary":"Reserved 2 ports"}
```

### `export` - Export Configuration
Export port reservations to a JSON file.

**Syntax:**
```bash
portmanager export [filepath]
```

**Examples:**
```bash
# Export to default file
portmanager export
# Output: Exported to portmanager-export-2025-01-26.json

# Export to specific file
portmanager export ./configs/ports-backup.json

# Export and pipe to another command
portmanager export - | jq '.ports | length'
```

### `import` - Import Configuration
Import port reservations from a JSON file.

**Syntax:**
```bash
portmanager import <filepath> [options]
```

**Options:**
- `--merge` - Merge with existing ports instead of replacing
- `--dry-run` - Show what would be imported without making changes
- `--json` - Output result summary as JSON

**Examples:**
```bash
# Import from file
portmanager import ./configs/ports-backup.json
# Output: Imported 5 ports, skipped 2 (already in use)

# Import with validation
portmanager import production-ports.json
# Output shows any conflicts or errors

# JSON output
portmanager import ports.json --json
# Output: {"imported":5,"skipped":1,"errors":0,"total":6}
```

### `gui` - Launch GUI Application
Open the Port Manager desktop application.

**Syntax:**
```bash
portmanager gui
```

**Examples:**
```bash
# Launch GUI
portmanager gui
# Opens the desktop application

# Launch GUI in background (macOS/Linux)
portmanager gui &
```

## Common Use Cases

### Development Environment Setup
```bash
# Reserve common development ports
portmanager reserve 3000 --name "frontend" --desc "React development server"
portmanager reserve 8080 --name "backend" --desc "Express API server"
portmanager reserve 5432 --name "database" --desc "PostgreSQL database"
portmanager reserve 6379 --name "cache" --desc "Redis cache server"

# List all reserved ports
portmanager list
```

### Microservices Development
```bash
# Request multiple ports for microservices
portmanager request 5 \
  --name "microservices" \
  --desc "User, Auth, Product, Order, Payment services" \
  --tags docker kubernetes microservice

# Check specific service port
portmanager check 3002
```

### CI/CD Pipeline
```bash
# Request random ports to avoid conflicts
portmanager request 3 \
  --name "ci-test-$(date +%s)" \
  --random \
  --tags ci test temporary

# Clean up after tests
portmanager list --project "ci-test" --json | \
  jq -r '.[] | .port' | \
  xargs portmanager release
```

### Port Conflict Resolution
```bash
# Find what's using a port
portmanager scan | grep 3000

# Kill the process if needed
portmanager kill 3000

# Reserve it for your project
portmanager reserve 3000 --name "my-app"
```

### Team Collaboration
```bash
# Export team's port configuration
portmanager export team-ports.json

# Share with team via git
git add team-ports.json
git commit -m "Update port reservations"
git push

# Team member imports configuration
git pull
portmanager import team-ports.json
```

## Error Handling

### Common Errors and Solutions

**Port Already in Use**
```bash
portmanager reserve 3000 --name "app"
# Error: Port 3000 is already in use

# Solution: Check what's using it
portmanager check 3000
portmanager scan | grep 3000

# Then either kill it or use a different port
portmanager kill 3000
# or
portmanager reserve 3001 --name "app"
```

**Port Already Reserved**
```bash
portmanager reserve 8080 --name "new-project"
# Error: Port 8080 is reserved for project "old-project"

# Solution: Release it first
portmanager release 8080
portmanager reserve 8080 --name "new-project"
```

**Invalid Port Number**
```bash
portmanager check 99999
# Error: Invalid port number: 99999. Must be between 1 and 65535
```

**Permission Denied**
```bash
portmanager kill 80
# Error: Permission denied

# Solution: Use sudo for system ports
sudo portmanager kill 80
```

## Tips and Best Practices

1. **Use Descriptive Names**: Always provide meaningful project names and descriptions
   ```bash
   portmanager reserve 3000 --name "customer-portal-frontend" \
     --desc "React app for customer self-service portal"
   ```

2. **Tag Your Ports**: Use tags for better organization
   ```bash
   portmanager reserve 8080 --name "api" --tags production critical monitored
   ```

3. **Document Port Usage**: Export configurations regularly
   ```bash
   # Add to your project's setup script
   portmanager export ./docs/port-config.json
   ```

4. **Use Request for Multiple Ports**: Instead of reserving individually
   ```bash
   # Good
   portmanager request 5 --name "microservices-dev"
   
   # Avoid
   portmanager reserve 3000 --name "service-1"
   portmanager reserve 3001 --name "service-2"
   # etc...
   ```

5. **Clean Up Regularly**: Release ports you're not using
   ```bash
   # Check what you have reserved
   portmanager list --project "old-project"
   
   # Release if not needed
   portmanager release 4000 4001 4002
   ```

## Automation and Scripting with JSON Output

The `--json` flag enables powerful automation capabilities by providing structured output that can be parsed and processed by other tools. This is essential for CI/CD pipelines, monitoring systems, and automated workflows.

### Basic JSON Processing

```bash
# Use jq to parse JSON output
portmanager list --json | jq '.[] | select(.status == "in-use")'

# Count reserved ports
portmanager list --json | jq 'length'

# Extract port numbers only
portmanager list --json | jq -r '.[].number'
```

### Automated Port Management Scripts

```bash
#!/bin/bash
# auto-reserve.sh - Automatically find and reserve an available port

RESULT=$(portmanager request 1 --name "$1" --json)
PORT=$(echo $RESULT | jq -r '.ports[0].number')

if [ -n "$PORT" ]; then
    echo "Reserved port $PORT for $1"
    echo $PORT > .port
else
    echo "Failed to reserve port"
    exit 1
fi
```

### CI/CD Integration

```bash
# GitHub Actions example
- name: Reserve test ports
  run: |
    PORTS=$(portmanager request 3 --name "ci-test-${{ github.run_id }}" --json)
    echo "PORTS=$PORTS" >> $GITHUB_ENV
    echo $PORTS | jq -r '.ports[].number' > test-ports.txt

- name: Run tests
  run: |
    # Use reserved ports for testing
    npm test

- name: Clean up ports
  if: always()
  run: |
    cat test-ports.txt | xargs portmanager release
```

### Monitoring and Alerting

```bash
#!/bin/bash
# check-port-conflicts.sh - Monitor for port conflicts

# Get all reserved ports
RESERVED=$(portmanager list --json | jq -r '.[].number')

# Check each reserved port
for PORT in $RESERVED; do
    STATUS=$(portmanager check $PORT --json | jq -r '.status')
    if [ "$STATUS" = "in-use" ]; then
        PROJECT=$(portmanager check $PORT --json | jq -r '.projectName')
        echo "ALERT: Port $PORT reserved for $PROJECT is in use by another process"
    fi
done
```

### Docker Integration

```bash
# docker-port-manager.sh - Manage ports for Docker containers

# Reserve ports for container
PORTS=$(portmanager request 2 --name "docker-$1" --json)
WEB_PORT=$(echo $PORTS | jq -r '.ports[0].number')
API_PORT=$(echo $PORTS | jq -r '.ports[1].number')

# Run container with reserved ports
docker run -d \
    -p $WEB_PORT:80 \
    -p $API_PORT:8080 \
    --name $1 \
    myapp:latest

# Clean up on container stop
docker wait $1
portmanager release $WEB_PORT $API_PORT
```

### Python Integration

```python
#!/usr/bin/env python3
import json
import subprocess

def get_available_port(project_name):
    """Reserve an available port for a project"""
    result = subprocess.run(
        ['portmanager', 'request', '1', '--name', project_name, '--json'],
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        data = json.loads(result.stdout)
        return data['ports'][0]['number']
    else:
        raise Exception(f"Failed to reserve port: {result.stderr}")

# Use in your application
port = get_available_port('my-python-app')
print(f"Starting server on port {port}")
```

### Node.js Integration

```javascript
const { execSync } = require('child_process');

// Reserve port for development
function reserveDevPort(projectName) {
  try {
    const result = execSync(
      `portmanager request 1 --name "${projectName}" --json`,
      { encoding: 'utf8' }
    );
    const data = JSON.parse(result);
    return data.ports[0].number;
  } catch (error) {
    console.error('Failed to reserve port:', error.message);
    process.exit(1);
  }
}

// Use in package.json scripts
const port = reserveDevPort('my-node-app');
process.env.PORT = port;
```

### Advanced Automation Examples

```bash
# Batch port operations
portmanager list --json | \
  jq -r '.[] | select(.projectName | startswith("test-")) | .number' | \
  xargs portmanager release

# Port usage report
portmanager scan --json | \
  jq -r '.[] | [.number, .processName, .pid] | @csv' > port-usage.csv

# Auto-cleanup old reservations
portmanager list --json | \
  jq -r --arg date "$(date -d '7 days ago' -u +%Y-%m-%dT%H:%M:%S.%3NZ)" \
  '.[] | select(.reservedAt < $date) | .number' | \
  xargs -r portmanager release
```

## Integration Examples

### package.json Scripts
```json
{
  "scripts": {
    "predev": "portmanager check 3000 || portmanager kill 3000",
    "dev": "portmanager reserve 3000 --name 'my-app' && npm start",
    "postdev": "portmanager release 3000"
  }
}
```

### Docker Compose
```yaml
services:
  app:
    ports:
      - "3000:3000"
    command: >
      sh -c "portmanager reserve 3000 --name 'docker-app' &&
             node server.js"
```

### Shell Aliases
```bash
# Add to ~/.bashrc or ~/.zshrc
alias pm='portmanager'
alias pmcheck='portmanager check'
alias pmlist='portmanager list'
alias pmkill='portmanager kill'

# Quick port check function
checkport() {
  portmanager check $1 || portmanager scan | grep $1
}
```

## Troubleshooting

### GUI Won't Launch
```bash
# Check if built
npm run build:gui

# Fix native modules
./scripts/fix-native-modules.sh electron

# Try again
portmanager gui
```

### Database Issues
```bash
# Database is stored at ~/.portmanager/ports.db
# Backup current database
cp ~/.portmanager/ports.db ~/.portmanager/ports.db.backup

# Reset if corrupted (loses all reservations)
rm ~/.portmanager/ports.db
portmanager list  # Creates new database
```

### Command Not Found
```bash
# Ensure proper installation
npm install -g portmanager

# Or if installed locally
npm link

# Verify installation
which portmanager
portmanager --version
```

---

For more information, visit the [GitHub repository](https://github.com/ahmadzein/portmanager) or run `portmanager --help`.