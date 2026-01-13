#!/bin/bash

# =============================================================================
# Team-Boost Application Deployment Script
# =============================================================================
# This script builds and deploys the Team-Boost Next.js application to Azure App Service
# Usage: ./deploy-app.sh <environment> [resource-group] [app-name]
# Example: ./deploy-app.sh dev teamboost-rg-dev teamboost-app-dev

set -e  # Exit on any error

# =============================================================================
# Configuration
# =============================================================================

ENVIRONMENT=${1:-dev}
RESOURCE_GROUP=${2}
APP_NAME=${3}
BUILD_DIR="deployment"

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

validate_inputs() {
    if [[ -z "$RESOURCE_GROUP" ]]; then
        log_error "Resource group name is required"
        show_usage
        exit 1
    fi

    if [[ -z "$APP_NAME" ]]; then
        log_error "App name is required"
        show_usage
        exit 1
    fi

    if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prod" ]]; then
        log_error "Environment must be 'dev' or 'prod'"
        exit 1
    fi
}

check_prerequisites() {
    # Check if we're in the app root directory
    if [[ ! -f "package.json" ]]; then
        log_error "package.json not found. Please run this script from your Team-Boost app root directory."
        exit 1
    fi

    # Check if it's a Team-Boost app
    if ! grep -q '"name": "team-boost"' package.json; then
        log_error "This doesn't appear to be the Team-Boost application."
        exit 1
    fi

    # Check Node.js (Team-Boost requires Node 20+)
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi

    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [[ $NODE_VERSION -lt 20 ]]; then
        log_error "Node.js 20 or higher is required for Team-Boost (found: $(node --version))"
        exit 1
    fi

    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi

    # Check Azure CLI
    if ! command -v az &> /dev/null; then
        log_error "Azure CLI is not installed"
        exit 1
    fi

    # Check Azure login
    if ! az account show &> /dev/null; then
        log_error "Not logged in to Azure. Please run 'az login' first."
        exit 1
    fi
}

install_dependencies() {
    log_team_boost "Installing Team-Boost dependencies..."

    npm ci

    log_success "Dependencies installed successfully"
}

build_application() {
    log_team_boost "Building Team-Boost application for $ENVIRONMENT environment..."

    # Set environment variables for build
    export NODE_ENV=$([[ "$ENVIRONMENT" == "prod" ]] && echo "production" || echo "development")
    export ENVIRONMENT=$ENVIRONMENT

    # Clean previous build
    rm -rf .next $BUILD_DIR

    # Build the Team-Boost application
    npm run build

    # Create deployment package
    mkdir -p $BUILD_DIR

    # Copy Next.js 16 standalone build (App Router optimized)
    if [[ -d ".next/standalone" ]]; then
        log_info "Using Next.js standalone build..."
        cp -r .next/standalone/* $BUILD_DIR/
        cp -r .next/static $BUILD_DIR/.next/
        [[ -d "public" ]] && cp -r public $BUILD_DIR/
    else
        # Fallback to standard build
        log_info "Using standard Next.js build..."
        cp -r .next $BUILD_DIR/
        [[ -d "public" ]] && cp -r public $BUILD_DIR/
        cp package*.json $BUILD_DIR/
    fi

    # Copy configuration files
    [[ -f "next.config.ts" ]] && cp next.config.ts $BUILD_DIR/
    [[ -f "next.config.js" ]] && cp next.config.js $BUILD_DIR/

    # Create startup script for Azure App Service
    cat > $BUILD_DIR/startup.sh << 'EOF'
#!/bin/bash
cd /home/site/wwwroot
if [ -f "server.js" ]; then
    # Standalone mode
    node server.js
else
    # Standard mode
    npm install --production
    npm start
fi
EOF
    chmod +x $BUILD_DIR/startup.sh

    log_success "Team-Boost application built successfully"
}

deploy_to_azure() {
    log_team_boost "Deploying Team-Boost to Azure App Service: $APP_NAME"

    # Create deployment package
    cd $BUILD_DIR
    zip -r ../team-boost-deployment.zip . > /dev/null
    cd ..

    # Deploy using Azure CLI
    az webapp deployment source config-zip \
        --resource-group "$RESOURCE_GROUP" \
        --name "$APP_NAME" \
        --src team-boost-deployment.zip

    log_success "Team-Boost deployed successfully"

    # Get the app URL
    APP_URL=$(az webapp show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$APP_NAME" \
        --query "defaultHostName" -o tsv)

    echo ""
    echo "=============================================="
    echo "     TEAM-BOOST DEPLOYMENT COMPLETED"
    echo "=============================================="
    echo "Environment: $ENVIRONMENT"
    echo "App Service: $APP_NAME"
    echo "URL: https://$APP_URL"
    echo "=============================================="
    echo ""

    log_team_boost "Your Team-Boost application is now live! 🚀"
    log_info "Don't forget to:"
    echo "  1. Update your Microsoft Entra ID app registration with the new URL"
    echo "  2. Test the authentication flow"
    echo "  3. Verify all collaborative features are working"
}

cleanup() {
    log_info "Cleaning up temporary files..."

    rm -rf $BUILD_DIR team-boost-deployment.zip 2>/dev/null || true

    log_success "Cleanup completed"
}

show_usage() {
    echo "Usage: $0 <environment> <resource-group> <app-name>"
    echo ""
    echo "Parameters:"
    echo "  environment      Required. Either 'dev' or 'prod'"
    echo "  resource-group   Required. Azure resource group name"
    echo "  app-name         Required. Azure App Service name"
    echo ""
    echo "Examples:"
    echo "  $0 dev teamboost-rg-dev teamboost-app-dev"
    echo "  $0 prod teamboost-rg-prod teamboost-app-prod"
    echo ""
    echo "Prerequisites:"
    echo "  - Node.js 20+ and npm installed"
    echo "  - Azure CLI installed and logged in"
    echo "  - Run from Team-Boost application root directory"
    echo "  - Infrastructure already deployed"
}

# =============================================================================
# Main Script
# =============================================================================

main() {
    echo ""
    echo "╔════════════════════════════════════════╗"
    echo "║         TEAM-BOOST APP DEPLOY          ║"
    echo "║      Next.js Application Deployment    ║"
    echo "╚════════════════════════════════════════╝"
    echo ""

    # Show usage if insufficient arguments
    if [[ $# -lt 3 ]]; then
        show_usage
        exit 1
    fi

    # Validate and prepare
    validate_inputs
    check_prerequisites

    # Trap cleanup on exit
    trap cleanup EXIT

    # Execute deployment steps
    install_dependencies
    build_application
    deploy_to_azure

    log_team_boost "Team-Boost deployment completed successfully! Ready for collaboration! 🎉"
}

# Run main function with all arguments
main "$@"