// =============================================================================
// Azure Bicep Template for Team-Boost Application Infrastructure
// =============================================================================
// This template creates Azure infrastructure for the Team-Boost Next.js application
// with environment-based configuration and integration with Microsoft Entra ID.

@description('Environment name (dev or prod)')
@allowed(['dev', 'prod'])
param environment string

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Base name for all resources (will be suffixed with environment)')
@minLength(2)
@maxLength(10)
param baseName string = 'teamboost'

@description('Microsoft Entra ID Tenant ID for authentication integration')
param tenantId string

@description('Microsoft Entra ID Client ID for the application')
param clientId string

@description('App Service Plan SKU configuration')
param appServicePlanSku object = {
  dev: {
    name: 'F1'
    tier: 'Free'
  }
  prod: {
    name: 'F1'
    tier: 'Free'
  }
}

@description('Cosmos DB throughput settings')
param cosmosDbThroughput object = {
  dev: 400
  prod: 1000
}

@description('Custom domain name (optional)')
param customDomain string = ''

// =============================================================================
// Variables
// =============================================================================

var resourceSuffix = '-${environment}'
var appServicePlanName = '${baseName}-plan' // Shared plan for all environments
var webAppName = '${baseName}-app${resourceSuffix}'
var cosmosAccountName = '${baseName}-cosmos${resourceSuffix}'
var cosmosDatabaseName = 'teamboost'
var cosmosContainerName = 'team-items'
var appInsightsName = '${baseName}-insights${resourceSuffix}'
var logAnalyticsName = '${baseName}-logs${resourceSuffix}'
var keyVaultName = '${baseName}-kv${resourceSuffix}'

// NextAuth secret for session management
var nextAuthSecret = guid(resourceGroup().id, environment, 'nextauth-secret')

// Common tags required by Azure Policy
var commonTags = {
  Environment: environment
  Application: 'team-boost'
  CostCenter: '000'
}

// =============================================================================
// Log Analytics Workspace (required for Application Insights)
// =============================================================================

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: environment == 'prod' ? 90 : 30
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
  tags: union(commonTags, { Component: 'monitoring' })
}

// =============================================================================
// Application Insights (optimized for Next.js telemetry)
// =============================================================================

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
    IngestionMode: 'LogAnalytics'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
    // Disable sampling for better Next.js telemetry
    SamplingPercentage: environment == 'prod' ? 20 : 100
  }
  tags: union(commonTags, { Component: 'telemetry' })
}

// =============================================================================
// Key Vault (for secure storage of secrets)
// =============================================================================

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: tenantId
    enableRbacAuthorization: true
    enableSoftDelete: environment == 'prod'
    softDeleteRetentionInDays: environment == 'prod' ? 90 : 7
    networkAcls: {
      defaultAction: 'Allow'
      bypass: 'AzureServices'
    }
  }
  tags: union(commonTags, { Component: 'security' })
}

// =============================================================================
// App Service Plan (Linux-based for Next.js)
// =============================================================================

resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: appServicePlanSku[environment].name
    tier: appServicePlanSku[environment].tier
  }
  kind: 'linux'
  properties: {
    reserved: true // Required for Linux App Service Plans
    zoneRedundant: false // S1 (Standard) tier doesn't support zone redundancy
  }
  tags: union(commonTags, { Component: 'compute' })
}

// =============================================================================
// Cosmos DB Account (for team and collaboration data)
// =============================================================================

resource cosmosDbAccount 'Microsoft.DocumentDB/databaseAccounts@2024-05-15' = {
  name: cosmosAccountName
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session' // Optimal for collaborative apps
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false // Disabled due to regional capacity constraints
      }
    ]
    databaseAccountOfferType: 'Standard'
    enableAutomaticFailover: environment == 'prod' ? true : false
    enableMultipleWriteLocations: false
    // Security settings
    publicNetworkAccess: 'Enabled'
    networkAclBypass: 'AzureServices'
    disableKeyBasedMetadataWriteAccess: false
    // Backup policy for team data protection
    backupPolicy: {
      type: 'Continuous'
      continuousModeProperties: {
        tier: environment == 'prod' ? 'Continuous30Days' : 'Continuous7Days'
      }
    }
    // Enable analytical store for team insights
    enableAnalyticalStorage: false // Not available on all subscription types
  }
  tags: union(commonTags, { Component: 'database' })
}

// =============================================================================
// Cosmos DB Database
// =============================================================================

resource cosmosDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2024-05-15' = {
  parent: cosmosDbAccount
  name: cosmosDatabaseName
  properties: {
    resource: {
      id: cosmosDatabaseName
    }
    options: {
      throughput: cosmosDbThroughput[environment]
    }
  }
}

// =============================================================================
// Cosmos DB Containers for Team-Boost data
// =============================================================================

// Teams container
resource cosmosTeamsContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2024-05-15' = {
  parent: cosmosDatabase
  name: cosmosContainerName
  properties: {
    resource: {
      id: cosmosContainerName
      partitionKey: {
        paths: ['/teamId']
        kind: 'Hash'
      }
      indexingPolicy: {
        indexingMode: 'consistent'
        includedPaths: [
          { path: '/*' }
        ]
        excludedPaths: [
          { path: '/"_etag"/?' }
        ]
      }
      defaultTtl: -1 // No auto-expiry
    }
  }
}

// Sticky notes container
resource cosmosStickyNotesContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2024-05-15' = {
  parent: cosmosDatabase
  name: 'stickynotes'
  properties: {
    resource: {
      id: 'stickynotes'
      partitionKey: {
        paths: ['/teamId']
        kind: 'Hash'
      }
      indexingPolicy: {
        indexingMode: 'consistent'
        includedPaths: [
          { path: '/*' }
        ]
        compositeIndexes: [
          [
            { path: '/teamId', order: 'ascending' }
            { path: '/createdAt', order: 'descending' }
          ]
        ]
      }
      defaultTtl: -1
    }
  }
}

// Users/sessions container
resource cosmosUsersContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2024-05-15' = {
  parent: cosmosDatabase
  name: 'users'
  properties: {
    resource: {
      id: 'users'
      partitionKey: {
        paths: ['/userId']
        kind: 'Hash'
      }
      indexingPolicy: {
        indexingMode: 'consistent'
        includedPaths: [
          { path: '/*' }
        ]
      }
      defaultTtl: 604800 // 7 days for session data
    }
  }
}

// =============================================================================
// Web App (Team-Boost Next.js Application)
// =============================================================================

resource webApp 'Microsoft.Web/sites@2023-12-01' = {
  name: webAppName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    redundancyMode: 'None' // Disabled - some subscriptions don't support Manual redundancy
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts' // Next.js 16 requires Node 20
      alwaysOn: false // Free tier (F1) doesn't support alwaysOn
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      http20Enabled: true
      webSocketsEnabled: true // For real-time collaboration features
      nodeVersion: '20-lts'
      // Custom startup command for Next.js 16 with App Router
      appCommandLine: 'node server.js'
      appSettings: [
        // Next.js configuration
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
        {
          name: 'PORT'
          value: '8080'
        }
        {
          name: 'WEBSITES_PORT'
          value: '8080'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'NEXT_TELEMETRY_DISABLED'
          value: '1'
        }
        // NextAuth.js configuration
        {
          name: 'AUTH_TRUST_HOST'
          value: 'true'
        }
        {
          name: 'NEXTAUTH_URL'
          value: customDomain != '' ? 'https://${customDomain}' : 'https://${webAppName}.azurewebsites.net'
        }
        {
          name: 'NEXTAUTH_SECRET'
          value: nextAuthSecret
        }
        // Microsoft Entra ID configuration
        {
          name: 'AUTH_SECRET'
          value: nextAuthSecret
        }
        {
          name: 'AUTH_MICROSOFT_ENTRA_ID_ID'
          value: clientId
        }
        {
          name: 'AUTH_MICROSOFT_ENTRA_ID_SECRET'
          value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=entra-client-secret)'
        }
        {
          name: 'AUTH_MICROSOFT_ENTRA_ID_TENANT_ID'
          value: tenantId
        }
        // Cosmos DB configuration
        {
          name: 'COSMOS_DB_ENDPOINT'
          value: cosmosDbAccount.properties.documentEndpoint
        }
        {
          name: 'COSMOS_DB_KEY'
          value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=cosmos-primary-key)'
        }
        {
          name: 'COSMOS_DB_DATABASE_NAME'
          value: cosmosDatabaseName
        }
        // Application Insights configuration
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsights.properties.ConnectionString
        }
        {
          name: 'NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsights.properties.ConnectionString
        }
        // Environment-specific settings
        {
          name: 'ENVIRONMENT'
          value: environment
        }
        // Custom domain configuration
        {
          name: 'NEXT_PUBLIC_DOMAIN'
          value: customDomain != '' ? customDomain : '${webAppName}.azurewebsites.net'
        }
      ]
    }
  }
  identity: {
    type: 'SystemAssigned'
  }
  tags: union(commonTags, { Component: 'web-application' })
}

// =============================================================================
// Key Vault Access Policy for Web App
// =============================================================================

resource keyVaultAccessPolicy 'Microsoft.KeyVault/vaults/accessPolicies@2023-07-01' = {
  parent: keyVault
  name: 'add'
  properties: {
    accessPolicies: [
      {
        tenantId: tenantId
        objectId: webApp.identity.principalId
        permissions: {
          secrets: ['get', 'list']
        }
      }
    ]
  }
}

// =============================================================================
// Store Cosmos DB key in Key Vault
// =============================================================================

resource cosmosDbKeySecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'cosmos-primary-key'
  properties: {
    value: cosmosDbAccount.listKeys().primaryMasterKey
  }
  dependsOn: [keyVaultAccessPolicy]
}

// =============================================================================
// Custom Domain Configuration (if provided)
// =============================================================================

resource customDomainBinding 'Microsoft.Web/sites/hostNameBindings@2023-12-01' = if (customDomain != '') {
  parent: webApp
  name: customDomain
  properties: {
    siteName: webApp.name
    hostNameType: 'Verified'
    sslState: 'SniEnabled'
  }
}

// =============================================================================
// Web App Logging Configuration
// =============================================================================

resource webAppLogs 'Microsoft.Web/sites/config@2023-12-01' = {
  parent: webApp
  name: 'logs'
  properties: {
    applicationLogs: {
      fileSystem: {
        level: environment == 'prod' ? 'Warning' : 'Information'
      }
    }
    httpLogs: {
      fileSystem: {
        retentionInMb: 50
        enabled: true
      }
    }
    detailedErrorMessages: {
      enabled: environment != 'prod'
    }
    failedRequestsTracing: {
      enabled: environment != 'prod'
    }
  }
}

// =============================================================================
// Outputs
// =============================================================================

@description('The URL of the Team-Boost web application')
output webAppUrl string = customDomain != '' ? 'https://${customDomain}' : 'https://${webApp.properties.defaultHostName}'

@description('The Cosmos DB connection string')
output cosmosDbConnectionString string = 'AccountEndpoint=${cosmosDbAccount.properties.documentEndpoint};AccountKey=${cosmosDbAccount.listKeys().primaryMasterKey};'

@description('The Application Insights connection string')
output appInsightsConnectionString string = applicationInsights.properties.ConnectionString

@description('The Application Insights instrumentation key')
output appInsightsInstrumentationKey string = applicationInsights.properties.InstrumentationKey

@description('The name of the resource group')
output resourceGroupName string = resourceGroup().name

@description('The Web App name')
output webAppName string = webApp.name

@description('The Cosmos DB account name')
output cosmosDbAccountName string = cosmosDbAccount.name

@description('The Key Vault name')
output keyVaultName string = keyVault.name

@description('NextAuth URL for configuration')
output nextAuthUrl string = customDomain != '' ? 'https://${customDomain}' : 'https://${webApp.properties.defaultHostName}' 
