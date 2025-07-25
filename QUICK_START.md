# 🚀 Port Manager - Quick Start Guide

## Installation from GitHub

```bash
# Clone the repository
git clone https://github.com/ahmadzein/portmanager.git
cd portmanager

# Install dependencies
npm install

# Build the project
npm run build

# Link CLI globally
npm link

# Verify installation
portman --version
```

## Basic CLI Usage

```bash
# Check if port 3000 is available
portman check 3000

# Reserve a port
portman reserve 3000 --name "my-project" --desc "React dev server"

# List all ports
portman list

# Release a port
portman release 3000

# Kill process on a port
portman kill 3000

# Scan for active ports
portman scan

# Export configuration
portman export > ports.json

# Import configuration
portman import < ports.json
```

## Launch GUI

```bash
# Start the GUI application
portman gui
```

## GUI Features
- Visual port dashboard
- Search and filter ports
- Reserve/release with one click
- Dark/light theme (toggle in header)
- Real-time updates every 5 seconds

## Keyboard Shortcuts (GUI)
- `Ctrl/Cmd + R` - Refresh ports
- `Ctrl/Cmd + N` - New reservation
- `Ctrl/Cmd + F` - Focus search
- `Shift + ?` - Show help

## Troubleshooting

### Build Issues
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Permission Issues
```bash
# For system ports < 1024
sudo portman reserve 80 --name "webserver"
```

### GUI Not Starting
```bash
# Check for errors
portman gui --verbose

# Kill any existing processes
pkill -f portman
```

## Development

```bash
# Run CLI in dev mode
npm run dev:cli

# Run GUI in dev mode
npm run dev:gui

# Run tests
npm test

# Build installers
npm run dist
```

## Project Status
- ✅ CLI fully functional
- ✅ GUI complete with all features
- ✅ Cross-platform support
- ✅ Documentation complete
- 🔄 npm package pending publication

---

**Note**: This is currently installed from source. npm package will be available soon as `npm install -g portmanager`