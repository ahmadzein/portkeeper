# Port Keeper 🚀

A comprehensive port management tool for developers that helps reserve, monitor, and manage local development ports through both CLI and GUI interfaces.

🌐 **Website**: [portkeeper.net](https://portkeeper.net) | [portkeeper.dev](https://portkeeper.dev)
📦 **npm**: [portkeeper](https://www.npmjs.com/package/portkeeper)
🐙 **GitHub**: [ahmadzein/portkeeper](https://github.com/ahmadzein/portkeeper)

## Features

### CLI Features
- 🔍 **Check Port Status**: Quickly check if a port is reserved or in use
- 📌 **Reserve Ports**: Reserve ports for specific projects with tags and descriptions
- 📋 **List All Ports**: View all reserved ports with filtering options
- 🔓 **Release Ports**: Free up reserved ports (supports bulk operations)
- ⚡ **Kill Processes**: Terminate processes using specific ports
- 🔎 **Scan Active Ports**: Detect all ports currently in use
- 🎯 **Request Multiple Ports**: Automatically find and reserve multiple available ports
- 📤 **Export/Import**: Share port configurations with your team

### GUI Features
- 📊 **Visual Dashboard**: See all reserved ports with rich details
- 🔍 **Enhanced Scan View**: View active ports with reservation information
- 🎯 **Quick Actions**: Reserve, release, and kill processes with one click
- 🔎 **Smart Search**: Search across ports, processes, projects, and descriptions
- 🎨 **Themes**: Dark and light mode support
- ⌨️ **Keyboard Shortcuts**: Complete keyboard navigation
- 💾 **Data Management**: Export/import port configurations
- 🔄 **Real-time Updates**: Live scanning and status updates

## Installation

### Important: Node.js Compatibility

If you encounter a `NODE_MODULE_VERSION` error after installation, please run:

```bash
npm rebuild -g better-sqlite3
```

This rebuilds the native module for your specific Node.js version.

### Via npm
```bash
# CLI only (lightweight)
npm install -g portkeeper

# CLI + GUI (includes Electron)
npm install -g portkeeper --include=optional

# Verify installation
portman --version
```

### From Source
```bash
# Clone the repository
git clone https://github.com/ahmadzein/portkeeper.git
cd portkeeper
npm install
npm run build
npm link
```

### GUI Application
The GUI is included with Port Keeper:

```bash
# Launch the GUI (requires --include=optional during install)
portman gui

# If GUI not found, install with:
npm install -g portkeeper --include=optional
```

Note: The GUI requires Electron (~100MB). Install with `--include=optional` to get GUI support.

## Quick Start

### CLI Usage

```bash
# Check if a port is available
portman check 3000

# Reserve a port for your project
portman reserve 3000 --name "my-app" --desc "React dev server" --tags frontend react

# Request multiple ports automatically
portman request 5 --name "microservices" --sequential

# List all reserved ports
portman list

# Scan for active ports with reservation info
portman scan --reserved

# Release ports when done
portman release 3000 3001 3002

# Kill a process using a port
portman kill 8080

# Export your team's port configuration
portman export team-ports.json
```

### GUI Usage

```bash
# Launch the GUI application
portman gui
```

In the GUI:
- **Dashboard**: Manage all your reserved ports
- **Scan View**: See active ports with reservation details
- **Quick Actions**: Reserve, release, or kill processes with one click
- **Keyboard Shortcuts**: Press `?` to see all shortcuts

## Documentation

- 📖 [CLI Command Reference](docs/CLI_COMMAND_REFERENCE.md) - Detailed CLI documentation with examples
- 🖥️ [GUI User Guide](docs/GUI_USER_GUIDE.md) - Complete GUI walkthrough
- 🏗️ [Technical Architecture](TECHNICAL_ARCHITECTURE.md) - System design and structure
- 📋 [Feature Parity Matrix](docs/FEATURE_PARITY_MATRIX.md) - CLI/GUI feature comparison

## Development

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn
- SQLite3

### Setup
```bash
# Clone the repository
git clone https://github.com/ahmadzein/portkeeper.git
cd portkeeper

# Install dependencies
npm install

# Build the project
npm run build

# Run CLI in development
npm run dev:cli

# Run GUI in development
npm run dev:gui

# Run tests
npm test

# Link for global CLI usage
npm link
```

## Architecture

Port Keeper follows a layered architecture with shared core functionality between CLI and GUI:

- **Core Layer**: Business logic, models, and services
- **Data Layer**: SQLite database for persistence
- **CLI Layer**: Commander.js based command-line interface
- **GUI Layer**: Electron + React desktop application

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with ❤️ by developers, for developers
- Special thanks to all contributors
- Inspired by the need for better port management in modern development

## Support

- 🌐 Website: [portkeeper.net](https://portkeeper.net)
- 📦 npm: [npmjs.com/package/portkeeper](https://www.npmjs.com/package/portkeeper)
- 🐛 Issues: [GitHub Issues](https://github.com/ahmadzein/portkeeper/issues)

---

**Port Keeper** - Never worry about port conflicts again! 🎉