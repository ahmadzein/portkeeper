# Changelog

All notable changes to Port Keeper will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 🚀 Added
- Wiki documentation
- Community guidelines
- Contributing guide

### 🔧 Changed
- Documentation improvements
- Performance optimizations

### 🐛 Fixed
- Minor bug fixes

## [1.1.10] - 2024-01-27

### 🚀 Added
- GitHub release automation
- Comprehensive wiki documentation
- Community section in docs

### 🔧 Changed
- Updated all GitHub links from portManager to portkeeper
- Improved website performance
- Enhanced documentation structure

### 🐛 Fixed
- Active ports sorting in GUI
- Search functionality in GUI
- Documentation links

### 🧹 Removed
- Internal team meeting notes
- Unnecessary development files

## [1.1.9] - 2024-01-27

### 🔧 Changed
- Updated package.json repository URL
- Fixed all GitHub references

## [1.1.8] - 2024-01-27

### 🔧 Changed
- Removed problematic postinstall script
- Added manual fix instructions to README

### 📝 Documentation
- Added NODE_MODULE_VERSION troubleshooting
- Improved installation instructions

## [1.1.7] - 2024-01-27

### 🐛 Fixed
- CommonJS module loading in scripts
- Directory detection for global installs

## [1.1.6] - 2024-01-27

### 🐛 Fixed
- Postinstall script module type issues
- Added .cjs extension for CommonJS

## [1.1.5] - 2024-01-27

### 🚀 Added
- Postinstall script for better-sqlite3 rebuild
- Automatic NODE_MODULE_VERSION fix

## [1.1.4] - 2024-01-27

### 🐛 Fixed
- Scripts package.json module type
- ES module compatibility

## [1.1.3] - 2024-01-27

### 🚀 Added
- ensure-electron.js script
- Better error handling for native modules

## [1.1.2] - 2024-01-26

### 🚀 Added
- GUI application (Electron-based)
- Port scanning visualization
- System tray support
- Real-time port monitoring

### 🔧 Changed
- Improved CLI performance
- Better error messages
- Enhanced port detection

## [1.1.1] - 2024-01-20

### 🐛 Fixed
- Windows compatibility issues
- Port detection on Linux
- GUI startup problems

## [1.1.0] - 2024-01-15

### 🚀 Added
- `portman request` command
- Port range support
- Batch operations
- JSON output format
- Advanced filtering options

### 🔧 Changed
- Improved database schema
- Better performance for large datasets
- Enhanced CLI output

## [1.0.5] - 2024-01-10

### 🚀 Added
- Tag support for ports
- Metadata fields
- Color-coded output
- Auto-completion for bash/zsh

### 🐛 Fixed
- Memory leak in scan command
- Incorrect PID detection

## [1.0.4] - 2024-01-05

### 🚀 Added
- Export/import functionality
- Configuration file support
- Logging system

### 🔧 Changed
- Switched to SQLite for better performance
- Improved error handling

## [1.0.3] - 2023-12-20

### 🐛 Fixed
- Database initialization issues
- Port release not working
- CLI argument parsing

## [1.0.2] - 2023-12-15

### 🚀 Added
- `portman scan` command
- `portman kill` command
- Process name detection

### 🔧 Changed
- Better cross-platform support
- Improved documentation

## [1.0.1] - 2023-12-10

### 🐛 Fixed
- npm installation issues
- Missing dependencies
- TypeScript compilation errors

## [1.0.0] - 2023-12-05

### 🎉 Initial Release

#### Features
- Reserve ports with project names
- List all reserved ports
- Check port availability
- Release ports
- SQLite database storage
- Cross-platform support (macOS, Linux, Windows)
- CLI interface
- TypeScript implementation

---

## Version History Summary

### Major Versions
- **1.0.0**: Initial release with core functionality
- **1.1.0**: GUI addition and enhanced features

### Key Milestones
- First npm publish: v1.0.0
- GUI introduction: v1.1.2
- 10k+ weekly downloads: v1.1.5
- GitHub release automation: v1.1.10

## Deprecations

### Upcoming (2.0.0)
- JSON file storage (migrating to SQLite only)
- Legacy CLI commands (being renamed)

### Removed
- `--no-color` flag (use `NO_COLOR=1` env var)
- `portman config` command (use direct file edit)

## Migration Guides

### From 1.0.x to 1.1.x
```bash
# Backup existing data
portman export backup-1.0.json

# Update Port Keeper
npm update -g portkeeper

# Data migrates automatically
portman list
```

### From JSON to SQLite (pre-1.0)
```bash
# If you have old JSON data
portman import old-ports.json
```

## Release Schedule

- **Patch releases**: As needed for bug fixes
- **Minor releases**: Monthly with new features
- **Major releases**: Yearly with breaking changes

## Support Policy

- **Current version**: Full support
- **Previous minor**: Security fixes only
- **Older versions**: Community support

---

[Unreleased]: https://github.com/ahmadzein/portkeeper/compare/v1.1.10...HEAD
[1.1.10]: https://github.com/ahmadzein/portkeeper/compare/v1.1.9...v1.1.10
[1.1.9]: https://github.com/ahmadzein/portkeeper/compare/v1.1.8...v1.1.9
[1.1.8]: https://github.com/ahmadzein/portkeeper/compare/v1.1.7...v1.1.8
[1.1.7]: https://github.com/ahmadzein/portkeeper/compare/v1.1.6...v1.1.7
[1.1.6]: https://github.com/ahmadzein/portkeeper/compare/v1.1.5...v1.1.6
[1.1.5]: https://github.com/ahmadzein/portkeeper/compare/v1.1.4...v1.1.5
[1.1.4]: https://github.com/ahmadzein/portkeeper/compare/v1.1.3...v1.1.4
[1.1.3]: https://github.com/ahmadzein/portkeeper/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/ahmadzein/portkeeper/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/ahmadzein/portkeeper/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/ahmadzein/portkeeper/compare/v1.0.5...v1.1.0
[1.0.5]: https://github.com/ahmadzein/portkeeper/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/ahmadzein/portkeeper/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/ahmadzein/portkeeper/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/ahmadzein/portkeeper/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/ahmadzein/portkeeper/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/ahmadzein/portkeeper/releases/tag/v1.0.0