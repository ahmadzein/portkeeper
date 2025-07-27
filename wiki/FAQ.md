# FAQ

Frequently Asked Questions about Port Keeper.

## 🎯 General Questions

### What is Port Keeper?

Port Keeper is a developer tool that helps manage and track port allocations across development projects. It prevents port conflicts, provides easy port discovery, and enables team collaboration.

### Why do I need Port Keeper?

- **Prevent Conflicts**: No more "port already in use" errors
- **Team Coordination**: See what ports your team is using
- **Quick Discovery**: Find available ports instantly
- **Process Management**: Kill processes using specific ports
- **Documentation**: Keep track of what each port is used for

### How is this different from `lsof` or `netstat`?

Port Keeper provides:
- Persistent port reservations (even when not in use)
- Project associations and descriptions
- Team synchronization capabilities
- Cross-platform GUI
- Historical tracking
- Import/export functionality

### Is Port Keeper free?

Yes! Port Keeper is open source and free to use under the MIT license.

## 💻 Installation & Setup

### What are the system requirements?

- **Node.js**: Version 16 or higher
- **npm**: Version 7 or higher
- **OS**: macOS, Linux, or Windows
- **Disk Space**: ~100MB

### Why does installation fail with NODE_MODULE_VERSION error?

This occurs when better-sqlite3 was compiled for a different Node.js version. Fix:

```bash
# Rebuild the native module
npm rebuild -g better-sqlite3

# Or reinstall Port Keeper
npm uninstall -g portkeeper
npm install -g portkeeper
```

### Where is data stored?

- **macOS/Linux**: `~/.portkeeper/`
- **Windows**: `%USERPROFILE%\.portkeeper\`

This includes:
- `database.db` - Port reservations
- `config.json` - User settings
- `logs/` - Application logs

### Can I change the data directory?

```bash
export PORTKEEPER_DB_PATH=/custom/path/database.db
export PORTKEEPER_CONFIG_PATH=/custom/path/config.json
```

## 📦 CLI Usage

### How do I check if a port is available?

```bash
portman check 3000
```

### How do I reserve multiple ports?

```bash
# Reserve specific ports
portman reserve 3000 3001 3002 -n "my-app"

# Request sequential ports
portman request 5 -n "microservices" --sequential
```

### How do I see all ports for my project?

```bash
portman list -p "my-project"
```

### Can I use shorter commands?

Yes! Add aliases to your shell config:

```bash
alias pm='portman'
alias pmc='portman check'
alias pmr='portman reserve'
alias pml='portman list'
```

### How do I kill a process using a port?

```bash
portman kill 3000

# Force kill without confirmation
portman kill 3000 --force
```

## 🖼️ GUI Usage

### How do I start the GUI?

```bash
portman gui
```

### Can the GUI run in the background?

Yes, it can minimize to system tray. Enable in settings:
- **macOS**: Menu bar icon
- **Windows**: System tray icon
- **Linux**: System tray (if supported)

### Why is the GUI slow?

Try:
1. Disable animations in settings
2. Reduce refresh interval
3. Clear old port history
4. Update to latest version

### Can I use keyboard shortcuts?

- `Cmd/Ctrl + K`: Quick search
- `Cmd/Ctrl + R`: Refresh
- `Cmd/Ctrl + N`: New reservation
- `Cmd/Ctrl + D`: Delete selected
- `Esc`: Close dialogs

## 👥 Team Collaboration

### How do we share port configurations?

1. Export configuration:
   ```bash
   portman export team-ports.json
   ```

2. Commit to repository:
   ```bash
   git add team-ports.json
   git commit -m "Update port allocations"
   ```

3. Team members import:
   ```bash
   portman import team-ports.json
   ```

### Can we enforce port ranges per team?

Yes, use tags and naming conventions:

```bash
# Frontend team: 3000-3999
portman reserve 3000 -n "frontend-app" -t "team-frontend"

# Backend team: 4000-4999
portman reserve 4000 -n "api-server" -t "team-backend"
```

### How do we prevent conflicts?

1. Use consistent naming: `[team]-[project]-[component]`
2. Document port allocations in README
3. Regular sync meetings
4. CI/CD port verification

## 🔧 Troubleshooting

### "Port already in use" but port shows as free?

The port might be in use by a system process:

```bash
# Force scan including system ports
portman scan --all

# Check with system tools
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### Database is corrupted?

1. Backup current database:
   ```bash
   cp ~/.portkeeper/database.db ~/.portkeeper/database.db.backup
   ```

2. Reset database:
   ```bash
   rm ~/.portkeeper/database.db
   portman list  # Creates new database
   ```

3. Restore from export:
   ```bash
   portman import backup.json
   ```

### GUI won't start?

1. Check logs:
   ```bash
   cat ~/.portkeeper/logs/gui.log
   ```

2. Reset GUI settings:
   ```bash
   rm ~/.portkeeper/gui-config.json
   ```

3. Try safe mode:
   ```bash
   portman gui --safe-mode
   ```

### Commands hang or timeout?

Increase timeout:

```bash
# In config.json
{
  "ports": {
    "scanTimeout": 10000  // 10 seconds
  }
}

# Or via environment
export PORTKEEPER_SCAN_TIMEOUT=10000
```

## ⚙️ Configuration

### How do I set default options?

Edit `~/.portkeeper/config.json`:

```json
{
  "cli": {
    "defaultFormat": "table",
    "colorEnabled": true,
    "pageSize": 20
  }
}
```

### Can I disable colors?

```bash
# Temporarily
NO_COLOR=1 portman list

# Permanently in config
{
  "cli": {
    "colorEnabled": false
  }
}
```

### How do I change the port range?

```json
{
  "ports": {
    "defaultRange": {
      "start": 8000,
      "end": 8999
    }
  }
}
```

## 🔐 Security

### Is my port data secure?

- Database is stored locally
- No data sent to external servers
- File permissions set to user-only (600)
- No authentication required (local use only)

### Can others see my ports?

Only if you explicitly:
- Export and share configurations
- Use team synchronization features
- Grant file system access

### What about sensitive projects?

Use metadata to mark sensitive ports:

```bash
portman reserve 9000 -n "internal-api" --metadata '{"sensitive": true}'
```

## 🌐 Integration

### How do I integrate with npm scripts?

```json
{
  "scripts": {
    "prestart": "portman check 3000 || exit 1",
    "start": "node server.js",
    "poststart": "portman release 3000"
  }
}
```

### Can I use with Docker?

```yaml
# docker-compose.yml
services:
  web:
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "portman", "check", "3000"]
```

### How about CI/CD?

GitHub Actions example:

```yaml
- name: Verify Ports
  run: |
    npm install -g portkeeper
    portman import ports.json
    portman check 3000 4000 5000
```

## 🚀 Performance

### How many ports can Port Keeper handle?

- Tested with 10,000+ port reservations
- GUI performs well with 1,000 visible ports
- Scan can check all 65,535 ports

### Does it slow down my system?

No, Port Keeper:
- Uses minimal CPU (< 1%)
- Small memory footprint (~50MB)
- SQLite database is efficient
- No background processes (except GUI)

### Can I optimize scan performance?

```bash
# Scan specific range
portman scan -r 3000-4000

# Exclude system ports
portman scan --no-system

# Increase parallel scanning
portman scan --parallel 200
```

## 🔄 Updates & Maintenance

### How do I update Port Keeper?

```bash
npm update -g portkeeper
```

### Will updates preserve my data?

Yes! Updates never touch:
- Database (`~/.portkeeper/database.db`)
- Configuration (`~/.portkeeper/config.json`)
- Exports and backups

### How often should I backup?

Recommended:
- Weekly automated exports
- Before major updates
- After team port allocation sessions

```bash
# Automated backup script
portman export "backup-$(date +%Y%m%d).json"
```

## 🐛 Known Issues

### Windows Issues

1. **Firewall warnings**: Add exception for Port Keeper
2. **Admin rights**: Not required, but helps with process detection
3. **Antivirus**: May flag Electron app, add to whitelist

### macOS Issues

1. **Gatekeeper**: Allow app in Security settings
2. **Port scan slow**: Grant full disk access
3. **GUI scaling**: Known issue on M1 Macs

### Linux Issues

1. **Wayland**: Some GUI features limited
2. **Snap packages**: May have permission issues
3. **System tray**: Depends on desktop environment

## 💖 Community

### How can I contribute?

See our [Contributing Guide](Contributing). We welcome:
- Bug reports
- Feature requests
- Documentation improvements
- Code contributions

### Where can I get help?

- GitHub Issues: [Bug reports](https://github.com/ahmadzein/portkeeper/issues)
- Discussions: [Q&A and ideas](https://github.com/ahmadzein/portkeeper/discussions)
- Wiki: [Documentation](https://github.com/ahmadzein/portkeeper/wiki)

### Who maintains Port Keeper?

Port Keeper is maintained by Ahmad Zein and the open source community.

---

Still have questions? [Open an issue](https://github.com/ahmadzein/portkeeper/issues/new/choose) or [start a discussion](https://github.com/ahmadzein/portkeeper/discussions/new)!