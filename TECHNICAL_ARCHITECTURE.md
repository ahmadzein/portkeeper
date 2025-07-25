# Port Manager - Technical Architecture

## Overview
This document outlines the technical architecture, design decisions, and implementation details for the Port Manager application.

## Technology Stack Decision

### Core Technologies
- **Language**: TypeScript/Node.js
  - Wide ecosystem support
  - Shared code between CLI and GUI
  - Excellent developer tooling
  - Native async/await support

- **CLI Framework**: Commander.js
  - Industry standard for Node CLIs
  - Extensive plugin ecosystem
  - Excellent TypeScript support
  - Built-in help generation

- **GUI Framework**: Electron + React
  - Mature ecosystem
  - Cross-platform support
  - Shared Node.js runtime with CLI
  - Hot reload for development
  - Native OS integration

- **Database**: SQLite3
  - Zero configuration
  - File-based storage
  - ACID compliant
  - Excellent Node.js bindings
  - Portable data files

- **State Management**: Zustand (GUI)
  - Lightweight and simple
  - TypeScript first
  - React hooks based
  - Minimal boilerplate

## Architecture Patterns

### Layered Architecture
```
┌─────────────────────────────────────┐
│         CLI Interface               │
├─────────────────────────────────────┤
│         GUI Interface               │
├─────────────────────────────────────┤
│      Business Logic Layer           │
├─────────────────────────────────────┤
│      Data Access Layer              │
├─────────────────────────────────────┤
│        SQLite Database              │
└─────────────────────────────────────┘
```

### Shared Core Pattern
Both CLI and GUI share the same core business logic:
- Port management operations
- Database interactions
- System port scanning
- Process management

## Module Structure

### Core Modules

```typescript
// src/core/models/Port.ts
interface Port {
  number: number;
  projectName: string;
  description?: string;
  status: 'reserved' | 'in-use' | 'free';
  pid?: number;
  reservedAt: Date;
  lastUsed?: Date;
  tags?: string[];
  autoRelease?: boolean;
}

// src/core/services/PortService.ts
class PortService {
  async checkPort(port: number): Promise<PortStatus>
  async reservePort(port: number, options: ReserveOptions): Promise<Port>
  async releasePort(port: number): Promise<void>
  async listPorts(filter?: PortFilter): Promise<Port[]>
  async killProcess(port: number): Promise<void>
  async scanActivePorts(): Promise<ActivePort[]>
}

// src/core/database/Database.ts
class Database {
  async connect(): Promise<void>
  async migrate(): Promise<void>
  async close(): Promise<void>
}
```

### CLI Architecture

```typescript
// src/cli/commands/check.ts
export const checkCommand = new Command('check')
  .argument('<port>', 'Port number to check')
  .action(async (port: string) => {
    const portService = new PortService();
    const status = await portService.checkPort(parseInt(port));
    console.log(formatPortStatus(status));
  });
```

### GUI Architecture

```
gui/
├── src/
│   ├── main/           # Electron main process
│   ├── renderer/       # React app
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── store/
│   └── preload/        # Electron preload scripts
```

## Database Schema

```sql
CREATE TABLE ports (
  number INTEGER PRIMARY KEY,
  project_name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK(status IN ('reserved', 'in-use', 'free')),
  pid INTEGER,
  reserved_at DATETIME NOT NULL,
  last_used DATETIME,
  auto_release BOOLEAN DEFAULT 0
);

CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  port_number INTEGER,
  tag TEXT NOT NULL,
  FOREIGN KEY (port_number) REFERENCES ports(number) ON DELETE CASCADE
);

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

## IPC Communication

### CLI ↔ Database
Direct SQLite connection with connection pooling.

### GUI ↔ Core
Electron IPC for secure communication:

```typescript
// Main process
ipcMain.handle('port:check', async (event, port: number) => {
  return await portService.checkPort(port);
});

// Renderer process
const checkPort = async (port: number) => {
  return await window.portManager.checkPort(port);
};
```

## Security Considerations

### Electron Security
- Context isolation enabled
- Node integration disabled in renderer
- Preload scripts for API exposure
- Content Security Policy

### Port Operations
- Validate port numbers (1-65535)
- Sanitize user inputs
- Require elevated permissions for system ports (< 1024)
- Audit log for sensitive operations

## Performance Optimization

### Database
- Indexed port numbers
- Connection pooling
- Prepared statements
- Batch operations

### GUI
- Virtual scrolling for large lists
- Debounced search
- Memoized components
- Lazy loading

### CLI
- Minimal dependencies
- Fast startup time
- Efficient port scanning
- Progress indicators

## Error Handling

### Error Types
```typescript
class PortManagerError extends Error {
  constructor(message: string, public code: string) {
    super(message);
  }
}

class PortInUseError extends PortManagerError {}
class PortReservedError extends PortManagerError {}
class InvalidPortError extends PortManagerError {}
class ProcessKillError extends PortManagerError {}
```

### Error Recovery
- Graceful degradation
- User-friendly messages
- Retry mechanisms
- Rollback support

## Testing Strategy

### Unit Tests
- Jest for all modules
- 80% coverage target
- Mock database and system calls

### Integration Tests
- Test CLI commands end-to-end
- Test GUI interactions
- Database migration tests

### E2E Tests
- Playwright for GUI testing
- CLI smoke tests
- Cross-platform validation

## Build and Distribution

### CLI Package
```json
{
  "bin": {
    "portman": "./dist/cli/index.js"
  },
  "pkg": {
    "scripts": "dist/**/*.js",
    "assets": "dist/**/*.node",
    "targets": ["node16-linux-x64", "node16-macos-x64", "node16-win-x64"]
  }
}
```

### GUI Distribution
- Electron Builder for packaging
- Auto-update support
- Code signing for macOS/Windows
- AppImage/deb/rpm for Linux

## Monitoring and Analytics

### Metrics to Track
- Feature usage (anonymized)
- Error rates
- Performance metrics
- Platform distribution

### Implementation
- Opt-in analytics
- Local-first approach
- Privacy-focused design

## Development Workflow

### Git Strategy
- Feature branches
- Semantic versioning
- Conventional commits
- Protected main branch

### CI/CD Pipeline
```yaml
# .github/workflows/main.yml
- Lint and format check
- Unit tests
- Integration tests
- Build artifacts
- Security scanning
- Release automation
```

## Future Considerations

### Extensibility
- Plugin system for custom commands
- API for third-party integrations
- Webhook support

### Scalability
- Multi-user support
- Remote port management
- Docker integration
- Cloud sync capability

---

*This architecture is designed for maintainability, performance, and cross-platform compatibility.*