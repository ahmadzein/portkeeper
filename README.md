# Port Manager 🚀

A comprehensive port management tool for developers that helps reserve, monitor, and manage local development ports through both CLI and GUI interfaces.

## Features

### CLI Features
- 🔍 **Check Port Status**: Quickly check if a port is reserved or in use
- 📌 **Reserve Ports**: Reserve ports for specific projects
- 📋 **List All Ports**: View all ports with their current status
- 🔓 **Release Ports**: Free up reserved ports
- ⚡ **Kill Processes**: Terminate processes using specific ports
- 🔎 **Auto-scan**: Automatically detect ports in use

### GUI Features
- 📊 **Visual Dashboard**: See all ports at a glance
- 🔍 **Search & Filter**: Find ports quickly
- 🎯 **Quick Actions**: Manage ports with one click
- 🎨 **Themes**: Dark and light mode support
- ⌨️ **Keyboard Shortcuts**: Power user efficiency

## Installation

### From Source (Currently Available)
```bash
# Clone the repository
git clone https://github.com/ahmadzein/portmanager.git
cd portmanager
npm install
npm run build
npm link

# Verify installation
portman --version
```

### Via npm (Coming Soon)
```bash
# Will be available after npm publish
npm install -g portmanager
```

### Download Binary (Coming Soon)
Binaries will be available from the [releases page](https://github.com/ahmadzein/portmanager/releases) after first release.

## CLI Usage

### Check if a port is in use
```bash
portman check 3000
```

### Reserve a port
```bash
portman reserve 3000 --name "my-project" --desc "React dev server"
```

### List all ports
```bash
portman list
```

### Release a port
```bash
portman release 3000
```

### Kill process using a port
```bash
portman kill 3000
```

### Multiple operations
```bash
portman release 3000 3001 3002
portman kill 8080 8081
```

## GUI Usage

Launch the GUI application:
```bash
portman gui
```

Or use the desktop application directly after installation.

## Development

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/portmanager.git
cd portmanager

# Install dependencies
npm install

# Run CLI in development
npm run dev:cli

# Run GUI in development
npm run dev:gui

# Run tests
npm test

# Build for production
npm run build
```

## Architecture

Port Manager follows a layered architecture with shared core functionality between CLI and GUI:

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

- 📧 Email: support@portmanager.dev
- 💬 Discord: [Join our community](https://discord.gg/portmanager)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/portmanager/issues)

---

**Port Manager** - Never worry about port conflicts again! 🎉