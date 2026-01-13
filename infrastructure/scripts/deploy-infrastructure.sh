#!/bin/bash

# =============================================================================
# Team-Boost Azure Infrastructure Deployment Script
# =============================================================================
# This script deploys the Team-Boost infrastructure to Azure using Bicep templates
# Usage: ./deploy-infrastructure.sh <environment> [resource-group-name] [location]
# Example: ./deploy-infrastructure.sh dev teamboost-rg-dev "East US"

set -e  # Exit on any error

# =============================================================================
# Configuration
# =============================================================================

ENVIRONMENT=${1:-dev}
BASE_NAME="teamboost"
RESOURCE_GROUP=${2:-"${BASE_NAME}-rg-${ENVIRONMENT}"}
LOCATION=${3:-"East US"}
SUBSCRIPTION_ID=${AZURE_SUBSCRIPTION_ID}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# =============================================================================
# Functions
# =============================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_team_boost() {
    echo -e "${PURPLE}[TEAM-BOOST]${NC} $1"
}

validate_environment() {
    if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prod" ]]; then
        log_error "Environment must be 'dev' or 'prod'"
        exit 1
    fi
}

validate_azure_cli() {
    if ! command -v az &> /dev/null; then
        log_error "Azure CLI is not installed. Please install it first."
        log_info "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
        exit 1
    fi
}

check_azure_login() {
    if ! az account show &> /dev/null; then
        log_error "Not logged in to Azure. Please run 'az login' first."
        exit 1
    fi
}

set_subscription() {
    if [[ -n "$SUBSCRIPTION_ID" ]]; then
        log_info "Setting subscription to: $SUBSCRIPTION_ID"
        az account set --subscription "$SUBSCRIPTION_ID"
    else
        CURRENT_SUB=$(az account show --query "id" -o tsv)
        log_info "Using current subscription: $CURRENT_SUB"
    fi
}

check_parameters() {
    PARAM_FILE="infrastructure/bicep/parameters.${ENVIRONMENT}.json"

    if [[ ! -f "$PARAM_FILE" ]]; then
        log_error "Parameter file not found: $PARAM_FILE"
        exit 1
    fi

    # Check if placeholder values exist
    if grep -q "YOUR_TENANT_ID_HERE\|YOUR_CLIENT_ID_HERE" "$PARAM_FILE"; then
        log_error "Please update the parameter file with your actual values:"
        log_warning "Edit $PARAM_FILE and replace:"
        echo "  - YOUR_TENANT_ID_HERE with your Microsoft Entra ID Tenant ID"
        echo "  - YOUR_CLIENT_ID_HERE with your Microsoft Entra ID Client ID"
        echo ""
        log_info "You can find these values in the Azure Portal:"
        echo "  1. Go to Microsoft Entra ID > App registrations"
        echo "  2. Select your Team-Boost application"
        echo "  3. Copy the Application (client) ID and Directory (tenant) ID"
        exit 1
    fi

    log_success "Parameter file validation passed"
}

create_resource_group() {
    log_info "Creating resource group: $RESOURCE_GROUP in $LOCATION"

    if az group show --name "$RESOURCE_GROUP" &> /dev/null; then
        log_warning "Resource group $RESOURCE_GROUP already exists"
    else
        az group create \
            --name "$RESOURCE_GROUP" \
            --location "$LOCATION" \
            --tags "Environment=$ENVIRONMENT" "Application=team-boost" "ManagedBy=Bicep"
        log_success "Resource group created successfully"
    fi
}

validate_bicep() {
    log_info "Validating Bicep template for Team-Boost..."

    cd infrastructure/bicep

    az deployment group validate \
        --resource-group "$RESOURCE_GROUP" \
        --template-file "main.bicep" \
        --parameters "@parameters.${ENVIRONMENT}.json" \
        --verbose

    cd ../..

    log_success "Bicep template validation passed"
}

deploy_infrastructure() {
    log_team_boost "Deploying Team-Boost infrastructure for environment: $ENVIRONMENT"

    cd infrastructure/bicep

    DEPLOYMENT_NAME="${BASE_NAME}-deployment-$(date +%Y%m%d-%H%M%S)"

    az deployment group create \
        --resource-group "$RESOURCE_GROUP" \
        --template-file "main.bicep" \
        --parameters "@parameters.${ENVIRONMENT}.json" \
        --name "$DEPLOYMENT_NAME" \
        --verbose

    log_success "Infrastructure deployment completed successfully"

    # Get deployment outputs
    log_info "Retrieving deployment outputs..."

    WEB_APP_URL=$(az deployment group show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$DEPLOYMENT_NAME" \
        --query "properties.outputs.webAppUrl.value" -o tsv)

    COSMOS_CONNECTION=$(az deployment group show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$DEPLOYMENT_NAME" \
        --query "properties.outputs.cosmosDbConnectionString.value" -o tsv)

    INSIGHTS_CONNECTION=$(az deployment group show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$DEPLOYMENT_NAME" \
        --query "properties.outputs.appInsightsConnectionString.value" -o tsv)

    KEY_VAULT_NAME=$(az deployment group show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$DEPLOYMENT_NAME" \
        --query "properties.outputs.keyVaultName.value" -o tsv)

    NEXTAUTH_URL=$(az deployment group show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$DEPLOYMENT_NAME" \
        --query "properties.outputs.nextAuthUrl.value" -o tsv)

    cd ../..

    echo ""
    echo "=============================================="
    echo "        TEAM-BOOST DEPLOYMENT SUMMARY"
    echo "=============================================="
    echo "Environment: $ENVIRONMENT"
    echo "Resource Group: $RESOURCE_GROUP"
    echo "Web App URL: $WEB_APP_URL"
    echo "NextAuth URL: $NEXTAUTH_URL"
    echo "Key Vault: $KEY_VAULT_NAME"
    echo "=============================================="
    echo ""

    log_team_boost "Team-Boost infrastructure is ready!"
    log_info "Next steps:"
    echo "  1. Add your Microsoft Entra ID client secret to Key Vault:"
    echo "     az keyvault secret set --vault-name $KEY_VAULT_NAME --name entra-client-secret --value YOUR_CLIENT_SECRET"
    echo ""
    echo "  2. Update your Microsoft Entra ID app registration:"
    echo "     - Redirect URI: $NEXTAUTH_URL/api/auth/callback/microsoft-entra-id"
    echo "     - Logout URL: $NEXTAUTH_URL"
    echo ""
    echo "  3. Deploy your application code using GitHub Actions or manual deployment"
}

show_usage() {
    echo "Usage: $0 <environment> [resource-group-name] [location]"
    echo ""
    echo "Parameters:"
    echo "  environment         Required. Either 'dev' or 'prod'"
    echo "  resource-group-name Optional. Resource group name (default: teamboost-rg-{env})"
    echo "  location           Optional. Azure region (default: 'East US')"
    echo ""
    echo "Examples:"
    echo "  $0 dev"
    echo "  $0 prod teamboost-prod-rg 'West US 2'"
    echo ""
    echo "Environment Variables:"
    echo "  AZURE_SUBSCRIPTION_ID  Optional. Azure subscription ID to use"
    echo ""
    echo "Prerequisites:"
    echo "  1. Azure CLI installed and configured"
    echo "  2. Logged in to Azure (az login)"
    echo "  3. Microsoft Entra ID app registration created"
    echo "  4. Parameters file updated with your Tenant ID and Client ID"
}

# =============================================================================
# Main Script
# =============================================================================

main() {
    echo ""
    echo "╔════════════════════════════════════════╗"
    echo "║           TEAM-BOOST DEPLOY            ║"
    echo "║      Azure Infrastructure Setup        ║"
    echo "╚════════════════════════════════════════╝"
    echo ""

    # Show usage if no environment provided
    if [[ -z "$1" ]]; then
        show_usage
        exit 1
    fi

    # Validate inputs and prerequisites
    validate_environment
    validate_azure_cli
    check_azure_login
    set_subscription
    check_parameters

    # Execute deployment steps
    create_resource_group
    validate_bicep
    deploy_infrastructure

    log_success "All done! Your Team-Boost infrastructure is ready for collaboration! 🚀"
}

# Run main function with all arguments
main "$@"