# Team Collaboration

Effective strategies for using Port Keeper in team environments.

## 🤝 Shared Configuration

### Central Port Registry

Maintain a shared port configuration that all team members use:

```bash
# 1. Team lead creates master configuration
portman export team-ports-master.json

# 2. Commit to repository
git add team-ports-master.json
git commit -m "chore: Update team port allocations"
git push

# 3. Team members sync
git pull
portman import team-ports-master.json --replace
```

### Version Control Integration

Store port configurations alongside your code:

```
project/
├── .git/
├── src/
├── package.json
├── ports.json          # Port Keeper configuration
├── PORTS.md           # Human-readable port documentation
└── scripts/
    └── setup-ports.sh # Automated port setup
```

## 📋 Port Allocation Strategy

### Team-Based Ranges

Assign port ranges to different teams:

```
Frontend Team:    3000-3999
Backend Team:     4000-4999
Services Team:    5000-5999
Database Team:    6000-6999
DevOps Team:      7000-7999
QA Team:          8000-8999
Misc/Shared:      9000-9999
```

### Project-Based Allocation

```
Project Alpha:    3000-3099
Project Beta:     3100-3199
Project Gamma:    3200-3299
Shared Services:  3900-3999
```

## 🏷️ Naming Conventions

### Standard Format

```
[team]-[project]-[component]-[environment]

Examples:
- frontend-ecommerce-react-dev
- backend-ecommerce-api-dev
- services-auth-oauth-staging
- database-users-postgres-test
```

### Tagging Strategy

Use consistent tags for filtering and organization:

```bash
# Environment tags
dev, staging, prod, test

# Technology tags
react, nodejs, python, docker, k8s

# Team tags
team-alpha, team-beta, squad-1

# Feature tags
feature-auth, feature-payment, feature-search
```

## 🔄 Workflow Integration

### 1. Project Onboarding

Create an onboarding script for new team members:

```bash
#!/bin/bash
# onboard-developer.sh

DEVELOPER=$1
TEAM=$2

echo "Setting up Port Keeper for $DEVELOPER (Team: $TEAM)"

# Import team configuration
portman import config/team-ports.json

# Reserve developer-specific ports
case $TEAM in
  "frontend")
    portman reserve 3000 -n "$DEVELOPER-react-dev" -t "dev personal $TEAM"
    portman reserve 3001 -n "$DEVELOPER-storybook" -t "dev personal $TEAM"
    ;;
  "backend")
    portman reserve 4000 -n "$DEVELOPER-api-dev" -t "dev personal $TEAM"
    portman reserve 4001 -n "$DEVELOPER-debug" -t "dev personal $TEAM"
    ;;
esac

echo "Setup complete! Your ports:"
portman list -t "personal"
```

### 2. Daily Standup Integration

```bash
#!/bin/bash
# daily-port-status.sh

echo "=== Port Status for Daily Standup ==="
echo
echo "Active Development Ports:"
portman list -s in-use -t dev --format ascii

echo
echo "Staging Environment:"
portman list -t staging --format ascii

echo
echo "Conflicts or Issues:"
portman scan --reserved | grep -E "(CONFLICT|ERROR)"
```

### 3. Sprint Planning

```bash
# Reserve ports for sprint features
portman request 5 -n "sprint-23-microservices" --sequential -t "sprint-23"

# Document in sprint notes
portman list -t "sprint-23" --json > sprint-23-ports.json
```

## 🔐 Access Control

### Role-Based Port Management

Define roles and responsibilities:

```markdown
# Port Management Roles

## Port Administrator
- Can reserve any port
- Can release any port
- Manages team allocations
- Reviews port usage

## Team Lead
- Can reserve within team range
- Can release team ports
- Reviews team usage

## Developer
- Can reserve personal dev ports
- Can release own ports
- Must follow naming conventions
```

### Automated Checks

```bash
#!/bin/bash
# check-port-permissions.sh

check_permission() {
  local user=$1
  local port=$2
  local team=$3
  
  # Check if port is in team range
  case $team in
    "frontend")
      if [ $port -ge 3000 ] && [ $port -lt 4000 ]; then
        return 0
      fi
      ;;
    "backend")
      if [ $port -ge 4000 ] && [ $port -lt 5000 ]; then
        return 0
      fi
      ;;
  esac
  
  echo "ERROR: $user cannot reserve port $port (outside team range)"
  return 1
}
```

## 📊 Reporting

### Team Usage Reports

```bash
#!/bin/bash
# generate-team-report.sh

generate_report() {
  local team=$1
  local output="reports/port-usage-$team-$(date +%Y%m%d).md"
  
  cat > "$output" <<EOF
# Port Usage Report - $team
Date: $(date)

## Summary
$(portman list -t $team --json | jq -r '.data | length') ports allocated

## Active Ports
$(portman list -t $team -s in-use)

## Reserved (Unused)
$(portman list -t $team -s reserved)

## Recommendations
- Release unused ports older than 30 days
- Consolidate similar services
- Update documentation for new allocations
EOF

  echo "Report generated: $output"
}

# Generate for all teams
for team in frontend backend services database; do
  generate_report $team
done
```

### Conflict Detection

```bash
#!/bin/bash
# detect-conflicts.sh

echo "Checking for port conflicts..."

# Find duplicate reservations
portman list --json | jq -r '.data[] | 
  select(.status == "reserved") | 
  "\(.number) \(.projectName)"' | 
  sort | uniq -d | while read -r line; do
    echo "WARNING: Duplicate reservation detected: $line"
  done

# Find long-unused reservations
portman list --json | jq -r '.data[] |
  select(.status == "reserved") |
  select(.reservedAt | fromdateiso8601 < (now - 2592000)) |
  "Port \(.number): Reserved for \(.projectName) since \(.reservedAt)"'
```

## 🚀 CI/CD Integration

### Jenkins Pipeline

```groovy
pipeline {
    agent any
    
    environment {
        PORT_CONFIG = 'ports.json'
    }
    
    stages {
        stage('Setup Ports') {
            steps {
                script {
                    // Import port configuration
                    sh 'portman import $PORT_CONFIG'
                    
                    // Verify required ports
                    def requiredPorts = [3000, 4000, 5432]
                    requiredPorts.each { port ->
                        def status = sh(
                            script: "portman check ${port} --json | jq -r '.data.status'",
                            returnStdout: true
                        ).trim()
                        
                        if (status != 'reserved') {
                            error "Port ${port} is not properly reserved"
                        }
                    }
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Cleanup') {
            steps {
                // Release test ports
                sh 'portman list -t "ci-test" --json | jq -r ".data[].number" | xargs portman release'
            }
        }
    }
}
```

### GitHub Actions

```yaml
name: Port Verification

on: [push, pull_request]

jobs:
  verify-ports:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Install Port Keeper
      run: npm install -g portkeeper
    
    - name: Import Configuration
      run: portman import ports.json
    
    - name: Verify Port Allocations
      run: |
        # Check all required ports
        for port in 3000 4000 5432 6379; do
          status=$(portman check $port --json | jq -r '.data.status')
          if [ "$status" != "reserved" ]; then
            echo "ERROR: Port $port is not reserved"
            exit 1
          fi
        done
```

## 💬 Communication

### Slack Integration

```javascript
// slack-port-notifier.js
const { WebClient } = require('@slack/web-api');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const slack = new WebClient(process.env.SLACK_TOKEN);
const channel = '#dev-ports';

async function notifyPortChange(action, port, project, user) {
  await slack.chat.postMessage({
    channel,
    text: `Port ${action}: ${port}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Port ${action}*\n• Port: \`${port}\`\n• Project: ${project}\n• User: ${user}`
        }
      }
    ]
  });
}

// Monitor for changes
async function monitorPorts() {
  const { stdout: before } = await execPromise('portman list --json');
  
  setInterval(async () => {
    const { stdout: after } = await execPromise('portman list --json');
    
    if (before !== after) {
      // Detect changes and notify
      const beforeData = JSON.parse(before);
      const afterData = JSON.parse(after);
      
      // Find new reservations
      const newPorts = afterData.data.filter(a => 
        !beforeData.data.find(b => b.number === a.number)
      );
      
      for (const port of newPorts) {
        await notifyPortChange('Reserved', port.number, port.projectName, process.env.USER);
      }
    }
  }, 60000); // Check every minute
}
```

### Email Notifications

```bash
#!/bin/bash
# email-port-summary.sh

RECIPIENTS="team@company.com"
SUBJECT="Weekly Port Usage Summary"

generate_summary() {
  cat <<EOF
Port Keeper Weekly Summary
========================

Total Ports Reserved: $(portman list --json | jq '.data | length')
Active Ports: $(portman list -s in-use --json | jq '.data | length')

By Team:
$(portman list --json | jq -r '.data | group_by(.tags[0]) | map({team: .[0].tags[0], count: length}) | .[] | "- \(.team): \(.count) ports"')

Recent Changes:
$(git log --oneline -n 10 ports.json)

Action Items:
- Review and release unused ports
- Update documentation for new services
- Plan next sprint port allocations
EOF
}

generate_summary | mail -s "$SUBJECT" "$RECIPIENTS"
```

## 📚 Documentation Standards

### Port Documentation Template

```markdown
# Port Allocations - [Project Name]

## Overview
Brief description of the project and its port requirements.

## Port Map

| Port | Service | Description | Owner | Status |
|------|---------|-------------|--------|--------|
| 3000 | Frontend | React development server | @john | Active |
| 4000 | API | Express REST API | @jane | Active |
| 5432 | Database | PostgreSQL | @admin | Active |
| 6379 | Cache | Redis | @admin | Reserved |

## Setup Instructions

1. Import configuration: `portman import ports.json`
2. Verify ports: `portman list -p project-name`
3. Start services: `npm run start:all`

## Troubleshooting

- Port conflicts: Run `portman scan` to identify processes
- Release stuck ports: `portman release [port] --force`

## Change Log

- 2024-01-15: Added Redis cache (port 6379)
- 2024-01-10: Initial port allocation
```

## 🎯 Best Practices Summary

1. **Standardize Everything**: Names, tags, ranges, documentation
2. **Automate Workflows**: Setup scripts, CI/CD integration
3. **Communicate Changes**: Notifications, reports, documentation
4. **Regular Maintenance**: Weekly reviews, cleanup old reservations
5. **Version Control**: Track port configurations with code
6. **Access Control**: Define clear roles and permissions
7. **Monitor Usage**: Regular reports and conflict detection

---

Effective team collaboration with Port Keeper ensures smooth development without port conflicts!