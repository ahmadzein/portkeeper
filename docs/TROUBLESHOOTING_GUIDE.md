# Troubleshooting Guide

## Table of Contents
- [Installation Issues](#installation-issues)
- [CLI Problems](#cli-problems)
- [GUI Problems](#gui-problems)
- [Database Issues](#database-issues)
- [Port Operation Errors](#port-operation-errors)
- [Platform-Specific Issues](#platform-specific-issues)
- [Performance Problems](#performance-problems)
- [Common Error Messages](#common-error-messages)

## Installation Issues

### npm install fails

**Problem**: Dependencies fail to install
```bash
npm ERR! code EINTEGRITY
npm ERR! sha512-... integrity checksum failed
```

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Native module errors

**Problem**: Better-sqlite3 or other native modules fail
```
Error: The module '/path/to/better-sqlite3.node'
was compiled against a different Node.js version
```

**Solution**:
```bash
# Rebuild native modules
npm rebuild better-sqlite3

# Or use the fix script
./scripts/fix-native-modules.sh

# For Electron specifically
./scripts/fix-native-modules.sh electron
```

### Command not found after installation

**Problem**: `portmanager` or `portman` command not recognized

**Solution**:
```bash
# If installed globally
npm install -g portmanager

# If installed locally
npm link

# Verify installation
which portmanager
echo $PATH

# Add to PATH if needed (bash)
echo 'export PATH="$PATH:$(npm bin -g)"' >> ~/.bashrc
source ~/.bashrc
```

## CLI Problems

### Permission denied errors

**Problem**: Can't kill processes or scan certain ports
```
Error: Permission denied
Error: Operation not permitted
```

**Solution**:
```bash
# For system ports or protected processes
sudo portmanager kill 80
sudo portmanager scan

# Better approach: avoid system ports
portmanager request --start 3000 --avoid 80 443 22
```

### Port scan returns empty results

**Problem**: `portman scan` shows no ports even though some are in use

**Solution**:
```bash
# Check if required tools are available
which lsof  # macOS/Linux
which netstat  # Windows

# Try manual scan
lsof -i -P -n | grep LISTEN  # macOS/Linux
netstat -ano | findstr LISTENING  # Windows

# Update Port Manager
npm update -g portmanager
```

### Database locked error

**Problem**: Multiple instances trying to access database
```
Error: SQLITE_BUSY: database is locked
```

**Solution**:
```bash
# Find and kill other instances
ps aux | grep portmanager
killall node

# Or wait and retry
sleep 2 && portmanager list
```

## GUI Problems

### GUI won't launch

**Problem**: `portman gui` does nothing or crashes

**Solution**:
```bash
# 1. Check if built
ls -la dist/electron/
# If empty, build it
npm run build:gui

# 2. Fix native modules
./scripts/fix-native-modules.sh electron

# 3. Check logs
tail -f ~/.portmanager/logs/gui.log

# 4. Run with debug info
DEBUG=* portmanager gui

# 5. Try direct electron launch
./node_modules/.bin/electron dist/electron/main/index.js
```

### White/blank screen

**Problem**: GUI opens but shows blank white screen

**Solution**:
1. **Disable hardware acceleration**:
   ```bash
   portmanager gui --disable-gpu
   ```

2. **Clear app data**:
   ```bash
   # macOS
   rm -rf ~/Library/Application\ Support/portmanager
   
   # Linux
   rm -rf ~/.config/portmanager
   
   # Windows
   rmdir /s %APPDATA%\portmanager
   ```

3. **Check renderer errors**:
   - Open DevTools: `Ctrl/Cmd+Shift+I`
   - Check Console tab for errors

### GUI freezes or becomes unresponsive

**Problem**: Interface stops responding to clicks

**Solution**:
1. **Force refresh**: `Ctrl/Cmd+R`
2. **Restart app**: `Ctrl/Cmd+Q` then relaunch
3. **Check system resources**:
   ```bash
   # Check CPU/Memory usage
   top | grep -i electron
   ```

## Database Issues

### Database corruption

**Problem**: Errors about malformed database
```
Error: SQLITE_CORRUPT: database disk image is malformed
```

**Solution**:
```bash
# 1. Backup corrupted database
cp ~/.portmanager/ports.db ~/.portmanager/ports.db.corrupt

# 2. Try to recover data
sqlite3 ~/.portmanager/ports.db.corrupt ".dump" > backup.sql

# 3. Create new database
rm ~/.portmanager/ports.db
portmanager list  # Creates fresh database

# 4. Restore if possible
sqlite3 ~/.portmanager/ports.db < backup.sql
```

### Lost port reservations

**Problem**: All reservations disappeared

**Solution**:
```bash
# Check for backups
ls -la ~/.portmanager/*.db*

# Restore from backup
cp ~/.portmanager/ports.db.backup ~/.portmanager/ports.db

# Or import from export
portmanager import ~/Documents/portmanager-export.json
```

## Port Operation Errors

### Port already in use

**Problem**: Can't reserve port that appears free
```
Error: Port 3000 is already in use
```

**Solution**:
```bash
# 1. Deep scan for the port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# 2. Check if it's a brief connection
sleep 5 && portmanager check 3000

# 3. Force kill if necessary
portmanager kill 3000
# or
sudo kill -9 $(lsof -t -i:3000)
```

### Can't kill process

**Problem**: Kill command fails
```
Error: Process not found
Error: Operation not permitted
```

**Solution**:
```bash
# 1. Verify process exists
portmanager scan | grep 3000

# 2. Try with elevated permissions
sudo portmanager kill 3000

# 3. Direct process kill
# macOS/Linux
kill -9 $(lsof -t -i:3000)

# Windows (as admin)
for /f "tokens=5" %a in ('netstat -ano ^| findstr :3000') do taskkill /PID %a /F
```

### Request command fails to find ports

**Problem**: `portman request` can't find enough free ports

**Solution**:
```bash
# 1. Expand search range
portmanager request 5 --start 3000 --end 20000

# 2. Use random selection
portmanager request 5 --random

# 3. Check what's in use
portmanager scan
portmanager list

# 4. Clean up old reservations
portmanager list --status reserved | grep -v "in-use"
```

## Platform-Specific Issues

### macOS

**Problem**: "Port Manager" is damaged and can't be opened
```
"Port Manager" is damaged and can't be opened. 
You should move it to the Trash.
```

**Solution**:
```bash
# Remove quarantine attribute
xattr -d com.apple.quarantine /Applications/Port\ Manager.app

# Or allow in System Preferences
# System Preferences > Security & Privacy > General
# Click "Open Anyway"
```

### Windows

**Problem**: Windows Defender blocks execution

**Solution**:
1. Add exclusion in Windows Defender
2. Or run with administrator privileges:
   ```cmd
   runas /user:Administrator "portmanager gui"
   ```

**Problem**: PowerShell execution policy

**Solution**:
```powershell
# Temporarily bypass
powershell -ExecutionPolicy Bypass -File install.ps1

# Or change policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Linux

**Problem**: Missing system tray icon

**Solution**:
```bash
# Install required packages
# Ubuntu/Debian
sudo apt install libappindicator3-1

# Fedora
sudo dnf install libappindicator-gtk3

# Arch
sudo pacman -S libappindicator-gtk3
```

## Performance Problems

### Slow port scanning

**Problem**: Scan takes too long

**Solution**:
```bash
# 1. Scan specific range only
portmanager scan --range 3000-9000

# 2. Disable DNS resolution (if implemented)
portmanager scan --no-dns

# 3. Check system load
top
iostat
```

### High memory usage

**Problem**: GUI uses excessive memory

**Solution**:
1. **Limit table rows**: Use pagination
2. **Clear old data**: Remove old reservations
3. **Restart periodically**: Memory leaks may accumulate
4. **Check extensions**: Disable unnecessary features

### GUI lag with many ports

**Problem**: Interface slows with 100+ ports

**Solution**:
```bash
# 1. Use filtering aggressively
# In GUI: Filter by project or status

# 2. Export and clean up
portmanager export all-ports.json
portmanager list | grep -v "in-use" | awk '{print $1}' | xargs portmanager release

# 3. Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=4096" portmanager gui
```

## Common Error Messages

### "EADDRINUSE: address already in use"
**Meaning**: Port is already being used by another process
**Fix**: Use `portman kill` or choose different port

### "EACCES: permission denied"
**Meaning**: Insufficient permissions for operation
**Fix**: Use `sudo` or choose port > 1024

### "SQLITE_BUSY: database is locked"
**Meaning**: Database is being used by another process
**Fix**: Close other Port Manager instances

### "ENOENT: no such file or directory"
**Meaning**: Required file is missing
**Fix**: Reinstall or run `npm run build`

### "MODULE_NOT_FOUND"
**Meaning**: Missing dependency
**Fix**: Run `npm install`

### "Invalid port number"
**Meaning**: Port must be 1-65535
**Fix**: Use valid port number

### "Port X is reserved for project Y"
**Meaning**: Port already reserved by another project
**Fix**: Release first or use different port

## Getting Help

### Debug Mode
```bash
# Enable debug logging
DEBUG=* portmanager list
DEBUG=electron* portmanager gui

# Verbose output
portmanager --verbose check 3000
```

### Log Files
```bash
# CLI logs
~/.portmanager/logs/cli.log

# GUI logs
~/.portmanager/logs/gui.log

# View recent logs
tail -f ~/.portmanager/logs/*.log
```

### System Information
```bash
# Gather system info for bug reports
portmanager --version
node --version
npm --version
sqlite3 --version
uname -a  # OS info
```

### Community Support
- GitHub Issues: [Report bugs](https://github.com/ahmadzein/portmanager/issues)
- Discussions: [Ask questions](https://github.com/ahmadzein/portmanager/discussions)
- Wiki: [Community solutions](https://github.com/ahmadzein/portmanager/wiki)

## Prevention Tips

1. **Regular Maintenance**:
   ```bash
   # Weekly cleanup
   portmanager list --status reserved | grep -v "in-use"
   portmanager export backup-$(date +%Y%m%d).json
   ```

2. **Use Auto-Release**:
   ```bash
   portmanager reserve 3000 --name "dev" --auto-release
   ```

3. **Avoid System Ports**:
   ```bash
   portmanager request --start 3000 --avoid 80 443 22 3306 5432
   ```

4. **Keep Updated**:
   ```bash
   npm update -g portmanager
   ```

---

If your issue isn't covered here, please [open an issue](https://github.com/ahmadzein/portmanager/issues) with:
- Error message
- Command that caused it
- System information
- Debug logs