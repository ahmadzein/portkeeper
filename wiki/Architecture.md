# Architecture

Technical architecture and design of Port Keeper.

## 🏗️ System Overview

Port Keeper follows a modular architecture with clear separation between CLI, GUI, and core functionality.

```
┌─────────────────────────────────────────────────────┐
│                   User Interface                     │
├─────────────────────┬───────────────────────────────┤
│      CLI (Node.js)  │      GUI (Electron)           │
├─────────────────────┴───────────────────────────────┤
│                  Core Library                        │
│        (Port Service, Database, Models)              │
├─────────────────────────────────────────────────────┤
│                Database (SQLite)                     │
└─────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
portkeeper/
├── src/
│   ├── cli/                    # CLI implementation
│   │   ├── index.ts           # CLI entry point
│   │   ├── commands/          # Command implementations
│   │   └── utils/             # CLI utilities
│   │
│   ├── gui/                    # GUI implementation
│   │   ├── main/              # Electron main process
│   │   ├── preload/           # Preload scripts
│   │   └── renderer/          # React application
│   │       ├── components/    # React components
│   │       ├── pages/         # Page components
│   │       ├── hooks/         # Custom React hooks
│   │       └── store/         # State management
│   │
│   └── core/                   # Shared core logic
│       ├── models/            # Data models
│       ├── services/          # Business logic
│       └── database/          # Database layer
│
├── dist/                       # Compiled output
├── scripts/                    # Build/utility scripts
├── tests/                      # Test files
└── docs/                       # Documentation
```

## 🔧 Core Components

### 1. Port Service

The central service managing all port operations.

```typescript
// src/core/services/PortService.ts
export class PortService {
  constructor(private db: PortDatabase) {}
  
  async checkPort(port: number): Promise<PortStatus> {
    // Check database for reservation
    const dbPort = await this.db.getPort(port);
    if (dbPort?.status === 'reserved') {
      return this.checkReservedPort(dbPort);
    }
    
    // Check if port is actively in use
    const isActive = await this.isPortInUse(port);
    if (isActive) {
      return this.getActivePortInfo(port);
    }
    
    return { status: 'free', port };
  }
  
  async reservePort(
    port: number,
    projectName: string,
    description?: string,
    tags?: string[]
  ): Promise<Port> {
    // Validate port availability
    const status = await this.checkPort(port);
    if (status.status !== 'free') {
      throw new PortError('Port not available');
    }
    
    // Create reservation
    return this.db.createPort({
      number: port,
      projectName,
      description,
      status: 'reserved',
      tags
    });
  }
}
```

### 2. Database Layer

Abstraction over SQLite operations.

```typescript
// src/core/database/Database.ts
export class PortDatabase {
  private db: Database;
  
  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.initialize();
  }
  
  private initialize() {
    // Create tables if not exists
    this.db.exec(SCHEMA_SQL);
    
    // Run migrations
    this.runMigrations();
  }
  
  async getPort(number: number): Promise<Port | null> {
    return this.db.prepare(
      'SELECT * FROM ports WHERE number = ?'
    ).get(number);
  }
  
  async createPort(port: Partial<Port>): Promise<Port> {
    const stmt = this.db.prepare(`
      INSERT INTO ports (number, projectName, description, status, tags)
      VALUES (@number, @projectName, @description, @status, @tags)
    `);
    
    stmt.run(port);
    return this.getPort(port.number!);
  }
}
```

### 3. CLI Architecture

Command-based architecture using Commander.js.

```typescript
// src/cli/index.ts
import { Command } from 'commander';

const program = new Command();

program
  .name('portman')
  .description('Port Keeper - Manage development ports')
  .version(VERSION);

// Register commands
registerCommands(program);

// Parse arguments
program.parse(process.argv);
```

Each command is a separate module:

```typescript
// src/cli/commands/reserve.ts
export function registerReserveCommand(program: Command) {
  program
    .command('reserve <port>')
    .description('Reserve a port')
    .option('-n, --name <name>', 'Project name')
    .option('-d, --desc <description>', 'Description')
    .option('-t, --tags <tags...>', 'Tags')
    .action(async (port, options) => {
      const service = await getPortService();
      const result = await service.reservePort(
        parseInt(port),
        options.name,
        options.desc,
        options.tags
      );
      
      displayResult(result, options);
    });
}
```

### 4. GUI Architecture

Electron-based with React frontend.

#### Main Process
```typescript
// src/gui/main/index.ts
import { app, BrowserWindow, ipcMain } from 'electron';

let mainWindow: BrowserWindow | null;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true
    }
  });
  
  // Register IPC handlers
  registerIPCHandlers();
  
  // Load the app
  mainWindow.loadFile('dist/renderer/index.html');
});
```

#### Preload Script
```typescript
// src/gui/preload/index.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('portManager', {
  port: {
    check: (port: number) => ipcRenderer.invoke('port:check', port),
    reserve: (port: number, options: any) => 
      ipcRenderer.invoke('port:reserve', port, options),
    list: (options: any) => ipcRenderer.invoke('port:list', options),
    release: (ports: number[]) => 
      ipcRenderer.invoke('port:release', ports)
  }
});
```

#### React Application
```typescript
// src/gui/renderer/App.tsx
import React from 'react';
import { Dashboard } from './pages/Dashboard';
import { ScanView } from './pages/ScanView';
import { usePortStore } from './store/portStore';

export function App() {
  const { ports, fetchPorts } = usePortStore();
  
  React.useEffect(() => {
    fetchPorts();
  }, []);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/scan" element={<ScanView />} />
      </Routes>
    </Router>
  );
}
```

## 🔄 Data Flow

### CLI Data Flow
```
User Input → Commander.js → Command Handler → Port Service → Database → Response → Console Output
```

### GUI Data Flow
```
User Action → React Component → IPC Renderer → IPC Main → Port Service → Database → IPC Response → State Update → UI Update
```

## 💾 State Management

### CLI State
- Stateless between commands
- Configuration loaded per command
- Database handles persistence

### GUI State (Zustand)
```typescript
// src/gui/renderer/store/portStore.ts
interface PortStore {
  ports: Port[];
  loading: boolean;
  error: string | null;
  
  fetchPorts: () => Promise<void>;
  reservePort: (port: number, options: any) => Promise<void>;
  releasePort: (port: number) => Promise<void>;
}

export const usePortStore = create<PortStore>((set, get) => ({
  ports: [],
  loading: false,
  error: null,
  
  fetchPorts: async () => {
    set({ loading: true });
    try {
      const ports = await window.portManager.port.list();
      set({ ports, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));
```

## 🔌 Plugin Architecture

Future support for plugins:

```typescript
interface PortKeeperPlugin {
  name: string;
  version: string;
  
  // Lifecycle hooks
  onInstall?: () => Promise<void>;
  onUninstall?: () => Promise<void>;
  
  // Event hooks
  onPortReserved?: (port: Port) => Promise<void>;
  onPortReleased?: (port: Port) => Promise<void>;
  
  // Command extensions
  commands?: CommandDefinition[];
  
  // GUI extensions
  components?: ComponentDefinition[];
}
```

## 🔒 Security Architecture

### Process Isolation
- GUI renderer process isolated from main
- No direct file system access from renderer
- All operations through IPC

### Input Validation
```typescript
// Port number validation
function validatePort(port: number): void {
  if (port < 1 || port > 65535) {
    throw new Error('Invalid port number');
  }
}

// Project name sanitization
function sanitizeProjectName(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_]/g, '');
}
```

### Permission Model
- User-level permissions only
- No elevated privileges required
- Database file permissions: 600

## 🚀 Performance Considerations

### Database Performance
- SQLite with WAL mode
- Indexed columns for fast queries
- Connection pooling in GUI

### Port Scanning
- Parallel scanning with worker threads
- Configurable batch sizes
- Caching of scan results

### GUI Performance
- Virtual scrolling for large lists
- Debounced search inputs
- React.memo for expensive components

## 🧪 Testing Architecture

### Unit Tests
```typescript
// tests/unit/services/PortService.test.ts
describe('PortService', () => {
  let service: PortService;
  let db: MockDatabase;
  
  beforeEach(() => {
    db = new MockDatabase();
    service = new PortService(db);
  });
  
  test('reserves available port', async () => {
    const port = await service.reservePort(3000, 'test');
    expect(port.status).toBe('reserved');
  });
});
```

### Integration Tests
```typescript
// tests/integration/cli.test.ts
describe('CLI Integration', () => {
  test('reserve and release flow', async () => {
    const { stdout: reserve } = await runCLI('reserve 3000 -n test');
    expect(reserve).toContain('reserved');
    
    const { stdout: release } = await runCLI('release 3000');
    expect(release).toContain('released');
  });
});
```

## 📦 Build System

### TypeScript Compilation
- Separate configs for CLI and GUI
- Source maps for debugging
- Declaration files for types

### Electron Build
```javascript
// electron.vite.config.ts
export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        external: ['electron', 'better-sqlite3']
      }
    }
  },
  preload: {
    build: {
      rollupOptions: {
        external: ['electron']
      }
    }
  },
  renderer: {
    build: {
      rollupOptions: {
        input: 'src/gui/renderer/index.html'
      }
    }
  }
});
```

## 🔮 Future Architecture

### Planned Enhancements

1. **Microservices Support**
   - Service discovery integration
   - Dynamic port allocation
   - Health checking

2. **Cloud Integration**
   - Remote port management
   - Team synchronization
   - Cloud database support

3. **API Server Mode**
   - REST API
   - WebSocket support
   - GraphQL endpoint

4. **Plugin System**
   - Custom commands
   - UI extensions
   - Integration hooks

---

For implementation details, see the [source code](https://github.com/ahmadzein/portkeeper) or [Contributing Guide](Contributing).