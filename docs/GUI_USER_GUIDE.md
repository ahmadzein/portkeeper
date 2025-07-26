# GUI User Guide

## Overview
Port Manager GUI provides a modern, intuitive desktop application for managing your development ports. With features like visual dashboards, real-time scanning, and one-click actions, it makes port management effortless.

## Table of Contents
- [Getting Started](#getting-started)
- [Interface Overview](#interface-overview)
- [Dashboard View](#dashboard-view)
- [Scan View](#scan-view)
- [Port Operations](#port-operations)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Settings & Preferences](#settings--preferences)
- [Tips & Best Practices](#tips--best-practices)

## Getting Started

### Launching the Application

**From Command Line:**
```bash
portmanager gui
```

**From Applications (after installation):**
- **macOS**: Find "Port Manager" in Applications or Launchpad
- **Windows**: Find "Port Manager" in Start Menu
- **Linux**: Find "Port Manager" in your application menu

### First Launch
On first launch, Port Manager will:
1. Create necessary database files
2. Scan for currently active ports
3. Display the main dashboard

## Interface Overview

### Main Components

```
┌─────────────────────────────────────────────┐
│  [≡] Port Manager          [_] [□] [X]      │  <- Title Bar
├─────────────────────────────────────────────┤
│  Dashboard | Scan          [🌙] [?] [@]     │  <- Navigation & Actions
├─────────────────────────────────────────────┤
│                                             │
│           Main Content Area                 │  <- Dynamic Content
│                                             │
└─────────────────────────────────────────────┘
```

### Navigation Bar
- **Dashboard**: View and manage reserved ports
- **Scan**: See all active ports on your system
- **Theme Toggle** (🌙/☀️): Switch between dark and light mode
- **Help** (?): Access documentation and shortcuts
- **Info** (@): View app version and details

## Dashboard View

The Dashboard is your central hub for managing reserved ports.

### Features

#### 1. Reserved Ports Table
Displays all your reserved ports with:
- **Port Number**: The reserved port
- **Project Name**: Associated project
- **Description**: Port purpose/details
- **Status**: Current status (reserved/in-use)
- **Reserved Date**: When the port was reserved
- **Tags**: Categories for organization
- **Actions**: Quick action buttons

#### 2. Search and Filter
- **Search Bar**: Filter by port, project, or description
- **Status Filter**: Show all/reserved/in-use ports
- **Tag Filter**: Filter by specific tags

#### 3. Quick Actions
Each port entry has action buttons:
- **📋 Copy**: Copy port number to clipboard
- **✏️ Edit**: Modify port details
- **🗑️ Delete**: Release the port

### Dashboard Operations

#### Reserving a New Port
1. Click the **"Reserve Port"** button
2. Fill in the form:
   - Port number (required)
   - Project name (required)
   - Description (optional)
   - Tags (optional, press Enter after each tag)
   - Auto-release option
3. Click **"Reserve"**

**Example Reservation:**
```
Port: 3000
Project: my-react-app
Description: Development server for customer portal
Tags: [frontend] [react] [development]
☑ Auto-release when process stops
```

#### Editing a Reservation
1. Click the ✏️ icon on any reserved port
2. Modify the details in the modal
3. Click **"Update"**

#### Releasing a Port
1. Click the 🗑️ icon on the port row
2. Confirm the action in the dialog
3. Port is immediately released

#### Bulk Operations
1. Select multiple ports using checkboxes
2. Use bulk action buttons:
   - Release Selected
   - Export Selected
   - Tag Selected

## Scan View

The Scan View shows all ports currently in use on your system.

### Features

#### 1. Active Ports Table
Real-time display of active ports showing:
- **Port**: Port number with color coding
- **PID**: Process ID
- **Process**: Process name
- **Project**: Reserved project name (if applicable)
- **Description**: Port description (if reserved)
- **State**: Connection state (LISTEN/ESTABLISHED)
- **Address**: Binding address
- **Actions**: Kill process button

#### 2. Enhanced Information
Ports reserved through Port Manager show additional details:
- Purple project name tag
- Hover to see full description
- Reservation date in tooltip

#### 3. Search Functionality
Search across all fields:
- Port numbers
- Process names
- PIDs
- Project names
- Descriptions

### Scan Operations

#### Scanning for Ports
1. Click **"Rescan"** button or press `Ctrl/Cmd+R`
2. View the scanning progress
3. Results update automatically

#### Killing a Process
1. Find the port with the process you want to kill
2. Click the **"Kill"** button in the Actions column
3. Confirm in the popup dialog
4. Process is terminated and list updates

**Warning**: Killing processes may cause data loss in those applications. Always save your work first.

#### Checking Port Details
- **Hover** over truncated text to see full content
- **Click** on project tags to see description
- **Right-click** for context menu options

## Port Operations

### Check Port Modal
Quick check if a specific port is available:

1. Press `Ctrl/Cmd+K` or click **"Check Port"**
2. Enter port number
3. View status:
   - ✅ **Free**: Port is available
   - 🔒 **Reserved**: Shows project details
   - ⚠️ **In Use**: Shows process information

### Reserve Port Modal
Reserve ports for your projects:

1. Press `Ctrl/Cmd+N` or click **"Reserve Port"**
2. Fill in details:
   ```
   Port: [3000]
   Project Name: [my-project]
   Description: [React development server]
   Tags: [react] [frontend] [dev]
   ☐ Auto-release when not in use
   ```
3. Click **"Reserve"**

### Request Multiple Ports Modal
Need several ports for a project?

1. Press `Ctrl/Cmd+M` or click **"Request Ports"**
2. Configure your request:
   ```
   Number of Ports: [5]
   Project Name: [microservices]
   Description: [Service mesh for e-commerce]
   
   ◉ Sequential (3000, 3001, 3002...)
   ◯ Random (3847, 5923, 7102...)
   
   Start Port: [3000]
   End Port: [9999]
   
   Avoid Ports: [3306, 5432, 6379]
   Tags: [docker] [microservices]
   ```
3. Click **"Request"**
4. View summary of allocated ports

## Keyboard Shortcuts

### Global Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd+K` | Check port status |
| `Ctrl/Cmd+N` | Reserve new port |
| `Ctrl/Cmd+L` | View port list |
| `Ctrl/Cmd+R` | Refresh/Rescan |
| `Ctrl/Cmd+F` | Focus search |
| `Ctrl/Cmd+D` | Toggle dark mode |
| `Ctrl/Cmd+,` | Open settings |
| `Ctrl/Cmd+?` | Show help |

### Navigation
| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd+1` | Go to Dashboard |
| `Ctrl/Cmd+2` | Go to Scan View |
| `Tab` | Next element |
| `Shift+Tab` | Previous element |

### Table Operations
| Shortcut | Action |
|----------|--------|
| `↑/↓` | Navigate rows |
| `Enter` | Open details |
| `Delete` | Delete selected |
| `Ctrl/Cmd+A` | Select all |
| `Space` | Toggle selection |

## Settings & Preferences

### Theme Settings
- **Dark Mode**: Easier on the eyes for long sessions
- **Light Mode**: Better for bright environments
- **Auto**: Follows system preference

### Display Options
- **Compact View**: Show more ports at once
- **Detailed View**: Show all information
- **Hide System Ports**: Filter out ports < 1024

### Data Management

#### Export Configuration
1. Click **File → Export**
2. Choose location and filename
3. Saves all port reservations as JSON

#### Import Configuration
1. Click **File → Import**
2. Select JSON file
3. Review import summary
4. Conflicts are automatically handled

#### Auto-Backup
- Enable in Settings
- Automatically backs up daily
- Keeps last 7 backups

## Tips & Best Practices

### 1. Organize with Tags
Use consistent tags for better organization:
```
#frontend - All frontend services
#backend - Backend APIs
#database - Database ports
#dev - Development only
#prod - Production mirrors
```

### 2. Use Descriptive Names
Instead of generic names, be specific:
- ❌ "server", "app", "test"
- ✅ "customer-portal-api", "admin-dashboard", "e2e-test-server"

### 3. Color Coding
Understand the color scheme:
- 🟦 **Blue**: Port numbers
- 🟣 **Purple**: Reserved projects
- 🟢 **Green**: Active/Listening
- 🟡 **Orange**: Other states
- 🔴 **Red**: Errors or kill actions

### 4. Quick Workflows

**Development Setup:**
1. `Ctrl/Cmd+M` - Request multiple ports
2. Enter project details
3. Copy port list to `.env` file

**Debugging Port Conflicts:**
1. `Ctrl/Cmd+2` - Go to Scan
2. `Ctrl/Cmd+F` - Search for port
3. Click Kill if needed
4. `Ctrl/Cmd+N` - Reserve for your use

**Team Collaboration:**
1. Reserve all team ports
2. `Ctrl/Cmd+E` - Export configuration
3. Share via version control
4. Team imports on their machines

### 5. Performance Tips
- **Large Port Lists**: Use search instead of scrolling
- **Frequent Scanning**: Enable auto-refresh in settings
- **Many Reservations**: Use tags for quick filtering

## Troubleshooting

### Application Won't Start
```bash
# Rebuild native modules
npm run build:gui
./scripts/fix-native-modules.sh electron

# Check logs
tail -f ~/.portmanager/logs/gui.log
```

### Scan Not Working
- Check permissions (may need admin for some ports)
- Verify no antivirus blocking
- Try running as administrator
- Check firewall settings

### UI Issues
- **Frozen UI**: Press `Ctrl/Cmd+R` to refresh
- **Missing Buttons**: Resize window
- **Theme Issues**: Toggle theme twice
- **Font Issues**: Check system font settings

### Data Issues
- **Missing Reservations**: Check if database exists
- **Can't Reserve**: Ensure port is not in use
- **Import Fails**: Verify JSON format

## Advanced Features

### Command Palette
Press `Ctrl/Cmd+P` to open command palette:
- Quick access to all functions
- Fuzzy search commands
- Recent commands history

### Port Monitoring
Enable in settings to:
- Get notifications when ports become available
- Alert when reserved ports are accessed
- Track port usage statistics

### Integration
Port Manager GUI integrates with:
- System tray for quick access
- Native notifications
- Clipboard for easy copying
- File system for import/export

## Frequently Asked Questions

**Q: Can I reserve system ports (< 1024)?**
A: Yes, but you'll need administrator privileges to actually use them.

**Q: What happens to reservations if I uninstall?**
A: Reservations are stored in `~/.portmanager/`. Back up this folder to preserve data.

**Q: Can multiple users share reservations?**
A: Yes, through the export/import feature. Consider using a shared network location.

**Q: How do I reset everything?**
A: Delete `~/.portmanager/` folder and restart the application.

**Q: Is there a CLI version?**
A: Yes! All features are available via CLI. Type `portmanager --help`.

---

For more help, visit our [documentation](https://github.com/ahmadzein/portmanager) or use the in-app help system (`Ctrl/Cmd+?`).