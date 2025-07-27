# GUI User Guide

Port Keeper's graphical user interface provides a visual way to manage your ports with powerful features and an intuitive design.

## 🚀 Launching the GUI

### Basic Launch
```bash
portman gui
```

### Development Mode
```bash
portman gui --dev
```

### Troubleshooting Launch
```bash
# Skip native module rebuild
portman gui --skip-rebuild

# Check if GUI is available
portman gui --help
```

## 🎨 Interface Overview

### Main Components

1. **Header Bar**
   - Port Keeper logo and title
   - Navigation menu
   - Theme toggle (dark/light)
   - Settings button

2. **Navigation Tabs**
   - **Dashboard**: Overview of reserved ports
   - **Active Ports**: Real-time port scanning

3. **Action Buttons**
   - Reserve Port
   - Check Port  
   - Request Ports
   - Scan Ports
   - Export/Import

## 📊 Dashboard View

The dashboard is your primary interface for managing reserved ports.

### Features

#### Port Table
Displays all reserved ports with:
- Port number
- Project name
- Description
- Tags
- Status (Reserved/In Use)
- Reserved date
- Actions (Release/Kill)

#### Quick Actions
- **Reserve New Port**: Opens reservation dialog
- **Check Port**: Quick port status check
- **Request Multiple**: Auto-find available ports
- **Export Config**: Save port configuration

#### Search and Filter
- **Search Bar**: Filter by port, project, description, or tags
- **Status Filter**: Show all, reserved only, or in-use only
- **Sort Options**: Click column headers to sort

### Port Reservation

1. Click "Reserve Port" button
2. Enter port number
3. Fill in project name (required)
4. Add description (optional)
5. Add tags separated by spaces (optional)
6. Click "Reserve"

### Bulk Operations

Select multiple ports using checkboxes to:
- Release multiple ports at once
- Export selected ports only
- Apply tags to multiple ports

## 🔍 Active Ports View

Real-time scanning of all active ports on your system.

### Features

#### Live Port Scanning
- Automatic scan on view load
- Manual rescan button
- Shows all listening ports

#### Port Information
For each active port:
- Port number
- Process ID (PID)
- Process name
- State (LISTEN/ESTABLISHED)
- Address binding
- Project info (if reserved)

#### Actions
- **Kill Process**: Terminate process using port
- **Reserve**: Quick reserve if not already reserved
- **Rescan**: Refresh port list

#### Advanced Filtering
- Search by port, PID, process name
- Filter by state
- Show only reserved ports
- Custom port range scanning

## ⌨️ Keyboard Shortcuts

### Global Shortcuts
- `Cmd/Ctrl + K`: Quick search
- `Cmd/Ctrl + N`: New reservation
- `Cmd/Ctrl + R`: Refresh/Rescan
- `Cmd/Ctrl + E`: Export
- `Cmd/Ctrl + I`: Import
- `Cmd/Ctrl + ,`: Settings

### Navigation
- `Tab`: Navigate between elements
- `Arrow Keys`: Navigate table rows
- `Space`: Select/deselect row
- `Enter`: Perform default action

### Table Operations
- `Cmd/Ctrl + A`: Select all
- `Delete`: Release selected ports
- `Shift + Click`: Range selection

## 🎨 Themes and Customization

### Theme Toggle
- Click sun/moon icon in header
- Automatic theme persistence
- Supports system theme preference

### Color Schemes

#### Light Theme
- Clean, minimal design
- High contrast for readability
- Blue accent colors

#### Dark Theme
- Reduced eye strain
- Optimized for long sessions
- Purple accent colors

## 💾 Data Management

### Export Options

1. **Export All**: Save complete configuration
2. **Export Selected**: Save specific ports only
3. **Export Project**: Save single project ports

Export formats:
- JSON (default)
- Human-readable with formatting

### Import Features

1. **Merge Import**: Add to existing ports
2. **Replace Import**: Replace all current data
3. **Selective Import**: Choose which ports to import

### Backup Strategy
- Regular automatic backups
- Manual backup before major changes
- Export before team sharing

## 🔧 Settings

Access via gear icon or `Cmd/Ctrl + ,`

### General Settings
- Default project name
- Auto-refresh interval
- Confirmation dialogs
- Sound notifications

### Appearance
- Theme preference
- Table density
- Font size
- Color customization

### Advanced
- Database location
- Log level
- Performance options
- Reset to defaults

## 📈 Status Indicators

### Port Status Colors
- 🟢 **Green**: Available/Free
- 🟡 **Yellow**: Reserved
- 🔴 **Red**: In Use
- 🟣 **Purple**: Reserved & In Use

### Process States
- **LISTEN**: Accepting connections
- **ESTABLISHED**: Active connection
- **TIME_WAIT**: Closing connection
- **CLOSE_WAIT**: Waiting to close

## 🚨 Notifications

### Types
- **Success**: Green toast notifications
- **Warning**: Yellow alerts
- **Error**: Red error messages
- **Info**: Blue informational

### Notification Settings
- Enable/disable categories
- Duration settings
- Position on screen
- Sound alerts

## 🔍 Search Functionality

### Search Syntax
- **Basic**: Type to search all fields
- **Port**: `port:3000`
- **Project**: `project:myapp`
- **Tag**: `tag:frontend`
- **PID**: `pid:1234`

### Advanced Search
- Combine filters: `port:3000 project:api`
- Exclude: `-tag:test`
- Range: `port:3000-4000`
- Wildcards: `project:my*`

## 📱 Responsive Design

The GUI adapts to different window sizes:

### Desktop Mode (>1200px)
- Full table with all columns
- Side-by-side panels
- Expanded action buttons

### Tablet Mode (768-1200px)
- Condensed table view
- Stacked panels
- Dropdown actions

### Compact Mode (<768px)
- Card-based layout
- Essential info only
- Swipe actions

## 🐛 Troubleshooting GUI Issues

### GUI Won't Launch

1. Check Electron installation:
   ```bash
   npm install -g portkeeper --include=optional
   ```

2. Rebuild native modules:
   ```bash
   npm rebuild -g better-sqlite3
   ```

3. Check error logs:
   ```bash
   portman gui --dev
   ```

### Performance Issues

- Reduce scan frequency
- Limit port range
- Clear old reservations
- Disable animations

### Display Problems

- Reset window position in settings
- Clear application cache
- Update graphics drivers
- Try different theme

## 💡 Tips and Tricks

1. **Quick Reservation**: Double-click port number in scan view
2. **Bulk Release**: Select with Shift, then press Delete
3. **Quick Filter**: Start typing to filter instantly
4. **Port History**: Right-click for port history
5. **Custom Shortcuts**: Define in settings

## 🔗 Integration

### With CLI
- GUI and CLI share same database
- Changes reflect immediately
- Use CLI for automation

### With IDE
- Keep GUI open while developing
- Quick access to port info
- Visual port management

### Team Workflow
1. Export configuration
2. Share via version control
3. Team imports configuration
4. Synchronized port usage

---

For more help, see our [Troubleshooting Guide](Troubleshooting) or [open an issue](https://github.com/ahmadzein/portkeeper/issues).