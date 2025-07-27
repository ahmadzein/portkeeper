# API Documentation

Port Keeper provides programmatic interfaces for integration with your applications and automation scripts.

## 🔌 Integration Methods

### 1. CLI with JSON Output
Most straightforward for scripting and automation.

### 2. Node.js Direct Integration
Import Port Keeper modules directly (advanced).

### 3. Child Process Execution
Run CLI commands from any programming language.

## 📡 CLI JSON API

All CLI commands support `--json` flag for structured output.

### Response Format

#### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed"
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### API Endpoints via CLI

#### Check Port Status
```bash
portman check 3000 --json
```

Response:
```json
{
  "success": true,
  "data": {
    "port": 3000,
    "status": "free|reserved|in-use",
    "project": "project-name",
    "description": "Port description",
    "pid": 12345,
    "processName": "node"
  }
}
```

#### Reserve Port
```bash
portman reserve 3000 -n "my-app" -d "API server" --json
```

Response:
```json
{
  "success": true,
  "data": {
    "port": 3000,
    "projectName": "my-app",
    "description": "API server",
    "status": "reserved",
    "reservedAt": "2024-01-20T10:30:00.000Z"
  },
  "message": "Port 3000 reserved successfully"
}
```

#### List Ports
```bash
portman list --json
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "number": 3000,
      "projectName": "my-app",
      "description": "API server",
      "status": "reserved",
      "pid": null,
      "reservedAt": "2024-01-20T10:30:00.000Z",
      "tags": ["backend", "api"]
    }
  ]
}
```

#### Scan Active Ports
```bash
portman scan --json
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "port": 3000,
      "pid": 12345,
      "processName": "node",
      "state": "LISTEN",
      "address": "0.0.0.0",
      "projectName": "my-app",
      "isReserved": true
    }
  ]
}
```

#### Request Multiple Ports
```bash
portman request 3 -n "microservices" --json
```

Response:
```json
{
  "success": true,
  "data": {
    "ports": [
      {"number": 3000, "projectName": "microservices-1"},
      {"number": 3001, "projectName": "microservices-2"},
      {"number": 3002, "projectName": "microservices-3"}
    ],
    "count": 3,
    "method": "sequential"
  }
}
```

## 🔧 Language Integration Examples

### Node.js/JavaScript

```javascript
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class PortKeeper {
  async checkPort(port) {
    const { stdout } = await execPromise(`portman check ${port} --json`);
    return JSON.parse(stdout);
  }

  async reservePort(port, project, description) {
    const cmd = `portman reserve ${port} -n "${project}" -d "${description}" --json`;
    const { stdout } = await execPromise(cmd);
    return JSON.parse(stdout);
  }

  async listPorts(options = {}) {
    let cmd = 'portman list --json';
    if (options.project) cmd += ` -p "${options.project}"`;
    if (options.status) cmd += ` -s ${options.status}`;
    
    const { stdout } = await execPromise(cmd);
    return JSON.parse(stdout);
  }

  async releasePort(port) {
    const { stdout } = await execPromise(`portman release ${port} --json`);
    return JSON.parse(stdout);
  }
}

// Usage
const pk = new PortKeeper();
const result = await pk.checkPort(3000);
if (result.data.status === 'free') {
  await pk.reservePort(3000, 'my-app', 'Development server');
}
```

### Python

```python
import subprocess
import json

class PortKeeper:
    def run_command(self, cmd):
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return json.loads(result.stdout)
    
    def check_port(self, port):
        return self.run_command(f'portman check {port} --json')
    
    def reserve_port(self, port, project, description=''):
        cmd = f'portman reserve {port} -n "{project}"'
        if description:
            cmd += f' -d "{description}"'
        cmd += ' --json'
        return self.run_command(cmd)
    
    def list_ports(self, project=None, status=None):
        cmd = 'portman list --json'
        if project:
            cmd += f' -p "{project}"'
        if status:
            cmd += f' -s {status}'
        return self.run_command(cmd)
    
    def release_port(self, port):
        return self.run_command(f'portman release {port} --json')
    
    def request_ports(self, count, project, sequential=True):
        cmd = f'portman request {count} -n "{project}"'
        if sequential:
            cmd += ' --sequential'
        cmd += ' --json'
        return self.run_command(cmd)

# Usage
pk = PortKeeper()
result = pk.check_port(3000)
if result['data']['status'] == 'free':
    pk.reserve_port(3000, 'my-app', 'API server')
```

### Ruby

```ruby
require 'json'
require 'open3'

class PortKeeper
  def run_command(cmd)
    stdout, stderr, status = Open3.capture3(cmd)
    JSON.parse(stdout)
  end

  def check_port(port)
    run_command("portman check #{port} --json")
  end

  def reserve_port(port, project, description = nil)
    cmd = "portman reserve #{port} -n \"#{project}\""
    cmd += " -d \"#{description}\"" if description
    cmd += " --json"
    run_command(cmd)
  end

  def list_ports(project: nil, status: nil)
    cmd = "portman list --json"
    cmd += " -p \"#{project}\"" if project
    cmd += " -s #{status}" if status
    run_command(cmd)
  end

  def release_port(port)
    run_command("portman release #{port} --json")
  end
end

# Usage
pk = PortKeeper.new
result = pk.check_port(3000)
if result['data']['status'] == 'free'
  pk.reserve_port(3000, 'my-app', 'Rails server')
end
```

### Go

```go
package main

import (
    "encoding/json"
    "fmt"
    "os/exec"
)

type PortKeeper struct{}

type Response struct {
    Success bool        `json:"success"`
    Data    interface{} `json:"data"`
    Message string      `json:"message"`
    Error   string      `json:"error"`
}

func (pk *PortKeeper) runCommand(command string) (*Response, error) {
    cmd := exec.Command("sh", "-c", command)
    output, err := cmd.Output()
    if err != nil {
        return nil, err
    }

    var response Response
    err = json.Unmarshal(output, &response)
    return &response, err
}

func (pk *PortKeeper) CheckPort(port int) (*Response, error) {
    return pk.runCommand(fmt.Sprintf("portman check %d --json", port))
}

func (pk *PortKeeper) ReservePort(port int, project, description string) (*Response, error) {
    cmd := fmt.Sprintf("portman reserve %d -n \"%s\"", port, project)
    if description != "" {
        cmd += fmt.Sprintf(" -d \"%s\"", description)
    }
    cmd += " --json"
    return pk.runCommand(cmd)
}

// Usage
pk := &PortKeeper{}
resp, _ := pk.CheckPort(3000)
if resp.Success {
    // Port check successful
}
```

### Bash/Shell

```bash
#!/bin/bash

# Port management functions
check_port() {
    portman check "$1" --json | jq -r '.data.status'
}

reserve_port() {
    local port=$1
    local project=$2
    local desc=${3:-""}
    
    if [ -n "$desc" ]; then
        portman reserve "$port" -n "$project" -d "$desc" --json
    else
        portman reserve "$port" -n "$project" --json
    fi
}

list_project_ports() {
    portman list -p "$1" --json | jq -r '.data[].number'
}

release_project_ports() {
    local ports=$(list_project_ports "$1")
    if [ -n "$ports" ]; then
        echo "$ports" | xargs portman release
    fi
}

# Usage
if [ "$(check_port 3000)" = "free" ]; then
    reserve_port 3000 "my-app" "Development server"
fi
```

## 🔄 Event Handling

### Polling for Changes

```javascript
// Poll for port status changes
async function monitorPort(port, interval = 5000) {
  const pk = new PortKeeper();
  let lastStatus = null;
  
  setInterval(async () => {
    const result = await pk.checkPort(port);
    const currentStatus = result.data.status;
    
    if (currentStatus !== lastStatus) {
      console.log(`Port ${port} status changed: ${lastStatus} → ${currentStatus}`);
      lastStatus = currentStatus;
      
      // Handle status change
      if (currentStatus === 'free') {
        // Port became available
      } else if (currentStatus === 'in-use') {
        // Port is now in use
      }
    }
  }, interval);
}
```

## 🏗️ Advanced Integration

### Direct Node.js Module Usage

```javascript
// Advanced: Direct usage (requires local installation)
import { PortService } from 'portkeeper/dist/core/services/PortService.js';
import { PortDatabase } from 'portkeeper/dist/core/database/Database.js';

const db = new PortDatabase();
const service = new PortService(db);

// Direct API calls
const ports = await service.getAllPorts();
const status = await service.checkPort(3000);
await service.reservePort(3000, 'my-app', 'API server', ['backend']);
```

## 🔐 Error Handling

### Error Codes

- `PORT_INVALID` - Invalid port number (not 1-65535)
- `PORT_RESERVED` - Port already reserved
- `PORT_IN_USE` - Port actively in use
- `PORT_NOT_FOUND` - Port not in database
- `PROJECT_REQUIRED` - Project name missing
- `PERMISSION_DENIED` - Insufficient permissions
- `DATABASE_ERROR` - Database operation failed

### Error Handling Example

```javascript
async function safeReservePort(port, project) {
  try {
    const result = await pk.reservePort(port, project);
    if (result.success) {
      console.log(`Port ${port} reserved for ${project}`);
    }
  } catch (error) {
    // CLI command failed
    console.error('Command execution failed:', error);
  }
}

// Check JSON response
const result = await pk.checkPort(3000);
if (!result.success) {
  switch (result.code) {
    case 'PORT_INVALID':
      console.error('Invalid port number');
      break;
    case 'DATABASE_ERROR':
      console.error('Database error:', result.error);
      break;
    default:
      console.error('Unknown error:', result.error);
  }
}
```

## 🚀 Best Practices

1. **Always check port status** before reserving
2. **Handle errors gracefully** - network/permission issues
3. **Use descriptive project names** for team clarity
4. **Release ports** when done to free resources
5. **Cache responses** when appropriate
6. **Implement retries** for transient failures
7. **Log operations** for debugging
8. **Validate input** before CLI calls

## 📊 Performance Considerations

### Batch Operations
```javascript
// Inefficient: Multiple calls
for (const port of ports) {
  await pk.checkPort(port);
}

// Efficient: Single list call with filtering
const result = await pk.listPorts({ status: 'reserved' });
const reservedPorts = result.data.map(p => p.number);
```

### Response Caching
```javascript
class CachedPortKeeper extends PortKeeper {
  constructor(cacheTime = 5000) {
    super();
    this.cache = new Map();
    this.cacheTime = cacheTime;
  }

  async checkPort(port) {
    const key = `check:${port}`;
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.time < this.cacheTime) {
      return cached.data;
    }
    
    const result = await super.checkPort(port);
    this.cache.set(key, { data: result, time: Date.now() });
    return result;
  }
}
```

## 🔮 Future API Features

Planned enhancements:
- WebSocket support for real-time updates
- REST API server mode
- GraphQL endpoint
- gRPC support
- SDK packages for major languages

---

For more examples and updates, check our [GitHub repository](https://github.com/ahmadzein/portkeeper) or [open an issue](https://github.com/ahmadzein/portkeeper/issues) for feature requests.