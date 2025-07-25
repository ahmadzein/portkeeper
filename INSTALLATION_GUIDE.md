# 🚀 Port Manager - Installation & Usage Guide

## 📦 Installation Methods

### Method 1: Using npm (Recommended) ✅
```bash
# Install globally
npm install -g portmanager

# Verify installation
portman --version
```

### Method 2: Using Homebrew (macOS) - Coming Tuesday
```bash
# Will be available after launch
brew tap yourusername/portmanager
brew install portmanager
```

### Method 3: Download Binary
- Go to [Releases](https://github.com/yourusername/portmanager/releases)
- Download for your platform:
  - macOS: `portmanager-mac.dmg`
  - Windows: `portmanager-win.exe`
  - Linux: `portmanager-linux.AppImage`

### Method 4: Build from Source
```bash
git clone https://github.com/yourusername/portmanager.git
cd portmanager
npm install
npm run build
npm link
```

---

## 🎯 CLI Quick Start

### Basic Commands
```bash
# Check if port 3000 is available
portman check 3000

# Reserve port 3000 for your project
portman reserve 3000 --name "my-app" --desc "React development server"

# List all ports
portman list

# Release a port
portman release 3000

# Kill process on port 3000
portman kill 3000
```

### Advanced Commands
```bash
# Scan all active ports
portman scan

# Filter ports by status
portman list --status reserved

# Export configuration
portman export > my-ports.json

# Import configuration
portman import < my-ports.json

# Get help
portman --help
```

---

## 🖥️ GUI Usage

### Launch GUI
```bash
# From terminal
portman gui
```

### GUI Features
- **Dashboard**: View all ports in a table
- **Search**: Find ports by number or project name
- **Quick Actions**: Click buttons to release/kill
- **Dark Mode**: Toggle in header
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + R`: Refresh
  - `Ctrl/Cmd + N`: New reservation
  - `Ctrl/Cmd + F`: Focus search
  - `Shift + ?`: Show help

---

## 💡 Common Use Cases

### Web Development
```bash
# Reserve common web ports
portman reserve 3000 --name "frontend" --desc "React app"
portman reserve 8080 --name "backend" --desc "API server"
portman reserve 5432 --name "database" --desc "PostgreSQL"

# Check what's running
portman list
```

### Team Collaboration
```bash
# Export your port configuration
portman export > team-ports.json

# Share with team, they import
portman import < team-ports.json
```

### Cleanup
```bash
# Find and kill processes
portman scan
portman kill 3000 3001 8080

# Release all reserved ports
portman list --status reserved
portman release 3000 3001 8080
```

---

## 🔧 Troubleshooting

### Port Manager not found
```bash
# Check npm global install location
npm config get prefix

# Add to PATH if needed
export PATH=$PATH:$(npm config get prefix)/bin
```

### Permission denied
```bash
# For system ports (< 1024)
sudo portman reserve 80 --name "web-server"
```

### GUI won't start
```bash
# Check if another instance is running
ps aux | grep portman
# Kill if needed
pkill -f portman
```

---

## ✨ Pro Tips

1. **Auto-complete**: Add to your shell
   ```bash
   echo 'source <(portman completion bash)' >> ~/.bashrc
   ```

2. **Aliases**: Speed up common tasks
   ```bash
   alias pm='portman'
   alias pmc='portman check'
   alias pml='portman list'
   ```

3. **Integration**: Use in package.json
   ```json
   {
     "scripts": {
       "predev": "portman check 3000 || portman kill 3000",
       "dev": "portman reserve 3000 --name 'my-app' && npm start"
     }
   }
   ```

---

## 📺 Video Tutorial
Watch the [5-minute quick start video](https://youtube.com/portmanager-quickstart)

## 📚 Full Documentation
Visit [docs.portmanager.dev](https://docs.portmanager.dev)

## 🆘 Get Help
- GitHub Issues: [Report bugs](https://github.com/yourusername/portmanager/issues)
- Discord: [Join community](https://discord.gg/portmanager)
- Email: support@portmanager.dev

---

**Happy port managing!** 🎉