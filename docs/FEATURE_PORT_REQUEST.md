# Port Request Feature Documentation

## Overview

The Port Request feature allows users to dynamically find and reserve multiple available ports with a single command. This is particularly useful for microservices, testing environments, and development setups that require multiple ports.

## CLI Usage

### Basic Syntax
```bash
portman request <count> [options]
```

### Options
- `-n, --name <name>` - Project name (required)
- `-d, --desc <description>` - Description for the ports
- `-t, --tags <tags>` - Comma-separated tags
- `-s, --sequential` - Find sequential ports (default)
- `-r, --random` - Find random ports
- `--start <port>` - Start of port range (default: 3000)
- `--end <port>` - End of port range (default: 9999)
- `--avoid <ports>` - Additional ports to avoid (comma-separated)

### Examples

#### Sequential Ports for Microservices
```bash
portman request 5 -n "shop-api" -d "E-commerce microservices"

# Output:
✓ Successfully reserved 5 port(s) for "shop-api": 3000, 3001, 3002, 3003, 3004

Reserved Ports:
  • Port 3000: shop-api-1
  • Port 3001: shop-api-2
  • Port 3002: shop-api-3
  • Port 3003: shop-api-4
  • Port 3004: shop-api-5
```

#### Random Ports for Testing
```bash
portman request 3 -n "e2e-tests" -r --start 5000 --end 6000

# Output:
✓ Successfully reserved 3 port(s) for "e2e-tests": 5234, 5789, 5456
```

#### With Custom Avoid List
```bash
portman request 2 -n "dev-server" --avoid "8080,8081,8082"
```

## GUI Usage

1. Click the **Actions** menu in the header
2. Select **Request Multiple Ports**
3. Fill in the form:
   - Number of ports needed
   - Project name
   - Optional description and tags
   - Selection mode (Sequential/Random)
   - Adjust port range if needed
4. Preview shows example ports
5. Click **Request Ports**

## How It Works

### Algorithm

1. **Validation**: Ensures count is between 1-100
2. **Port Discovery**:
   - Sequential: Starts from `startPort` and increments
   - Random: Randomly selects within range
3. **Availability Check**: Verifies each port is free
4. **Atomic Reservation**: All ports reserved or none (rollback on failure)
5. **Naming**: Each port named as `{projectName}-{index}`

### Commonly Avoided Ports

The system automatically avoids:
- 80, 443 (HTTP/HTTPS)
- 3306 (MySQL)
- 5432 (PostgreSQL)
- 27017 (MongoDB)
- 6379 (Redis)
- 22, 21, 25 (SSH, FTP, SMTP)

### Features

- **Atomic Operations**: All-or-nothing reservation
- **Smart Selection**: Avoids common and user-specified ports
- **Flexible Range**: Configurable port range
- **Rollback Support**: Automatic cleanup on failure
- **Detailed Output**: Clear success/error messages

## Use Cases

### 1. Microservices Development
```bash
portman request 5 -n "microservices" -d "API Gateway, Auth, Users, Orders, Payments"
```

### 2. Testing Environments
```bash
portman request 10 -n "ci-tests" -r -t "testing,ci"
```

### 3. Development Stack
```bash
portman request 3 -n "fullstack" -d "Frontend, Backend, Database"
```

### 4. Load Testing
```bash
portman request 20 -n "load-test" -r --start 10000 --end 20000
```

## Error Handling

### Insufficient Ports Available
```
Error: Only found 3 available ports out of 5 requested
```

### Port Already in Use
The algorithm automatically skips ports in use and continues searching.

### Invalid Range
```
Error: Invalid port number: 70000. Must be between 1 and 65535
```

## Best Practices

1. **Use Sequential for Related Services**: Keep related services on consecutive ports
2. **Use Random for Isolation**: Prevent port conflicts in shared environments
3. **Tag Appropriately**: Use tags for easy filtering later
4. **Document Purpose**: Add descriptions for team clarity
5. **Release When Done**: Free up ports after use

## Technical Details

- Maximum ports per request: 100
- Default port range: 3000-9999
- Rollback on any reservation failure
- Thread-safe implementation
- Supports concurrent requests

## Integration

The request feature integrates with all existing Port Manager functionality:
- Reserved ports appear in `portman list`
- Can be released with `portman release`
- Visible in GUI dashboard
- Included in export/import operations

## Performance

- Port scanning: O(n) where n is ports to find
- Reservation: O(n) atomic operations
- Typical request (5 ports): < 100ms
- Large request (50 ports): < 500ms