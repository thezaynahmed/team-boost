# Team-Boost Azure Infrastructure

This directory contains Azure Infrastructure as Code (IaC) using Bicep templates for deploying the Team-Boost collaborative application to Azure.

## 🏗️ Infrastructure Overview

Team-Boost uses Azure services optimized for collaborative applications with real-time features and Microsoft Entra ID integration:

- **App Service**: Linux-based hosting for Next.js 16 with App Router
- **Cosmos DB**: NoSQL database for teams, sticky notes, and user data
- **Application Insights**: Performance monitoring and telemetry
- **Key Vault**: Secure storage for secrets and authentication keys
- **Log Analytics**: Centralized logging and monitoring

## 📁 Directory Structure

```
infrastructure/
├── bicep/                    # Bicep templates and parameters
│   ├── main.bicep           # Main infrastructure template
│   ├── parameters.dev.json  # Development environment config
│   └── parameters.prod.json # Production environment config
└── scripts/                 # Deployment scripts
    ├── deploy-infrastructure.sh  # Infrastructure deployment
    └── deploy-app.sh            # Application deployment
```

## 🚀 Quick Start

### Prerequisites

1. **Azure CLI** installed and logged in (`az login`)
2. **Microsoft Entra ID** application registration created
3. **Node.js 20+** for application builds
4. **Contributor** role on Azure subscription

### 1. Configure Parameters

Update the parameter files with your values:

**`bicep/parameters.dev.json` and `bicep/parameters.prod.json`:**

```json
{
  "tenantId": { "value": "your-tenant-id" },
  "clientId": { "value": "your-app-registration-client-id" }
}
```

### 2. Deploy Infrastructure

```bash
# Deploy development environment
./infrastructure/scripts/deploy-infrastructure.sh dev

# Deploy production environment
./infrastructure/scripts/deploy-infrastructure.sh prod
```

### 3. Store Client Secret

After deployment, add your Microsoft Entra ID client secret to Key Vault:

```bash
# Get Key Vault name from deployment output
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

### 5. Configure Microsoft Entra ID

Update your app registration with the deployed URLs:

- **Redirect URI**: `https://teamboost-app-dev.azurewebsites.net/api/auth/callback/microsoft-entra-id`
- **Logout URL**: `https://teamboost-app-dev.azurewebsites.net`

## 🔧 Environment Configuration

### Development Environment

- **App Service Plan**: B1 (Basic)
- **Cosmos DB**: 400 RU/s
- **Features**: Debug logging, detailed errors, no zone redundancy
- **Cost**: ~$15-25/month

### Production Environment

- **App Service Plan**: P1V3 (Premium)
- **Cosmos DB**: 2000 RU/s
- **Features**: Zone redundancy, automatic failover, enhanced backup
- **Cost**: ~$75-100/month

## 📊 Cosmos DB Schema

The infrastructure creates containers optimized for Team-Boost:

### Teams Container
```json
{
  "partitionKey": "/teamId",
  "indexing": "consistent",
  "ttl": -1
}
```

### Sticky Notes Container
```json
{
  "partitionKey": "/teamId",
  "compositeIndexes": [
    ["/teamId", "/createdAt"]
  ],
  "ttl": -1
}
```

### Users Container
```json
{
  "partitionKey": "/userId",
  "ttl": 604800
}
```

## 🔐 Security Configuration

### Key Vault Secrets

- `cosmos-primary-key`: Cosmos DB access key
- `entra-client-secret`: Microsoft Entra ID client secret

### App Service Settings

Environment variables are automatically configured:

- `NEXTAUTH_URL`: Authentication callback URL
- `NEXTAUTH_SECRET`: Session encryption key
- `AUTH_MICROSOFT_ENTRA_ID_*`: Microsoft authentication settings
- `COSMOS_DB_*`: Database connection settings
- `APPLICATIONINSIGHTS_CONNECTION_STRING`: Telemetry settings

## 🚨 GitHub Actions CI/CD

### Automatic Deployment

- **`dev` branch push** → Development environment
- **`main` branch push** → Production environment
- **Pull requests** → Infrastructure validation only

### Required Secrets

Configure these in your GitHub repository settings:

| Secret Name | Description |
|-------------|-------------|
| `AZURE_CLIENT_ID` | Azure Service Principal Client ID |
| `AZURE_TENANT_ID` | Azure AD Tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Azure Subscription ID |
| `TEAMBOOST_CLIENT_ID` | Microsoft Entra ID App Client ID |
| `TEAMBOOST_CLIENT_SECRET` | Microsoft Entra ID App Client Secret |

### Manual Deployment

Use the GitHub Actions workflow dispatch for manual deployments:

1. Go to Actions tab in your repository
2. Select "Deploy Team-Boost Infrastructure and Application"
3. Click "Run workflow"
4. Choose environment (dev/prod)

## 🛠️ Customization

### Adding New Environments

1. Create new parameter file: `parameters.staging.json`
2. Update allowed values in `main.bicep`
3. Add environment to GitHub Actions workflow
4. Update deployment scripts

### Custom Domains

Update `parameters.prod.json`:

```json
{
  "customDomain": {
    "value": "teamboost.yourcompany.com"
  }
}
```

### Scaling Options

Modify `appServicePlanSku` in parameter files:

```json
{
  "prod": {
    "name": "P2V3",
    "tier": "PremiumV3"
  }
}
```

## 📈 Monitoring and Observability

### Application Insights Features

- **Real-time metrics**: Track active users and collaboration
- **Custom events**: Team creation, note additions, user interactions
- **Performance monitoring**: Page load times, API response times
- **Error tracking**: Exceptions and failed requests

### Log Analytics Queries

Useful KQL queries for Team-Boost monitoring:

```kusto
// Active collaboration sessions
traces
| where message contains "team_collaboration"
| summarize count() by bin(timestamp, 1h)

// Most active teams
customEvents
| where name == "team_activity"
| summarize count() by tostring(customDimensions.teamId)
| top 10 by count_

// Authentication errors
traces
| where severityLevel >= 2
| where message contains "auth"
| project timestamp, message, severityLevel
```

## 🐛 Troubleshooting

### Common Issues

1. **Parameter validation errors**
   - Check tenant ID and client ID values
   - Ensure Microsoft Entra ID app is properly configured

2. **Authentication failures**
   - Verify redirect URIs match deployed URLs
   - Check client secret in Key Vault

3. **Cosmos DB connection issues**
   - Verify firewall settings
   - Check access keys in Key Vault

4. **Deployment failures**
   - Ensure resource names are globally unique
   - Check Azure subscription limits

### Validation Commands

```bash
# Validate Bicep template
cd infrastructure/bicep
az deployment group validate \
  --resource-group teamboost-rg-dev \
  --template-file main.bicep \
  --parameters @parameters.dev.json

# Check deployment status
az deployment group list \
  --resource-group teamboost-rg-dev \
  --query "[0].properties.provisioningState"

# Test application health
curl https://teamboost-app-dev.azurewebsites.net/api/health
```

## 🔄 Maintenance

### Regular Tasks

1. **Monthly**: Review Application Insights for performance trends
2. **Quarterly**: Evaluate Cosmos DB usage and scaling needs
3. **Bi-annually**: Update Node.js runtime version
4. **As needed**: Rotate authentication secrets

### Backup and Recovery

- **Cosmos DB**: Automatic continuous backup (7-30 days retention)
- **Application Code**: Stored in Git repository
- **Configuration**: Infrastructure as Code in this repository

For disaster recovery procedures, see the [Team-Boost Operations Guide](../docs/operations.md).

## 📚 Additional Resources

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure Cosmos DB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [Microsoft Entra ID Authentication](https://docs.microsoft.com/en-us/azure/active-directory/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Team-Boost Application Documentation](../README.md)