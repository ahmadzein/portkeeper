# Configuration

Port Keeper configuration options and customization.

## 📁 Configuration Files

### Default Locations

Port Keeper stores configuration in platform-specific locations:

**macOS/Linux:**
```
~/.portkeeper/
├── config.json      # User configuration
├── database.db      # Port database
└── logs/           # Application logs
```

**Windows:**
```
%USERPROFILE%\.portkeeper\
├── config.json
├── database.db
└── logs\
```

## ⚙️ Configuration Options

### config.json Structure

```json
{
  "version": "1.0.0",
  "database": {
    "path": "~/.portkeeper/database.db",
    "backupEnabled": true,
    "backupInterval": 86400000,
    "backupCount": 7
  },
  "cli": {
    "defaultFormat": "table",
    "colorEnabled": true,
    "pageSize": 20,
    "confirmDangerousActions": true
  },
  "gui": {
    "theme": "system",
    "refreshInterval": 5000,
    "showNotifications": true,
    "minimizeToTray": false,
    "startMinimized": false
  },
  "ports": {
    "defaultRange": {
      "start": 3000,
      "end": 9999
    },
    "scanTimeout": 5000,
    "reservationTimeout": 0
  },
  "logging": {
    "level": "info",
    "maxFiles": 5,
    "maxSize": "10m"
  }
}
```

## 🎨 CLI Configuration

### Environment Variables

```bash
# Override config file location
export PORTKEEPER_CONFIG_PATH=/custom/path/config.json

# Override database location
export PORTKEEPER_DB_PATH=/custom/path/database.db

# Set log level
export PORTKEEPER_LOG_LEVEL=debug

# Disable colors
export NO_COLOR=1

# Custom port range
export PORTKEEPER_PORT_RANGE=3000-9000
```

### Command Aliases

Add to your shell configuration:

```bash
# ~/.bashrc or ~/.zshrc

# Short aliases
alias pm='portman'
alias pmc='portman check'
alias pmr='portman reserve'
alias pml='portman list'
alias pmk='portman kill'
alias pms='portman scan'

# Common workflows
alias pmdev='portman list -s in-use -t development'
alias pmfree='portman list -s free'
alias pmclean='portman list -s reserved --json | jq -r ".data[] | select(.reservedAt | fromdateiso8601 < (now - 2592000)) | .number" | xargs portman release'

# Project-specific
alias pmproject='portman list -p $(basename $PWD)'
```

### Shell Completion

#### Bash
```bash
# Add to ~/.bashrc
eval "$(portman completion bash)"
```

#### Zsh
```bash
# Add to ~/.zshrc
eval "$(portman completion zsh)"
```

#### Fish
```bash
# Add to ~/.config/fish/config.fish
portman completion fish | source
```

## 🖥️ GUI Configuration

### Theme Settings

```json
{
  "gui": {
    "theme": "dark",        // "light", "dark", "system"
    "accentColor": "#667eea",
    "fontSize": "medium",   // "small", "medium", "large"
    "density": "normal"     // "compact", "normal", "comfortable"
  }
}
```

### Window Settings

```json
{
  "gui": {
    "window": {
      "width": 1200,
      "height": 800,
      "x": 100,
      "y": 100,
      "maximized": false,
      "fullscreen": false
    }
  }
}
```

### Notification Settings

```json
{
  "gui": {
    "notifications": {
      "enabled": true,
      "types": {
        "portReserved": true,
        "portReleased": true,
        "portConflict": true,
        "processKilled": true,
        "errors": true
      },
      "sound": true,
      "duration": 5000
    }
  }
}
```

## 🔧 Advanced Configuration

### Custom Port Ranges

Define project-specific port ranges:

```json
{
  "ports": {
    "ranges": {
      "frontend": {
        "start": 3000,
        "end": 3999,
        "description": "Frontend applications"
      },
      "backend": {
        "start": 4000,
        "end": 4999,
        "description": "Backend services"
      },
      "databases": {
        "start": 5000,
        "end": 5999,
        "description": "Database servers"
      }
    }
  }
}
```

### Scan Configuration

```json
{
  "scan": {
    "excludePorts": [22, 80, 443],
    "excludeProcesses": ["systemd", "kernel"],
    "includeSystemPorts": false,
    "timeout": 5000,
    "parallel": true,
    "maxConcurrent": 100
  }
}
```

### Database Settings

```json
{
  "database": {
    "type": "sqlite",
    "path": "~/.portkeeper/database.db",
    "options": {
      "wal": true,
      "synchronous": "NORMAL",
      "journal_mode": "WAL",
      "cache_size": -2000
    },
    "migrations": {
      "auto": true,
      "backup": true
    }
  }
}
```

## 🎯 Per-Project Configuration

### Project .portkeeper File

Create `.portkeeper` in your project root:

```json
{
  "project": "my-app",
  "ports": {
    "required": [
      {
        "number": 3000,
        "name": "frontend",
        "description": "React development server"
      },
      {
        "number": 8080,
        "name": "api",
        "description": "Express API server"
      }
    ],
    "optional": [
      {
        "number": 9229,
        "name": "debug",
        "description": "Node.js debugger"
      }
    ]
  },
  "tags": ["react", "nodejs", "development"],
  "autoReserve": true,
  "releaseOnExit": false
}
```

### NPM Scripts Integration

```json
{
  "scripts": {
    "predev": "portman import .portkeeper",
    "dev": "concurrently \"npm:dev:*\"",
    "postdev": "portman release $(portman list -p my-app --json | jq -r '.data[].number' | tr '\\n' ' ')"
  }
}
```

## 📊 Logging Configuration

### Log Levels

```json
{
  "logging": {
    "level": "info",  // "error", "warn", "info", "debug", "trace"
    "targets": {
      "console": {
        "enabled": true,
        "level": "info",
        "format": "pretty"  // "pretty", "json", "simple"
      },
      "file": {
        "enabled": true,
        "level": "debug",
        "path": "~/.portkeeper/logs/app.log",
        "rotation": {
          "maxSize": "10m",
          "maxFiles": 5,
          "compress": true
        }
      }
    }
  }
}
```

### Debug Mode

Enable detailed debugging:

```bash
# CLI debug mode
DEBUG=portkeeper:* portman list

# GUI debug mode
ELECTRON_ENABLE_LOGGING=1 portman gui --dev

# Specific modules
DEBUG=portkeeper:db portman scan
DEBUG=portkeeper:cli:* portman reserve 3000 -n test
```

## 🔒 Security Configuration

### Access Control

```json
{
  "security": {
    "requireConfirmation": {
      "release": true,
      "kill": true,
      "import": true
    },
    "allowedPortRanges": [
      "1024-65535"
    ],
    "blockedPorts": [
      22, 80, 443, 3306, 5432
    ]
  }
}
```

### Audit Logging

```json
{
  "audit": {
    "enabled": true,
    "events": [
      "port.reserved",
      "port.released",
      "process.killed",
      "config.changed",
      "database.exported",
      "database.imported"
    ],
    "output": "~/.portkeeper/audit.log"
  }
}
```

## 🚀 Performance Tuning

### CLI Performance

```json
{
  "performance": {
    "cli": {
      "lazyLoad": true,
      "cacheTimeout": 5000,
      "batchOperations": true,
      "maxBatchSize": 100
    }
  }
}
```

### GUI Performance

```json
{
  "performance": {
    "gui": {
      "hardwareAcceleration": true,
      "animationsEnabled": true,
      "virtualScrolling": true,
      "maxVisiblePorts": 100,
      "debounceSearch": 300
    }
  }
}
```

## 🔄 Import/Export Configuration

### Export Current Config

```bash
# Export to file
portman config export > my-config.json

# Export specific sections
portman config export --section cli
portman config export --section gui
```

### Import Configuration

```bash
# Import full config
portman config import my-config.json

# Import and merge
portman config import my-config.json --merge

# Validate before import
portman config validate my-config.json
```

## 🎨 Custom Themes

### Create Custom Theme

```json
{
  "themes": {
    "custom-dark": {
      "extends": "dark",
      "colors": {
        "primary": "#667eea",
        "secondary": "#764abc",
        "background": "#1a1a2e",
        "surface": "#16213e",
        "text": "#eee",
        "textSecondary": "#aaa",
        "success": "#22c55e",
        "warning": "#f59e0b",
        "error": "#ef4444"
      }
    }
  }
}
```

## 📝 Configuration Best Practices

1. **Version Control**: Keep config in your dotfiles repository
2. **Environment-Specific**: Use different configs for dev/staging/prod
3. **Team Standards**: Share common configuration
4. **Regular Backups**: Export configuration regularly
5. **Document Changes**: Comment your configuration
6. **Validate Changes**: Test configuration before deploying
7. **Security First**: Don't store sensitive data in config

## 🔧 Troubleshooting Config Issues

### Reset to Defaults

```bash
# Backup current config
cp ~/.portkeeper/config.json ~/.portkeeper/config.json.backup

# Reset to defaults
portman config reset

# Or remove config file
rm ~/.portkeeper/config.json
```

### Validate Configuration

```bash
# Check for errors
portman config validate

# View current config
portman config show

# Get specific value
portman config get cli.defaultFormat
```

### Common Issues

1. **Invalid JSON**: Use a JSON validator
2. **Permission Errors**: Check file permissions
3. **Path Issues**: Use absolute paths
4. **Missing Config**: Port Keeper creates default config

---

Need help? Check the [Troubleshooting Guide](Troubleshooting) or [open an issue](https://github.com/ahmadzein/portkeeper/issues).