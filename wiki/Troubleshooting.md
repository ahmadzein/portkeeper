# Troubleshooting Guide

Common issues and solutions for Port Keeper.

## 🚨 Installation Issues

### NODE_MODULE_VERSION Error

**Error:**
```
Error: The module '...better-sqlite3.node' was compiled against a different Node.js version using NODE_MODULE_VERSION 119. This version of Node.js requires NODE_MODULE_VERSION 108.
```

**Solution:**
```bash
npm rebuild -g better-sqlite3
```

This rebuilds the native module for your Node.js version.

### Permission Denied (EACCES)

**Error:**
```
npm ERR! code EACCES
npm ERR! syscall access
npm ERR! path /usr/local/lib/node_modules
```

**Solutions:**

1. **Use Node Version Manager (recommended):**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install node
   npm install -g portkeeper
   ```

2. **Change npm prefix:**
   ```bash
   mkdir ~/.npm-global
   npm config set prefix ~/.npm-global
   export PATH=~/.npm-global/bin:$PATH
   npm install -g portkeeper
   ```

### Module Not Found

**Error:**
```
Error: Cannot find module 'portkeeper'
```

**Solutions:**
1. Verify installation: `npm list -g portkeeper`
2. Check PATH: `echo $PATH`
3. Reinstall: `npm install -g portkeeper@latest`

## 🖥️ GUI Issues

### GUI Won't Launch

**Error:**
```
Error: Cannot find Electron. Please install with: npm install -g portkeeper --include=optional
```

**Solution:**
```bash
npm install -g portkeeper --include=optional
```

### Blank Window

**Causes & Solutions:**

1. **GPU Issues:**
   ```bash
   portman gui --disable-gpu
   ```

2. **Cache Corruption:**
   ```bash
   # macOS/Linux
   rm -rf ~/.config/portkeeper
   
   # Windows
   rmdir /s "%APPDATA%\portkeeper"
   ```

3. **Debug Mode:**
   ```bash
   portman gui --dev
   ```

### GUI Crashes on Startup

1. Check logs:
   ```bash
   # macOS
   ~/Library/Logs/portkeeper/main.log
   
   # Linux
   ~/.config/portkeeper/logs/main.log
   
   # Windows
   %APPDATA%\portkeeper\logs\main.log
   ```

2. Reset settings:
   ```bash
   # Remove config file
   rm ~/.portkeeper/config.json
   ```

## 📊 Database Issues

### Database Locked

**Error:**
```
Error: SQLITE_BUSY: database is locked
```

**Solutions:**

1. Close other Port Keeper instances
2. Check for stuck processes:
   ```bash
   ps aux | grep portman
   killall portman
   ```

3. Remove lock file:
   ```bash
   rm ~/.portkeeper/database.db-wal
   rm ~/.portkeeper/database.db-shm
   ```

### Database Corruption

**Error:**
```
Error: SQLITE_CORRUPT: database disk image is malformed
```

**Solution:**

1. Backup corrupted database:
   ```bash
   cp ~/.portkeeper/database.db ~/.portkeeper/database.db.backup
   ```

2. Remove and recreate:
   ```bash
   rm ~/.portkeeper/database.db
   portman list  # Creates new database
   ```

### Migration Errors

**Error:**
```
Error: Database schema mismatch
```

**Solution:**
Export data, remove database, reimport:
```bash
portman export backup.json
rm ~/.portkeeper/database.db
portman import backup.json
```

## 🔌 Port Management Issues

### Port Already in Use

**Error:**
```
Error: Port 3000 is already in use by process 'node' (PID: 12345)
```

**Solutions:**

1. Kill the process:
   ```bash
   portman kill 3000
   ```

2. Force kill:
   ```bash
   portman kill 3000 --force
   ```

3. Manual kill:
   ```bash
   # Find process
   lsof -i :3000
   
   # Kill process
   kill -9 <PID>
   ```

### Can't Reserve Port

**Common Causes:**

1. **Port already reserved:**
   ```bash
   portman check 3000
   portman release 3000
   portman reserve 3000 -n "my-app"
   ```

2. **Invalid port range:**
   - Ports must be 1-65535
   - Ports below 1024 may require sudo

3. **Database permissions:**
   ```bash
   chmod 644 ~/.portkeeper/database.db
   ```

### Scan Not Showing All Ports

**Platform-Specific Issues:**

**macOS:**
```bash
# May need to use sudo for system ports
sudo portman scan
```

**Linux:**
```bash
# Ensure ss is installed
which ss || sudo apt-get install iproute2
```

**Windows:**
```bash
# Run as Administrator for full access
# Right-click Terminal > Run as Administrator
portman scan
```

## 🐛 CLI Issues

### Command Not Found

**Error:**
```
bash: portman: command not found
```

**Solutions:**

1. Check installation:
   ```bash
   npm list -g portkeeper
   ```

2. Find npm bin directory:
   ```bash
   npm bin -g
   ```

3. Add to PATH:
   ```bash
   export PATH=$(npm bin -g):$PATH
   ```

### JSON Output Errors

**Error:**
```
SyntaxError: Unexpected token < in JSON
```

**Causes:**
- Error output mixed with JSON
- HTML error pages (proxy issues)

**Solution:**
```bash
# Redirect stderr
portman list --json 2>/dev/null

# Check for errors separately
portman list --json 2>&1 | jq . || echo "JSON parse failed"
```

## 🔧 Performance Issues

### Slow Port Scanning

**Optimize scan range:**
```bash
# Scan common development range only
portman scan --range 3000-9000
```

**Disable DNS resolution:**
```bash
portman scan --no-dns
```

### GUI Lag

1. **Reduce refresh rate:**
   - Settings > Performance > Refresh Interval

2. **Limit displayed ports:**
   - Use filters to show only relevant ports

3. **Disable animations:**
   - Settings > Appearance > Disable animations

## 🌐 Network Issues

### Behind Corporate Proxy

**Configure npm proxy:**
```bash
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

**For GUI:**
```bash
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
portman gui
```

### Firewall Blocking

Common firewall issues:
- Port scanning blocked
- GUI update checks blocked

**Solutions:**
1. Add Port Keeper to firewall exceptions
2. Disable auto-update checks in GUI
3. Use offline mode

## 📝 Logging and Debug

### Enable Debug Logging

**CLI:**
```bash
DEBUG=portkeeper:* portman list
```

**GUI:**
```bash
ELECTRON_ENABLE_LOGGING=1 portman gui
```

### Log Locations

**macOS:**
- CLI: `~/.portkeeper/logs/`
- GUI: `~/Library/Logs/portkeeper/`

**Linux:**
- CLI: `~/.portkeeper/logs/`
- GUI: `~/.config/portkeeper/logs/`

**Windows:**
- CLI: `%USERPROFILE%\.portkeeper\logs\`
- GUI: `%APPDATA%\portkeeper\logs\`

### Verbose Output

```bash
# Maximum verbosity
portman list -vvv

# With timestamps
portman scan --verbose --timestamps
```

## 🆘 Getting Help

### Collect Diagnostic Info

```bash
# System info
portman --version
node --version
npm --version
uname -a  # or 'ver' on Windows

# Port Keeper info
portman list --json
ls -la ~/.portkeeper/

# Error logs
tail -50 ~/.portkeeper/logs/error.log
```

### Report Issues

1. Check existing issues: [GitHub Issues](https://github.com/ahmadzein/portkeeper/issues)
2. Create detailed report with:
   - Error messages
   - Steps to reproduce
   - System information
   - Log files

### Community Support

- GitHub Discussions: [Join community](https://github.com/ahmadzein/portkeeper/discussions)
- Stack Overflow: Tag with `portkeeper`

## 🔄 Recovery Procedures

### Complete Reset

```bash
# Backup data
portman export backup.json

# Remove all Port Keeper data
rm -rf ~/.portkeeper
rm -rf ~/.config/portkeeper  # GUI config

# Reinstall
npm uninstall -g portkeeper
npm install -g portkeeper

# Restore data
portman import backup.json
```

### Emergency Port Release

When Port Keeper won't start:

```bash
# Direct database access
sqlite3 ~/.portkeeper/database.db "UPDATE ports SET status='free' WHERE status='reserved';"

# Or remove database
rm ~/.portkeeper/database.db
```

---

Still need help? [Open an issue](https://github.com/ahmadzein/portkeeper/issues) with diagnostic information.