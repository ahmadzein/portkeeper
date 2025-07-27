# Welcome to Port Keeper Wiki 🚀

Port Keeper is a comprehensive port management tool for developers that helps reserve, monitor, and manage local development ports through both CLI and GUI interfaces.

## 🌟 Key Features

- **Port Reservation System**: Reserve ports for specific projects to prevent conflicts
- **Process Management**: Kill processes occupying ports with a single command
- **Active Port Scanning**: Detect all ports currently in use with process information
- **Multi-Port Requests**: Automatically find and reserve multiple available ports
- **Export/Import**: Share port configurations with your team
- **Cross-Platform**: Works on macOS, Linux, and Windows
- **GUI Interface**: Visual dashboard for managing ports (optional)
- **AI Integration**: Built-in documentation for AI agents and automation

## 🚀 Quick Links

- [Installation Guide](Installation) - Get started with Port Keeper
- [CLI Reference](CLI-Reference) - Complete command documentation
- [GUI User Guide](GUI-Guide) - Visual interface documentation
- [API Documentation](API-Documentation) - Integration and automation
- [Troubleshooting](Troubleshooting) - Common issues and solutions
- [Best Practices](Best-Practices) - Tips for effective port management

## 📦 Installation

```bash
# Install globally via npm
npm install -g portkeeper

# If you encounter NODE_MODULE_VERSION error:
npm rebuild -g better-sqlite3
```

## 🎯 Quick Start

### Check if a port is available
```bash
portman check 3000
```

### Reserve a port for your project
```bash
portman reserve 3000 --name "my-app" --desc "React dev server"
```

### List all managed ports
```bash
portman list
```

### Launch the GUI
```bash
portman gui
```

## 🤝 Community

- **GitHub**: [ahmadzein/portkeeper](https://github.com/ahmadzein/portkeeper)
- **npm**: [portkeeper](https://www.npmjs.com/package/portkeeper)
- **Website**: [portkeeper.net](https://portkeeper.net) | [portkeeper.dev](https://portkeeper.dev)
- **Issues**: [Report bugs](https://github.com/ahmadzein/portkeeper/issues)
- **Discussions**: [Join the conversation](https://github.com/ahmadzein/portkeeper/discussions)

## 📚 Documentation Structure

### Getting Started
- [Installation](Installation) - Installation methods and requirements
- [Quick Start Guide](Quick-Start) - Get up and running in minutes
- [Configuration](Configuration) - Customize Port Keeper settings

### CLI Documentation
- [CLI Reference](CLI-Reference) - All commands and options
- [CLI Examples](CLI-Examples) - Real-world usage examples
- [Shell Integration](Shell-Integration) - Aliases and completions

### GUI Documentation
- [GUI User Guide](GUI-Guide) - Complete visual interface guide
- [Keyboard Shortcuts](Keyboard-Shortcuts) - Productivity shortcuts
- [Themes and Customization](Themes) - Personalize your experience

### Advanced Topics
- [API Documentation](API-Documentation) - Programmatic usage
- [AI Integration Guide](AI-Integration) - Automation with AI agents
- [Team Collaboration](Team-Collaboration) - Sharing configurations
- [Database Schema](Database-Schema) - Understanding data storage

### Development
- [Contributing](Contributing) - How to contribute
- [Architecture](Architecture) - System design and structure
- [Building from Source](Building) - Development setup

## 💡 Why Port Keeper?

Managing ports during development can be challenging:
- **Port Conflicts**: Multiple projects competing for the same ports
- **Team Coordination**: Different developers using different ports
- **Process Management**: Orphaned processes blocking ports
- **Documentation**: No central record of port assignments

Port Keeper solves these problems by providing a centralized port management system with both CLI and GUI interfaces.

## 🛡️ License

Port Keeper is released under the MIT License. See [LICENSE](https://github.com/ahmadzein/portkeeper/blob/master/LICENSE) for details.

---

*Happy port managing! 🚢*