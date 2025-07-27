# Changelog

All notable changes to Port Keeper will be documented in this file.

## [1.1.10] - 2025-01-27

### Fixed
- **Documentation Links**: Updated all references to use correct GitHub repository (ahmadzein/portkeeper)
- **README Links**: Fixed GitHub clone URLs and added GitHub link to header
- **Website Installation**: Corrected npm install command from "portmanager" to "portkeeper"
- **User Manual**: Updated all references to use correct package name and repository
- **CLI AI Command**: Changed "Port Manager" to "Port Keeper" in AI integration guide

### Updated Links
- GitHub: https://github.com/ahmadzein/portkeeper
- npm: https://www.npmjs.com/package/portkeeper
- Websites: https://portkeeper.net and https://portkeeper.dev

## [1.1.9] - 2025-01-27

### Verified
- **Domain Updates**: Confirmed README uses correct domains (portkeeper.net and portkeeper.dev)
- **Active Ports Sorting**: Verified sorting functionality is properly implemented in GUI
- **Active Ports Search**: Confirmed search filters by port, PID, process, project, and description

### Notes
- No code changes needed - existing implementation is correct
- If sorting/search appears broken, try clearing browser cache or reinstalling

## [1.1.8] - 2025-01-27

### Fixed
- **Removed PostInstall Script**: Removed automatic postinstall due to npm global install limitations
- **Documentation**: Added clear instructions for manual `npm rebuild` if needed

### Changed
- Users experiencing NODE_MODULE_VERSION errors should run `npm rebuild -g better-sqlite3`

## [1.1.7] - 2025-01-27

### Fixed
- **PostInstall Directory**: Fixed postinstall script to use correct directory during npm global install
- **Installation Path**: Use __dirname instead of process.cwd() for reliable path resolution

## [1.1.6] - 2025-01-27

### Fixed
- **Module Type Conflict**: Renamed postinstall scripts to .cjs extension to work with ES module package
- **Ensure-Electron Script**: Converted to CommonJS and renamed to .cjs for compatibility
- **Postinstall Reliability**: Scripts now properly handle both local and global npm installations

## [1.1.5] - 2025-01-27

### Fixed
- **PostInstall Script**: Switched to CommonJS for better npm compatibility
- **Error Handling**: PostInstall script no longer exits with error to prevent npm install failures

## [1.1.4] - 2025-01-27

### Fixed
- **PostInstall Script Directory**: Fixed postinstall script to use correct working directory with INIT_CWD
- **NPM Global Install**: Resolved better-sqlite3 rebuild issues during global npm installation

## [1.1.3] - 2025-01-27

### Fixed
- **PostInstall Script**: Fixed ES module configuration by adding package.json to scripts folder
- **Native Module Rebuild**: Resolved NODE_MODULE_VERSION mismatch errors during npm install
- **Better-sqlite3 Compatibility**: Ensured proper rebuilding for different Node.js versions

## [1.1.2] - 2025-01-27

### Fixed
- **Native Module Compatibility**: GUI now automatically rebuilds better-sqlite3 for Electron when needed
- **Dev Tools Issue**: Fixed dev tools opening in production - now only opens with `--dev` flag
- **NODE_MODULE_VERSION Error**: Resolved the ABI version mismatch between Node.js and Electron

### Added
- **Automatic Module Rebuilding**: `portman gui` now checks and rebuilds native modules automatically
- **Smart Electron Installation**: GUI command can install Electron on-demand if missing
- **Post-Install Script**: Improved setup process that prepares modules for both CLI and GUI
- **Skip Rebuild Option**: Added `--skip-rebuild` flag for troubleshooting

### Improved
- Better error messages with helpful recovery suggestions
- Seamless GUI launch experience - no manual setup required
- Clear feedback during installation and module preparation

## [1.1.0] - 2025-01-27

### Added
- **Seamless GUI Integration**: GUI is now included in the npm package with optional Electron dependency
- **Smart Installation**: Use `npm install -g portkeeper --include=optional` for GUI support
- **Automatic GUI Detection**: The `portman gui` command automatically detects if Electron is available
- **Installation Help**: Clear instructions when GUI dependencies are missing

### Changed
- GUI is no longer a separate download - it's included in the main package
- Electron is now an optional dependency to keep CLI-only installations lightweight
- Updated all documentation to reflect new installation methods
- Improved GUI launch command with better error handling

### Fixed
- Fixed GUI file paths in npm package distribution
- Updated .npmignore to include necessary GUI files
- Corrected all branding references to "Port Keeper"

## [1.0.1] - 2025-01-26

### Added
- Published to npm registry as `portkeeper`
- Renamed project from "portmanager" to "portkeeper" due to npm naming conflicts

### Changed
- Updated all branding and references
- Changed repository URL to https://github.com/ahmadzein/portkeeper
- Updated marketing website to portkeeper.net

## [1.0.0] - 2025-01-26

### Initial Release
- Complete CLI with all port management commands
- Full-featured GUI with Electron + React
- SQLite database for port persistence
- JSON output support for all commands
- AI agent integration guide
- Comprehensive documentation

### Features
- Check port status
- Reserve ports with metadata
- List all reserved ports
- Release ports (with bulk support)
- Kill processes on ports
- Scan active ports
- Request multiple ports dynamically
- Export/Import configurations
- Visual GUI dashboard
- Dark/Light theme support
- Keyboard shortcuts
- Cross-platform support (macOS, Windows, Linux)