# Contributing

We love your input! We want to make contributing to Port Keeper as easy and transparent as possible.

## 🎯 Ways to Contribute

- Report bugs
- Discuss the current state of the code
- Submit fixes
- Propose new features
- Improve documentation
- Write tutorials

## 🛠️ Development Process

We use GitHub to host code, track issues and feature requests, and accept pull requests.

### 1. Fork the Repository

```bash
# Fork via GitHub UI, then clone
git clone https://github.com/YOUR_USERNAME/portkeeper.git
cd portkeeper

# Add upstream remote
git remote add upstream https://github.com/ahmadzein/portkeeper.git
```

### 2. Create a Branch

```bash
# Update your fork
git fetch upstream
git checkout master
git merge upstream/master

# Create feature branch
git checkout -b feature/amazing-feature
```

### 3. Make Changes

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Make your changes
code .
```

### 4. Test Your Changes

```bash
# Run tests
npm test

# Run linting
npm run lint

# Test CLI commands
npm run build
node dist/cli/index.js check 3000

# Test GUI
npm run dev:gui
```

### 5. Commit Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add amazing feature

Detailed description of what changed and why"
```

#### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Changes to build process or auxiliary tools

**Examples:**
```
feat(cli): add support for port ranges in scan command

fix(gui): resolve memory leak in port list component

docs: update installation instructions for Windows
```

### 6. Push Changes

```bash
git push origin feature/amazing-feature
```

### 7. Open Pull Request

1. Go to your fork on GitHub
2. Click "New pull request"
3. Select your feature branch
4. Fill out the PR template
5. Submit!

## 📋 Pull Request Guidelines

### PR Title Format

```
<type>: <description>
```

Examples:
- `feat: add Docker container support`
- `fix: resolve port scanning timeout on Windows`
- `docs: add Chinese translation`

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Manual testing completed

## Screenshots (if applicable)

## Checklist
- [ ] Code follows project style
- [ ] Self-reviewed code
- [ ] Updated documentation
- [ ] No breaking changes
```

## 🏗️ Project Structure

```
portkeeper/
├── src/
│   ├── cli/          # CLI implementation
│   ├── gui/          # Electron app
│   └── core/         # Shared logic
├── tests/            # Test files
├── docs/             # Documentation
└── scripts/          # Build scripts
```

## 💻 Development Setup

### Prerequisites

- Node.js 16+ and npm 7+
- Git
- SQLite3
- Python (for node-gyp)

### Environment Setup

```bash
# Clone repository
git clone https://github.com/ahmadzein/portkeeper.git
cd portkeeper

# Install dependencies
npm install

# Build project
npm run build

# Run tests
npm test
```

### Development Commands

```bash
# Watch mode for CLI
npm run dev:cli

# Development GUI
npm run dev:gui

# Run all tests
npm test

# Run specific test
npm test -- --grep "PortService"

# Linting
npm run lint
npm run lint:fix

# Type checking
npm run typecheck

# Build all
npm run build
```

## 🧪 Testing Guidelines

### Writing Tests

```typescript
// tests/unit/services/PortService.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { PortService } from '../../../src/core/services/PortService';

describe('PortService', () => {
  let service: PortService;
  
  beforeEach(() => {
    service = new PortService();
  });
  
  describe('checkPort', () => {
    it('should return free status for available port', async () => {
      const result = await service.checkPort(3000);
      expect(result.status).toBe('free');
    });
  });
});
```

### Test Coverage

```bash
# Generate coverage report
npm run test:coverage

# View coverage
open coverage/index.html
```

### E2E Testing

```bash
# Run E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui
```

## 🎨 Code Style

### TypeScript Style

```typescript
// Use explicit types
function reservePort(port: number, project: string): Promise<Port> {
  // Implementation
}

// Use interfaces for objects
interface PortOptions {
  port: number;
  project: string;
  description?: string;
  tags?: string[];
}

// Use enums for constants
enum PortStatus {
  Free = 'free',
  Reserved = 'reserved',
  InUse = 'in-use'
}
```

### React Components

```typescript
// Functional components with TypeScript
interface PortListProps {
  ports: Port[];
  onSelect: (port: Port) => void;
}

export const PortList: React.FC<PortListProps> = ({ ports, onSelect }) => {
  return (
    <div className="port-list">
      {ports.map(port => (
        <PortItem key={port.number} port={port} onClick={() => onSelect(port)} />
      ))}
    </div>
  );
};
```

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Tests: `*.test.ts` or `*.spec.ts`
- Styles: `*.module.css`

## 📚 Documentation

### Code Comments

```typescript
/**
 * Reserves a port for a specific project
 * @param port - The port number to reserve
 * @param options - Reservation options
 * @returns Promise resolving to the reserved Port object
 * @throws {PortError} If port is already in use
 */
export async function reservePort(
  port: number,
  options: PortOptions
): Promise<Port> {
  // Implementation
}
```

### README Updates

When adding features, update:
- Feature list
- Installation instructions (if needed)
- Usage examples
- CLI command reference

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
1. Run command '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
 - OS: [e.g. macOS 14.0]
 - Node version: [e.g. 18.17.0]
 - Port Keeper version: [e.g. 1.1.10]

**Additional context**
Any other relevant information
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Description of the problem

**Describe the solution**
What you want to happen

**Alternatives considered**
Other solutions you've thought about

**Additional context**
Any other information or screenshots
```

## 🔒 Security

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Email: security@portkeeper.dev

Include:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🌟 Recognition

Contributors are recognized in:
- [CONTRIBUTORS.md](https://github.com/ahmadzein/portkeeper/blob/master/CONTRIBUTORS.md)
- GitHub contributors page
- Release notes

## 📞 Getting Help

- Read the [documentation](https://github.com/ahmadzein/portkeeper/wiki)
- Check [existing issues](https://github.com/ahmadzein/portkeeper/issues)
- Join our [Discord](https://discord.gg/portkeeper)
- Ask in [Discussions](https://github.com/ahmadzein/portkeeper/discussions)

## ✅ Code Review Process

1. **Automated Checks**: CI runs tests, linting, type checking
2. **Code Review**: Maintainer reviews code
3. **Testing**: Manual testing if needed
4. **Feedback**: Address review comments
5. **Merge**: Once approved and tests pass

## 🚀 Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Run `npm run build`
4. Create git tag
5. Push to GitHub
6. CI publishes to npm
7. Create GitHub release

---

Thank you for contributing to Port Keeper! 🎉