# Installation Guide

Port Keeper can be installed in several ways depending on your needs. Choose the method that best suits your workflow.

## 📋 Requirements

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 7.0.0 or higher (comes with Node.js)
- **Operating System**: macOS, Linux, or Windows
- **Permissions**: Ability to install global npm packages

## 🚀 Installation Methods

### Method 1: npm Global Install (Recommended)

#### CLI Only (Lightweight)
If you only need the command-line interface:

```bash
npm install -g portkeeper
```

#### CLI + GUI (Full Installation)
To include the graphical user interface:

```bash
npm install -g portkeeper --include=optional
```

The `--include=optional` flag installs Electron (~100MB) for GUI support.

### Method 2: Install from Source

For development or customization:

```bash
# Clone the repository
git clone https://github.com/ahmadzein/portkeeper.git
cd portkeeper

# Install dependencies
npm install

# Build the project
npm run build

# Link globally
npm link
```

### Method 3: Local Project Installation

To use Port Keeper in a specific project:

```bash
# Install as dev dependency
npm install --save-dev portkeeper

# Run using npx
npx portman --help
```

## 🔧 Post-Installation

### Verify Installation

```bash
# Check version
portman --version

# View help
portman --help

# Test basic functionality
portman check 3000
```

### NODE_MODULE_VERSION Error

If you encounter an error like:
```
Error: The module '...better-sqlite3.node' was compiled against a different Node.js version
```

Run this command to rebuild the native module:
```bash
npm rebuild -g better-sqlite3
```

This rebuilds better-sqlite3 for your specific Node.js version.

## 🎨 GUI Installation

The GUI is optional and requires Electron. If you didn't install with `--include=optional`:

### Enable GUI After Installation

```bash
# Reinstall with optional dependencies
npm install -g portkeeper --include=optional

# Or if already installed, just run:
portman gui
```

The first time you run `portman gui`, it will guide you through installing Electron if needed.

### GUI System Requirements

- **Memory**: 512MB RAM minimum
- **Display**: 1024x768 resolution minimum
- **Graphics**: Basic GPU acceleration supported

## 🔄 Updating Port Keeper

### Update to Latest Version

```bash
# Check current version
portman --version

# Update to latest
npm update -g portkeeper

# Or reinstall
npm install -g portkeeper@latest
```

### Check for Updates

```bash
# View available versions
npm view portkeeper versions --json

# View latest version
npm view portkeeper version
```

## 🗑️ Uninstallation

### Remove Global Installation

```bash
# Uninstall portkeeper
npm uninstall -g portkeeper

# Clean npm cache (optional)
npm cache clean --force
```

### Remove Database and Settings

Port Keeper stores data in your home directory:

```bash
# macOS/Linux
rm -rf ~/.portkeeper

# Windows
rmdir /s "%USERPROFILE%\.portkeeper"
```

## 🐳 Docker Installation (Alternative)

For containerized environments:

```dockerfile
FROM node:18-alpine
RUN npm install -g portkeeper
CMD ["portman", "--help"]
```

## 🔍 Troubleshooting Installation

### Permission Errors

If you get EACCES errors:

```bash
# Option 1: Use npm's prefix
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH

# Option 2: Use Node Version Manager (nvm)
# Install nvm, then:
nvm install node
npm install -g portkeeper
```

### Proxy Configuration

Behind a corporate proxy:

```bash
# Set npm proxy
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Install
npm install -g portkeeper
```

### Verification Steps

After installation, verify everything works:

```bash
# 1. Check CLI
portman --version

# 2. Test database creation
portman list

# 3. Test port checking
portman check 3000

# 4. Test GUI (if installed)
portman gui --help
```

## 📦 Package Contents

The installation includes:

- **CLI Binary**: `portman` command
- **Core Library**: Port management logic
- **Database**: SQLite for port storage
- **GUI Files**: Electron app (optional)
- **Documentation**: Built-in help system

## 🚀 Next Steps

Now that Port Keeper is installed:

1. Read the [Quick Start Guide](Quick-Start)
2. Explore [CLI Commands](CLI-Reference)
3. Try the [GUI Interface](GUI-Guide)
4. Configure [Settings](Configuration)

## 💡 Tips

- Use `portman --help` for command help
- Add shell aliases for common operations
- Consider team-wide installation standards
- Regular updates ensure compatibility

---

Need help? Check our [Troubleshooting Guide](Troubleshooting) or [open an issue](https://github.com/ahmadzein/portkeeper/issues).