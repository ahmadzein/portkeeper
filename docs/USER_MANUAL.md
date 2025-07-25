# Port Manager User Manual

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Getting Started](#getting-started)
4. [CLI Usage](#cli-usage)
5. [GUI Usage](#gui-usage)
6. [Keyboard Shortcuts](#keyboard-shortcuts)
7. [Configuration](#configuration)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

---

## Introduction

Port Manager is a comprehensive tool for managing local development ports. It helps developers:
- Track which ports are in use or reserved
- Prevent port conflicts between projects
- Kill processes occupying specific ports
- Share port configurations with team members

### Key Features
- **Dual Interface**: Use CLI for quick tasks or GUI for visual management
- **Real-time Sync**: CLI and GUI share the same data
- **Cross-platform**: Works on Windows, macOS, and Linux
- **Smart Detection**: Automatically discovers ports in use
- **Dark Mode**: Easy on the eyes during late-night coding

---

## Installation

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager

### Install via npm (Recommended)
```bash
npm install -g portmanager
```

### Install from Source
```bash
git clone https://github.com/yourusername/portmanager.git
cd portmanager
npm install
npm run build
npm link
```

### Verify Installation
```bash
portman --version
```

---

## Getting Started

### Quick Start - CLI
```bash
# Check if port 3000 is available
portman check 3000

# Reserve port 3000 for your project
portman reserve 3000 --name "my-react-app"

# List all managed ports
portman list

# Release port when done
portman release 3000
```

### Quick Start - GUI
```bash
# Launch the GUI application
portman gui

# Or use the desktop shortcut after installation
```

---

## CLI Usage

### Check Port Status
```bash
portman check <port>

# Examples
portman check 3000
portman check 8080
```

**Output:**
- ✅ Green: Port is free
- 🟡 Yellow: Port is reserved
- ❌ Red: Port is in use

### Reserve a Port
```bash
portman reserve <port> [options]

# Options:
#   -n, --name <name>        Project name (required)
#   -d, --desc <desc>        Description (optional)
#   -t, --tags <tags...>     Tags for categorization
#   --auto-release           Auto-release when process stops

# Examples
portman reserve 3000 --name "frontend" --desc "React dev server"
portman reserve 5000 --name "api" --tags backend nodejs
portman reserve 8080 --name "proxy" --auto-release
```

### List Ports
```bash
portman list [options]

# Options:
#   -s, --status <status>    Filter by status (reserved/in-use/free)
#   -p, --project <name>     Filter by project name
#   -t, --tags <tags...>     Filter by tags
#   --json                   Output as JSON

# Examples
portman list
portman list --status reserved
portman list --project "my-app"
portman list --json > ports.json
```

### Release Ports
```bash
portman release <ports...>

# Examples
portman release 3000
portman release 3000 3001 3002
```

### Kill Processes
```bash
portman kill <ports...> [options]

# Options:
#   -f, --force              Skip confirmation

# Examples
portman kill 3000
portman kill 8080 8081 --force
```

### Scan Active Ports
```bash
portman scan [options]

# Options:
#   --range <range>          Port range (e.g., 3000-4000)
#   --json                   Output as JSON

# Examples
portman scan
portman scan --range 3000-4000
```

---

## GUI Usage

### Main Dashboard
The dashboard shows all your ports at a glance:
- **Port Number**: The network port
- **Project**: Associated project name
- **Status**: Current state (free/reserved/in-use)
- **PID**: Process ID if running
- **Actions**: Quick buttons for management

### Reserving a Port
1. Click the "Reserve Port" button or press `Ctrl/Cmd + N`
2. Fill in the form:
   - Port number (1-65535)
   - Project name
   - Optional description
   - Tags for organization
   - Auto-release option
3. Click "Reserve"

### Managing Ports
- **Release**: Click the release button to free a port
- **Kill Process**: Stop a process using a port (only for in-use ports)
- **Search**: Use the search box to find specific projects
- **Filter**: Filter by status using the dropdown

### Theme Switching
Toggle between light and dark themes using the switch in the header.

---

## Keyboard Shortcuts

### Global Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + R` | Refresh port list |
| `Ctrl/Cmd + N` | Open reserve port dialog |
| `Ctrl/Cmd + F` | Focus search box |
| `Shift + ?` | Show keyboard shortcuts |

### Table Navigation
| Shortcut | Action |
|----------|--------|
| `↑/↓` | Navigate rows |
| `Enter` | Open actions menu |
| `Delete` | Release selected port |

---

## Configuration

### Data Storage
Port Manager stores data in:
- **macOS/Linux**: `~/.portmanager/ports.db`
- **Windows**: `%USERPROFILE%\.portmanager\ports.db`

### Environment Variables
```bash
# Custom database location
export PORTMANAGER_DB_PATH=/custom/path/ports.db

# Disable auto-refresh in GUI
export PORTMANAGER_AUTO_REFRESH=false

# Set refresh interval (milliseconds)
export PORTMANAGER_REFRESH_INTERVAL=10000
```

### Import/Export Configuration
```bash
# Export current configuration
portman export > my-ports.json

# Import configuration
portman import < my-ports.json
```

---

## Troubleshooting

### Common Issues

#### "Permission denied" when killing process
- **Solution**: Some processes require elevated permissions
- **Fix**: Run with sudo (Linux/macOS) or as Administrator (Windows)

#### Port shows as "in-use" but no process found
- **Cause**: Process might have crashed without releasing port
- **Fix**: Restart your computer or use system tools to clear the port

#### GUI won't start
- **Check**: Ensure no other instance is running
- **Fix**: Kill any existing processes: `pkill -f portman`

#### Database errors
- **Fix**: Reset database
  ```bash
  rm ~/.portmanager/ports.db
  portman list  # This recreates the database
  ```

### Debug Mode
```bash
# Run with debug output
DEBUG=portman:* portman list

# GUI debug mode
DEBUG=portman:* portman gui
```

---

## FAQ

### Q: Can multiple users share the same port database?
A: Port Manager is designed for local development. For team sharing, use the export/import feature.

### Q: How do I update Port Manager?
A: Run `npm update -g portmanager` to get the latest version.

### Q: Can I reserve system ports (< 1024)?
A: Yes, but you'll need elevated permissions to actually use them.

### Q: Does Port Manager work with Docker?
A: Yes! It tracks both native and containerized processes.

### Q: Can I use Port Manager in CI/CD pipelines?
A: Yes, the CLI is perfect for automated workflows.

### Q: How do I contribute to Port Manager?
A: Visit our GitHub repository and check the CONTRIBUTING.md file.

---

## Support

- **GitHub Issues**: [Report bugs](https://github.com/yourusername/portmanager/issues)
- **Discord**: [Join our community](https://discord.gg/portmanager)
- **Email**: support@portmanager.dev

---

## License

Port Manager is released under the MIT License. See LICENSE file for details.

---

*Thank you for using Port Manager! Happy coding! 🚀*