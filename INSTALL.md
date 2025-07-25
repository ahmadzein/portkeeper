# Installation Guide

## Quick Install (macOS/Linux)

```bash
curl -fsSL https://raw.githubusercontent.com/ahmadzein/portmanager/main/install.sh | bash
```

## Manual Installation

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/ahmadzein/portmanager.git
   cd portmanager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Link globally**
   ```bash
   npm link
   ```

5. **Verify installation**
   ```bash
   portman --version
   ```

## Usage

### CLI
```bash
# Check port status
portman check 3000

# Reserve a port
portman reserve 8080 -n "my-app" -d "Development server"

# List all ports
portman list

# Release a port
portman release 8080

# Kill process on port
portman kill 3000
```

### GUI
```bash
# Launch the GUI (not implemented yet)
portman gui
```

## Troubleshooting

### Command not found
If you get "command not found: portman", ensure that npm's global bin directory is in your PATH:
```bash
echo 'export PATH="$PATH:$(npm config get prefix)/bin"' >> ~/.bashrc
source ~/.bashrc
```

### Permission errors
If you encounter permission errors during `npm link`, you might need to configure npm to use a different directory for global packages:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

### Build errors
If the build fails, ensure you have all required dependencies:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Uninstallation

To uninstall Port Manager:
```bash
npm unlink -g portmanager
```

## Support

For issues or questions, please visit:
https://github.com/ahmadzein/portmanager/issues