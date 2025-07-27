# Port Manager Best Practices

## Table of Contents
- [Port Naming Conventions](#port-naming-conventions)
- [Project Organization](#project-organization)
- [Team Collaboration](#team-collaboration)
- [Development Workflows](#development-workflows)
- [Security Considerations](#security-considerations)
- [Performance Optimization](#performance-optimization)
- [Backup and Recovery](#backup-and-recovery)

## Port Naming Conventions

### Project Names
Use clear, descriptive project names that indicate the purpose:

**✅ Good Examples:**
```bash
portman reserve 3000 --name "customer-portal-frontend"
portman reserve 8080 --name "payment-api-v2"
portman reserve 5432 --name "analytics-postgres-dev"
```

**❌ Avoid:**
```bash
portman reserve 3000 --name "app"
portman reserve 8080 --name "backend"
portman reserve 5432 --name "db"
```

### Description Guidelines
Include technical details in descriptions:

```bash
portman reserve 3000 \
  --name "ecommerce-storefront" \
  --desc "Next.js SSR app with Stripe integration, connects to API on 8080"

portman reserve 8080 \
  --name "ecommerce-api" \
  --desc "GraphQL API (Apollo Server) with Redis cache on 6379"
```

### Tag Conventions
Establish consistent tagging taxonomy:

```bash
# Environment tags
--tags development staging production

# Technology tags
--tags nodejs python docker kubernetes

# Team tags
--tags frontend backend devops qa

# Purpose tags
--tags api database cache websocket

# Combine for clarity
portman reserve 5000 \
  --name "notification-service" \
  --tags backend nodejs websocket production
```

## Project Organization

### Port Ranges by Purpose
Organize ports by service type:

```bash
# Frontend applications: 3000-3999
3000 - Main web app
3100 - Admin panel
3200 - Mobile web app

# Backend APIs: 8000-8999
8080 - REST API
8081 - GraphQL API
8082 - WebSocket server

# Databases: 5000-5999
5432 - PostgreSQL
5433 - PostgreSQL replica
5500 - MongoDB

# Cache & Message Queues: 6000-6999
6379 - Redis
6380 - Redis replica
6672 - RabbitMQ

# Development tools: 9000-9999
9229 - Node.js debugger
9090 - Prometheus
9093 - Alertmanager
```

### Microservices Setup
For microservice architectures:

```bash
# Request sequential ports for related services
portman request \
  --count 5 \
  --name "user-service-cluster" \
  --desc "User, Auth, Profile, Notification, Email services" \
  --tags microservices docker \
  --sequential \
  --start 8100

# Results in:
# 8100 - user-service
# 8101 - auth-service
# 8102 - profile-service
# 8103 - notification-service
# 8104 - email-service
```

### Environment Separation
Keep development and production mirrors separate:

```bash
# Development
portman reserve 3000 --name "app-dev" --tags development
portman reserve 8080 --name "api-dev" --tags development

# Staging
portman reserve 3001 --name "app-staging" --tags staging
portman reserve 8081 --name "api-staging" --tags staging

# Local production mirror
portman reserve 3002 --name "app-prod-mirror" --tags production local
portman reserve 8082 --name "api-prod-mirror" --tags production local
```

## Team Collaboration

### Shared Configuration
Maintain team port configuration in version control:

```bash
# 1. Export current configuration
portman export ./config/team-ports.json

# 2. Add to git
git add config/team-ports.json
git commit -m "Update team port reservations"
git push

# 3. Team members import
git pull
portman import ./config/team-ports.json
```

### Documentation
Create a `PORTS.md` file in your project:

```markdown
# Project Port Allocation

## Development Ports
- 3000: Frontend (React)
- 8080: Backend API (Express)
- 5432: PostgreSQL
- 6379: Redis

## Testing Ports
- 3001: Frontend E2E tests
- 8081: API integration tests

## Import Configuration
```bash
portman import ./config/team-ports.json
```
```

### Conflict Resolution
When conflicts arise:

```bash
# 1. Check who has the port
portman check 3000

# 2. Communicate with team
# "Hey, I need port 3000 for the new feature branch"

# 3. Temporary reassignment
portman release 3000
portman reserve 3000 --name "feature-x-development"

# 4. Document the change
portman export ./config/team-ports-feature-x.json
```

## Development Workflows

### Git Hooks
Add port checks to git hooks:

`.git/hooks/pre-commit`:
```bash
#!/bin/bash
# Ensure ports are properly reserved
required_ports=(3000 8080 5432)

for port in "${required_ports[@]}"; do
  status=$(portman check $port)
  if [[ ! $status =~ "reserved" ]]; then
    echo "Warning: Port $port is not reserved"
  fi
done

# Export current configuration
portman export ./config/current-ports.json
git add ./config/current-ports.json
```

### Docker Integration
`docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    command: >
      sh -c "portman check 3000 || exit 1 &&
             portman reserve 3000 --name 'docker-app' --auto-release &&
             npm start"
  
  cleanup:
    image: alpine
    command: >
      sh -c "trap 'portman release 3000' EXIT &&
             tail -f /dev/null"
```

### npm Scripts
`package.json`:
```json
{
  "scripts": {
    "predev": "portman check 3000 || portman kill 3000",
    "dev": "portman reserve 3000 --name 'my-app' --auto-release && next dev",
    "pretest": "portman request 3 --name 'test-suite' --random",
    "test": "jest",
    "posttest": "portman list --project 'test-suite' | xargs portman release"
  }
}
```

### CI/CD Pipeline
`.github/workflows/test.yml`:
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Port Manager
        run: |
          npm install -g portmanager
          portman --version
      
      - name: Reserve test ports
        run: |
          portman request \
            --count 5 \
            --name "ci-test-${{ github.run_id }}" \
            --random \
            --tags ci test
      
      - name: Run tests
        run: npm test
      
      - name: Cleanup
        if: always()
        run: |
          portman list --project "ci-test-${{ github.run_id }}" | \
          xargs portman release
```

## Security Considerations

### Avoid System Ports
Never use well-known system ports:

```bash
# Create a blacklist
SYSTEM_PORTS="20 21 22 23 25 53 80 443 445 3306 5432"

# Use in requests
portman request \
  --count 10 \
  --name "safe-app" \
  --avoid $SYSTEM_PORTS
```

### Access Control
For shared environments:

```bash
# Tag ports by access level
portman reserve 8080 --name "public-api" --tags public external
portman reserve 8081 --name "internal-api" --tags internal private
portman reserve 8082 --name "admin-api" --tags admin restricted
```

### Firewall Integration
Document firewall requirements:

```bash
# Export ports that need firewall rules
portman list --tags external --json | \
  jq -r '.[] | "ufw allow \(.port)/tcp"' > firewall-rules.sh
```

## Performance Optimization

### Efficient Scanning
For large port ranges:

```bash
# Scan only specific ranges
portman scan --range 3000-4000
portman scan --range 8000-9000

# Avoid full system scan
# portman scan  # Scans all 65535 ports
```

### Database Maintenance
Regular cleanup:

```bash
# Remove old reservations
portman list --status reserved | \
  grep -E "Reserved.*[0-9]{2} days ago" | \
  awk '{print $1}' | \
  xargs portman release

# Compact database
sqlite3 ~/.portmanager/ports.db "VACUUM;"
```

### GUI Performance
For better GUI performance:

1. Use filters aggressively
2. Limit displayed results
3. Close unused views
4. Restart periodically if running for days

## Backup and Recovery

### Automated Backups
Create a backup script:

```bash
#!/bin/bash
# backup-ports.sh

BACKUP_DIR="$HOME/backups/portmanager"
mkdir -p "$BACKUP_DIR"

# Export configuration
portman export "$BACKUP_DIR/ports-$(date +%Y%m%d-%H%M%S).json"

# Backup database
cp ~/.portmanager/ports.db "$BACKUP_DIR/ports-$(date +%Y%m%d-%H%M%S).db"

# Keep only last 30 days
find "$BACKUP_DIR" -name "ports-*.json" -mtime +30 -delete
find "$BACKUP_DIR" -name "ports-*.db" -mtime +30 -delete
```

Add to crontab:
```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup-ports.sh
```

### Disaster Recovery
Recovery procedure:

```bash
# 1. Find latest backup
ls -lt ~/backups/portmanager/

# 2. Restore database
cp ~/backups/portmanager/ports-20250126.db ~/.portmanager/ports.db

# 3. Or restore from JSON
portman import ~/backups/portmanager/ports-20250126.json

# 4. Verify
portman list
```

### Version Control
Track port configurations in git:

```bash
# .gitignore
node_modules/
dist/
*.log

# Track these
!/config/team-ports.json
!/config/production-ports.json
!/docs/PORTS.md
```

## Quick Reference Card

### Essential Commands
```bash
# Daily workflow
portman check 3000              # Quick check
portman reserve 3000 -n "app"   # Reserve
portman list                     # View all
portman scan --reserved          # See active with reservations
portman release 3000             # Free up

# Team collaboration
portman export team-ports.json   # Share config
portman import team-ports.json   # Load config

# Troubleshooting
portman kill 3000                # Force free
portman scan | grep 3000         # Find usage
```

### Shell Aliases
Add to `~/.bashrc` or `~/.zshrc`:

```bash
# Port Manager aliases
alias pm='portmanager'
alias pmc='portmanager check'
alias pmr='portmanager reserve'
alias pml='portmanager list'
alias pms='portmanager scan --reserved'
alias pmk='portmanager kill'
alias pmg='portmanager gui'

# Quick functions
reserve() {
  portmanager reserve $1 --name "${2:-dev}" --desc "${3:-Development}"
}

freeport() {
  portmanager check $1 || portmanager kill $1
}
```

---

Remember: Good port management is about communication, consistency, and documentation. When in doubt, over-document rather than under-document your port usage!