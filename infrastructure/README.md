# Team-Boost Azure Infrastructure

This directory contains Azure Infrastructure as Code (IaC) using Bicep templates for deploying the Team-Boost collaborative application to Azure.

## 🏗️ Infrastructure Overview

Team-Boost uses Azure services optimized for collaborative applications with real-time features and Microsoft Entra ID integration:

| Service | Purpose |
|---------|---------|
| **App Service** | Linux-based hosting for Next.js with Node.js 20 LTS |
| **Cosmos DB** | NoSQL database for teams, sticky notes, and user sessions |
| **Application Insights** | Performance monitoring and telemetry |
| **Key Vault** | Secure storage for secrets (Entra client secret, Cosmos DB keys) |
| **Log Analytics** | Centralized logging and monitoring workspace |

## 📁 Directory Structure

```
infrastructure/
├── README.md                         # This file
├── bicep/                            # Bicep templates and parameters
│   ├── main.bicep                    # Main infrastructure template (519 lines)
│   ├── parameters.dev.json           # Development environment parameters
│   └── parameters.prod.json          # Production environment parameters
└── scripts/                          # Deployment and utility scripts
    ├── deploy-infrastructure.sh      # Infrastructure deployment script
    ├── deploy-app.sh                 # Application deployment script
    └── manage-auth-secrets.sh        # Entra ID client secret management
```

### File Details

#### `bicep/main.bicep`
The main Bicep template (15.8 KB, 519 lines) that provisions all Azure resources:

| Resource | Type | Description |
|----------|------|-------------|
| `logAnalyticsWorkspace` | Log Analytics | Centralized logging (30-90 day retention) |
| `applicationInsights` | App Insights | Connected to Log Analytics workspace |
| `keyVault` | Key Vault | RBAC-enabled, stores secrets |
| `appServicePlan` | App Service Plan | Linux-based, shared across environments |
| `cosmosDbAccount` | Cosmos DB | Session consistency, continuous backup |
| `cosmosDatabase` | SQL Database | Named `teamboost` |
| `cosmosTeamsContainer` | Container | Teams data, partitioned by `/teamId` |
| `cosmosStickyNotesContainer` | Container | Sticky notes with composite indexes |
| `cosmosUsersContainer` | Container | User sessions (7-day TTL) |
| `webApp` | Web App | Next.js app with WebSockets enabled |
| `webAppLogs` | Logging Config | HTTP logs, error details by environment |
| `cosmosDbKeySecret` | Key Vault Secret | Cosmos DB primary key storage |
| `customDomainBinding` | Host Binding | Optional custom domain support |

#### `bicep/parameters.dev.json` & `parameters.prod.json`
Environment-specific parameter files with:

| Parameter | Dev Value | Prod Value |
|-----------|-----------|------------|
| `environment` | `dev` | `prod` |
| `baseName` | `teamboost` | `teamboost` |
| `location` | `East US` | `East US` |
| `appServicePlanSku` | F1 (Free) | F1 (Free) |
| `cosmosDbThroughput` | 400 RU/s | 2000 RU/s |
| `tenantId` | *Your value* | *Your value* |
| `clientId` | *Your value* | *Your value* |

#### `scripts/deploy-infrastructure.sh`
Bash script (267 lines) with functions for:
- `validate_environment` - Checks dev/prod parameter
- `validate_azure_cli` - Ensures Azure CLI is installed
- `check_azure_login` - Verifies Azure session
- `set_subscription` - Sets active subscription
- `check_parameters` - Validates parameter files
- `create_resource_group` - Creates resource group if needed
- `validate_bicep` - Validates Bicep syntax
- `deploy_infrastructure` - Deploys the Bicep template

#### `scripts/deploy-app.sh`
Bash script (276 lines) with functions for:
- `validate_inputs` - Validates required arguments
- `check_prerequisites` - Checks Node.js 20+, npm, Azure CLI
- `install_dependencies` - Runs `npm ci`
- `build_application` - Builds Next.js with standalone output
- `deploy_to_azure` - Zips and deploys to App Service
- `cleanup` - Removes temporary build files

#### `scripts/manage-auth-secrets.sh`
Bash script (45 lines) that:
- Checks if `entra-client-secret` exists in Key Vault
- Generates new Entra ID client secret if missing
- Stores the secret in Key Vault automatically

## 🚀 Quick Start

### Prerequisites

1. **Azure CLI** installed and logged in (`az login`)
2. **Microsoft Entra ID** application registration created
3. **Node.js 20+** for application builds
4. **Contributor** role on Azure subscription

### 1. Configure Parameters

Update the parameter files with your Entra ID values:

```bash
# Edit parameters for your environment
code infrastructure/bicep/parameters.dev.json
code infrastructure/bicep/parameters.prod.json
```

Update these values in both files:

```json
{
  "tenantId": { "value": "your-azure-tenant-id" },
  "clientId": { "value": "your-entra-app-registration-client-id" }
}
```

### 2. Deploy Infrastructure

```bash
# Make scripts executable
chmod +x infrastructure/scripts/*.sh

# Deploy development environment
./infrastructure/scripts/deploy-infrastructure.sh dev

# Deploy production environment
./infrastructure/scripts/deploy-infrastructure.sh prod
```

### 3. Store Client Secret

After deployment, add your Microsoft Entra ID client secret to Key Vault:

```bash
# Option 1: Use the automated script (generates new secret)
AZURE_KEY_VAULT_NAME=teamboost-kv-dev \
TEAMBOOST_CLIENT_ID=your-client-id \
./infrastructure/scripts/manage-auth-secrets.sh

# Option 2: Manually set existing secret
az keyvault secret set \
  --vault-name teamboost-kv-dev \
  --name entra-client-secret \
  --value "YOUR_CLIENT_SECRET"
```

### 4. Deploy Application

```bash
# From your Team-Boost app root directory
./infrastructure/scripts/deploy-app.sh dev teamboost-rg-dev teamboost-app-dev
```

### 5. Configure Microsoft Entra ID Redirect URIs

Update your app registration with the deployed URLs:

| Setting | Development | Production |
|---------|-------------|------------|
| **Redirect URI** | `https://teamboost-app-dev.azurewebsites.net/api/auth/callback/microsoft-entra-id` | `https://teamboost-app-prod.azurewebsites.net/api/auth/callback/microsoft-entra-id` |
| **Logout URL** | `https://teamboost-app-dev.azurewebsites.net` | `https://teamboost-app-prod.azurewebsites.net` |

## 🏗️ Architecture

### Resource Naming Convention

All resources follow the pattern: `{baseName}-{component}-{environment}`

```
teamboost-rg-dev          # Resource Group
teamboost-plan            # App Service Plan (shared)
teamboost-app-dev         # Web App
teamboost-cosmos-dev      # Cosmos DB Account
teamboost-kv-dev          # Key Vault
teamboost-insights-dev    # Application Insights
teamboost-logs-dev        # Log Analytics Workspace
```

### Environment Comparison

| Feature | Development | Production |
|---------|-------------|------------|
| App Service Plan | F1 (Free) | F1 (Free)* |
| Cosmos DB Throughput | 400 RU/s | 2000 RU/s |
| Log Retention | 30 days | 90 days |
| Soft Delete | 7 days | 90 days |
| Detailed Errors | Enabled | Disabled |
| Sampling | 100% | 20% |
| Automatic Failover | Disabled | Enabled |
| Backup Policy | Continuous 7 Days | Continuous 30 Days |

*Upgrade to S1/P1V3 for production workloads

## 📊 Cosmos DB Schema

### Database: `teamboost`

| Container | Partition Key | TTL | Purpose |
|-----------|---------------|-----|---------|
| `team-items` | `/teamId` | None | Team data and metadata |
| `stickynotes` | `/teamId` | None | Sticky notes with timestamps |
| `users` | `/userId` | 7 days | User sessions and auth data |

### Indexing Strategy

**team-items & stickynotes containers:**
```json
{
  "indexingMode": "consistent",
  "includedPaths": [{ "path": "/*" }],
  "excludedPaths": [{ "path": "/\"_etag\"/?" }]
}
```

**stickynotes container additional indexes:**
```json
{
  "compositeIndexes": [[
    { "path": "/teamId", "order": "ascending" },
    { "path": "/createdAt", "order": "descending" }
  ]]
}
```

## 🔐 Security Configuration

### Key Vault Secrets

| Secret Name | Description | Auto-populated |
|-------------|-------------|----------------|
| `cosmos-primary-key` | Cosmos DB primary access key | ✅ Yes (via Bicep) |
| `entra-client-secret` | Microsoft Entra ID client secret | ❌ Manual or script |

### Web App Environment Variables

The Bicep template configures these app settings automatically:

| Variable | Source |
|----------|--------|
| `NEXTAUTH_URL` | Computed from app name |
| `NEXTAUTH_SECRET` | Generated GUID |
| `AUTH_SECRET` | Same as NEXTAUTH_SECRET |
| `AUTH_MICROSOFT_ENTRA_ID_ID` | From parameters |
| `AUTH_MICROSOFT_ENTRA_ID_SECRET` | Key Vault reference |
| `AUTH_MICROSOFT_ENTRA_ID_TENANT_ID` | From parameters |
| `COSMOS_DB_ENDPOINT` | Cosmos DB resource |
| `COSMOS_DB_KEY` | Key Vault reference |
| `COSMOS_DB_DATABASE_NAME` | `teamboost` |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | App Insights resource |

### Managed Identity

Web Apps use System Assigned Managed Identity with Key Vault access policies for secrets.

## 🚨 GitHub Actions CI/CD

### Automatic Deployment Triggers

| Trigger | Environment |
|---------|-------------|
| Push to `dev` branch | Development |
| Push to `main` branch | Production |
| Pull Request | Validation only |

### Required Repository Secrets

| Secret | Description |
|--------|-------------|
| `AZURE_CLIENT_ID` | Azure Service Principal Client ID |
| `AZURE_TENANT_ID` | Azure AD Tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Azure Subscription ID |
| `TEAMBOOST_CLIENT_ID` | Entra ID App Client ID |
| `TEAMBOOST_CLIENT_SECRET` | Entra ID App Client Secret |

### Manual Workflow Dispatch

1. Go to **Actions** tab in GitHub
2. Select **Deploy Team-Boost Infrastructure and Application**
3. Click **Run workflow**
4. Choose environment (`dev` or `prod`)

## 🛠️ Customization

### Adding a Staging Environment

1. Create `parameters.staging.json`:
```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "environment": { "value": "staging" },
    "baseName": { "value": "teamboost" },
    ...
  }
}
```

2. Update `main.bicep` allowed values:
```bicep
@allowed(['dev', 'staging', 'prod'])
param environment string
```

### Custom Domain Configuration

Update your parameter file:

```json
{
  "customDomain": { "value": "teamboost.yourcompany.com" }
}
```

The Bicep template will automatically:
- Create hostname binding
- Update `NEXTAUTH_URL` and `NEXT_PUBLIC_DOMAIN`

### Scaling for Production

Upgrade App Service Plan in `parameters.prod.json`:

```json
{
  "appServicePlanSku": {
    "value": {
      "prod": {
        "name": "P1V3",
        "tier": "PremiumV3"
      }
    }
  }
}
```

Increase Cosmos DB throughput:

```json
{
  "cosmosDbThroughput": {
    "value": {
      "prod": 10000
    }
  }
}
```

## 📈 Monitoring and Observability

### Application Insights Dashboards

Access metrics at: `Azure Portal > Application Insights > teamboost-insights-{env}`

**Key Metrics:**
- Active users and sessions
- Request performance (P50, P95, P99)
- Dependency calls (Cosmos DB, external APIs)
- Failed requests and exceptions

### Useful Log Analytics Queries

```kusto
// Real-time collaboration sessions
traces
| where message contains "team_collaboration"
| summarize SessionCount = count() by bin(timestamp, 1h)
| render timechart

// Most active teams
customEvents
| where name == "team_activity"
| summarize Activities = count() by tostring(customDimensions.teamId)
| top 10 by Activities
| render columnchart

// Authentication issues
traces
| where severityLevel >= 2
| where message contains "auth" or message contains "Entra"
| project timestamp, message, severityLevel

// Cosmos DB performance
dependencies
| where type == "Azure DocumentDB"
| summarize avg(duration), percentile(duration, 95) by bin(timestamp, 5m)
| render timechart
```

## 🐛 Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Parameter validation errors | Invalid tenant/client ID | Verify values in Azure Portal > Entra ID |
| Authentication failures | Redirect URI mismatch | Update app registration URIs |
| Key Vault access denied | RBAC propagation delay | Wait 5-10 minutes after deployment |
| Cosmos DB connection issues | Firewall or key issues | Check Key Vault secret, verify public access |
| `SubscriptionIsOverQuotaForSku` | Too many App Service Plans | Delete unused plans or use shared plan |
| "Resource state is not Online" | Recent deletion | Wait 5-10 minutes, re-deploy |

### Validation Commands

```bash
# Validate Bicep template syntax
az bicep build --file infrastructure/bicep/main.bicep

# Validate deployment (what-if)
az deployment group what-if \
  --resource-group teamboost-rg-dev \
  --template-file infrastructure/bicep/main.bicep \
  --parameters @infrastructure/bicep/parameters.dev.json

# Check deployment status
az deployment group list \
  --resource-group teamboost-rg-dev \
  --query "[0].{Name:name, State:properties.provisioningState}" \
  --output table

# Test application health
curl -s https://teamboost-app-dev.azurewebsites.net/api/health | jq

# View Web App logs
az webapp log tail --name teamboost-app-dev --resource-group teamboost-rg-dev
```

### Debugging Key Vault Access

```bash
# Check Web App Managed Identity
az webapp identity show \
  --name teamboost-app-dev \
  --resource-group teamboost-rg-dev

# List Key Vault access policies
az keyvault show \
  --name teamboost-kv-dev \
  --query "properties.accessPolicies"

# Test secret retrieval
az keyvault secret show \
  --vault-name teamboost-kv-dev \
  --name entra-client-secret
```

## 🔄 Maintenance

### Regular Tasks

| Frequency | Task |
|-----------|------|
| Weekly | Review Application Insights for errors |
| Monthly | Check Cosmos DB RU consumption |
| Quarterly | Update Node.js runtime version |
| Bi-annually | Rotate Entra ID client secret |
| As needed | Review and purge old Log Analytics data |

### Secret Rotation

```bash
# Generate new client secret
./infrastructure/scripts/manage-auth-secrets.sh

# Or manually rotate
az ad app credential reset \
  --id YOUR_CLIENT_ID \
  --append \
  --display-name "Rotated-$(date +%Y%m%d)" \
  --years 2

# Update Key Vault
az keyvault secret set \
  --vault-name teamboost-kv-dev \
  --name entra-client-secret \
  --value "NEW_SECRET_VALUE"
```

### Backup and Recovery

| Resource | Backup Method | Retention |
|----------|---------------|-----------|
| Cosmos DB | Continuous backup | 7-30 days (by env) |
| App Configuration | Git repository | Unlimited |
| Key Vault Secrets | Soft delete + purge protection | 7-90 days (by env) |

## 📚 Additional Resources

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure Cosmos DB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [Microsoft Entra ID for Developers](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [Azure Bicep Documentation](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/)
- [NextAuth.js Azure AD Provider](https://next-auth.js.org/providers/azure-ad)
- [Team-Boost Application Documentation](../README.md)

---

**Last Updated:** January 2026  
**Bicep Template Version:** 1.0.0  
**Supported Environments:** dev, prod