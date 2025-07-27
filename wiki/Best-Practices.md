# Best Practices

Guidelines and recommendations for effective port management with Port Keeper.

## 🎯 Port Reservation Strategy

### 1. Reserve Before Use
Always reserve ports before starting your applications:

```bash
# ❌ Bad: Start first, hope for the best
npm start  # Uses port 3000

# ✅ Good: Reserve first, then start
portman check 3000
portman reserve 3000 -n "my-app" -d "React dev server"
npm start
```

### 2. Use Descriptive Names

```bash
# ❌ Bad: Generic names
portman reserve 3000 -n "app"
portman reserve 8080 -n "backend"

# ✅ Good: Specific, identifiable names
portman reserve 3000 -n "ecommerce-frontend" -d "React app for customer portal"
portman reserve 8080 -n "ecommerce-api" -d "REST API for product catalog"
```

### 3. Tag Consistently

Develop a tagging taxonomy:

```bash
# Environment tags
portman reserve 3000 -n "app" -t development staging production

# Technology tags
portman reserve 3000 -n "app" -t react nodejs docker

# Team/Project tags
portman reserve 3000 -n "app" -t team-alpha sprint-23 feature-auth
```

## 📁 Project Organization

### Standard Port Ranges

Establish port ranges for different purposes:

```
3000-3999: Frontend applications
4000-4999: Backend APIs
5000-5999: Microservices
6000-6999: Databases
7000-7999: Message queues
8000-8999: Admin/Tools
9000-9999: Testing
```

### Environment Separation

```bash
# Development
portman reserve 3000 -n "app-dev" -t development

# Staging
portman reserve 4000 -n "app-staging" -t staging

# Local production mirror
portman reserve 5000 -n "app-prod-mirror" -t production-mirror
```

## 🤝 Team Collaboration

### 1. Shared Configuration

Create a team port configuration:

```bash
# Team lead exports configuration
portman export team-ports.json

# Commit to repository
git add team-ports.json
git commit -m "chore: Update team port allocations"
git push

# Team members import
git pull
portman import team-ports.json
```

### 2. Port Documentation

Create a `PORTS.md` in your project:

```markdown
# Port Allocations

## Development Ports
- 3000: Frontend (React)
- 3001: Frontend (Hot Reload)
- 8080: Backend API
- 5432: PostgreSQL
- 6379: Redis

## Testing Ports
- 9000: Test Frontend
- 9080: Test API
- 9432: Test Database

## Reserved Ranges
- 3000-3099: Frontend team
- 8000-8099: Backend team
```

### 3. Naming Conventions

Establish team standards:

```
Format: [project]-[component]-[environment]

Examples:
- ecommerce-frontend-dev
- ecommerce-api-dev
- ecommerce-db-test
- analytics-worker-staging
```

## 🔄 Development Workflow

### 1. Project Setup Script

Create a setup script for new developers:

```bash
#!/bin/bash
# setup-ports.sh

PROJECT="myapp"
PORTS=(3000 8080 5432 6379)
NAMES=("frontend" "api" "postgres" "redis")
DESCS=("React app" "Express API" "Database" "Cache")

echo "Setting up ports for $PROJECT..."

for i in "${!PORTS[@]}"; do
  PORT="${PORTS[$i]}"
  NAME="$PROJECT-${NAMES[$i]}"
  DESC="${DESCS[$i]}"
  
  STATUS=$(portman check $PORT --json | jq -r '.data.status')
  
  if [ "$STATUS" = "free" ]; then
    portman reserve $PORT -n "$NAME" -d "$DESC"
    echo "✅ Reserved port $PORT for $NAME"
  else
    echo "⚠️  Port $PORT is $STATUS"
  fi
done

echo "Setup complete! Run 'portman list -p $PROJECT' to see your ports."
```

### 2. Development Commands

Add to `package.json`:

```json
{
  "scripts": {
    "ports:check": "portman list -p myapp",
    "ports:setup": "./scripts/setup-ports.sh",
    "ports:release": "portman list -p myapp --json | jq -r '.data[].number' | xargs portman release",
    "dev": "npm run ports:check && npm start"
  }
}
```

### 3. Git Hooks

`.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Check for port conflicts before commit

REQUIRED_PORTS=(3000 8080)

for PORT in "${REQUIRED_PORTS[@]}"; do
  STATUS=$(portman check $PORT --json | jq -r '.data.status')
  PROJECT=$(portman check $PORT --json | jq -r '.data.project')
  
  if [ "$STATUS" != "reserved" ] || [ "$PROJECT" != "myapp" ]; then
    echo "❌ Error: Port $PORT is not properly reserved for this project"
    echo "Run: portman reserve $PORT -n myapp"
    exit 1
  fi
done

echo "✅ Port reservations verified"
```

## 🚀 Production Practices

### 1. Export Before Deploy

```bash
# Before deployment, export local config
portman export production-ports.json -p "myapp-prod"

# Document in deployment notes
echo "Port configuration exported: $(date)" >> DEPLOYMENT.md
```

### 2. Monitor Port Usage

Create monitoring script:

```bash
#!/bin/bash
# monitor-ports.sh

while true; do
  ACTIVE=$(portman scan --json | jq '.data | length')
  RESERVED=$(portman list --json | jq '.data | length')
  IN_USE=$(portman list -s in-use --json | jq '.data | length')
  
  echo "[$(date)] Active: $ACTIVE, Reserved: $RESERVED, In Use: $IN_USE"
  
  # Alert if too many ports
  if [ $ACTIVE -gt 50 ]; then
    echo "⚠️  WARNING: High port usage detected!"
  fi
  
  sleep 300  # Check every 5 minutes
done
```

### 3. Cleanup Routine

Regular maintenance:

```bash
# Weekly cleanup script
#!/bin/bash

echo "Port Keeper Maintenance - $(date)"

# Release ports not in use for 30 days
portman list --json | jq -r '.data[] | 
  select(.status == "reserved") | 
  select(.reservedAt | fromdateiso8601 < (now - 2592000)) | 
  .number' | xargs -I {} portman release {}

# Export backup
portman export "backup-$(date +%Y%m%d).json"

# Vacuum database
sqlite3 ~/.portkeeper/database.db "VACUUM;"

echo "Maintenance complete"
```

## 🛡️ Security Practices

### 1. Privileged Ports

For ports below 1024:

```bash
# ❌ Bad: Run everything as root
sudo portman reserve 80 -n "web"

# ✅ Good: Use port forwarding
portman reserve 8080 -n "web-dev"
# Then use nginx/caddy to forward 80 -> 8080
```

### 2. Access Control

Limit port ranges per team:

```bash
# Frontend team: 3000-3999
# Backend team: 8000-8999
# Database team: 5000-5999
```

### 3. Sensitive Services

Tag and document sensitive ports:

```bash
portman reserve 5432 -n "customer-db" -t "sensitive" "production-data" -d "Contains PII - handle with care"
```

## 📊 Reporting and Analytics

### Generate Reports

```bash
#!/bin/bash
# port-report.sh

echo "# Port Usage Report - $(date)"
echo

echo "## Summary"
portman list --json | jq -r '
  .data | 
  group_by(.status) | 
  map({status: .[0].status, count: length}) | 
  .[] | "- \(.status): \(.count)"'

echo
echo "## By Project"
portman list --json | jq -r '
  .data | 
  group_by(.projectName) | 
  map({project: .[0].projectName, ports: map(.number)}) | 
  .[] | "- \(.project): \(.ports | join(", "))"'

echo
echo "## Long-Running Reservations"
portman list --json | jq -r '
  .data | 
  map(select(.reservedAt | fromdateiso8601 < (now - 604800))) |
  .[] | "- Port \(.number): \(.projectName) (reserved \(.reservedAt))"'
```

## 🎓 Training New Team Members

### Onboarding Checklist

1. **Install Port Keeper**
   ```bash
   npm install -g portkeeper
   portman --version
   ```

2. **Import Team Configuration**
   ```bash
   portman import team-ports.json
   ```

3. **Learn Basic Commands**
   ```bash
   portman check 3000
   portman list
   portman reserve 3000 -n "training-app"
   portman release 3000
   ```

4. **Understand Team Conventions**
   - Port ranges
   - Naming standards
   - Tagging taxonomy

5. **Practice Workflow**
   - Setup development environment
   - Reserve required ports
   - Start applications
   - Clean up when done

## 💡 Pro Tips

1. **Alias Common Commands**
   ```bash
   alias pmc="portman check"
   alias pml="portman list"
   alias pmr="portman reserve"
   ```

2. **Use JSON for Automation**
   ```bash
   # Get all ports as array
   PORTS=$(portman list --json | jq -r '.data[].number' | tr '\n' ' ')
   ```

3. **Quick Status Check**
   ```bash
   # Add to shell prompt
   port_status() {
     local reserved=$(portman list -s reserved --json 2>/dev/null | jq '.data | length' 2>/dev/null || echo 0)
     echo "[$reserved ports]"
   }
   PS1='$(port_status) \$ '
   ```

4. **Batch Operations**
   ```bash
   # Release all test ports
   portman list -p test --json | jq -r '.data[].number' | xargs portman release
   ```

5. **Integration with Docker**
   ```yaml
   # docker-compose.yml
   services:
     app:
       ports:
         - "${APP_PORT:-3000}:3000"
   ```
   
   ```bash
   # .env
   APP_PORT=$(portman request 1 -n "docker-app" --json | jq -r '.data.ports[0].number')
   ```

---

Following these practices ensures smooth team collaboration and efficient port management!