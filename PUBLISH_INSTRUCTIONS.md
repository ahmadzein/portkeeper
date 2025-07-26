# NPM Publishing Instructions for Port Manager

## Prerequisites
1. Ensure you have an npm account at https://www.npmjs.com/
2. Make sure you're logged in: `npm login`

## Steps to Publish

1. **Final Build**
   ```bash
   npm run build:npm
   ```

2. **Test the Package Locally**
   ```bash
   # Create a test package
   npm pack
   
   # Test installation in a new directory
   cd /tmp
   npm install /path/to/portkeeper-1.0.0.tgz -g
   portman --version
   ```

3. **Publish to NPM**
   ```bash
   # Publish as public package
   npm publish --access public
   ```

## After Publishing

1. **Verify Installation**
   ```bash
   npm install -g portkeeper
   portman --version
   ```

2. **Update GitHub Repository**
   - Create a release tag: `git tag v1.0.0`
   - Push tags: `git push --tags`
   - Create a GitHub release with GUI binaries

3. **Announce the Release**
   - Update the website
   - Post on social media
   - Notify users

## Package Details
- Name: `portkeeper`
- CLI command: `portman`
- Version: 1.0.0
- License: MIT
- Author: Ahmad Zein
- Repository: https://github.com/ahmadzein/portkeeper

## Important Notes
- The package name is `portkeeper`
- The CLI command is `portman`
- Users will install with: `npm install -g portkeeper`
- But use the CLI with: `portman <command>`
- This name was chosen to avoid conflicts with existing packages

## Troubleshooting
- If you get permission errors, you might need to use `sudo` on macOS/Linux
- If the package name is taken, you can:
  - Use a scoped package: `@ahmadzein/portmanager`
  - Choose a different name
  - Contact npm support if you believe you have rights to the name