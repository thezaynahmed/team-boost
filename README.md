# TeamBoost

TeamBoost is a modern, collaborative team management platform designed to enhance productivity and team spirit. It features a unique, tactile user interface for note-taking that mimics a physical corkboard, bringing a sense of fun and distinct personality to digital collaboration.

## 🚀 Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/) (Radix Primitives)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/) (Microsoft Entra ID Provider)
- **Telemetry**: [Azure Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Inter (Sans), Patrick Hand (Handwriting)

## 🎨 Tactile Design System

The `My Notes` dashboard (`/dashboard/notes`) implements a specialized **Tactile Design System**:
- **Concept**: A digital corkboard with physical "Sticky Notes".
- **Visuals**: Realistic paper textures (noise overlays), randomized rotation (-2° to 2°), and physical fasteners (Pins, Washi Tape, Scotch Tape).
- **Typography**: Uses `Patrick Hand` for a personal, handwritten feel on note bodies.
- **Micro-interactions**: Cards lift and scale on hover; "Add Note" is a dashed-border sticky pad.

---

## 🛠️ Local Development Guide

### Prerequisites
- Node.js 18+ installed.
- An Azure Cloud Account (for Auth & Telemetry).

### 1. Clone & Install
```bash
git clone <repository-url>
cd team-boost
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory. You will need to populate this with secrets from Azure (see setup sections below).

```bash
# .env.local

# Authentication (NextAuth.js)
AUTH_SECRET="<Generated Secret>" # Run: openssl rand -base64 32

# Microsoft Entra ID (Azure AD) - See Setup Guide below
AUTH_MICROSOFT_ENTRA_ID_ID=""
AUTH_MICROSOFT_ENTRA_ID_SECRET=""
AUTH_MICROSOFT_ENTRA_ID_TENANT_ID=""

# Telemetry (Azure Application Insights)
NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING=""
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🔐 Authentication Setup (Microsoft Entra ID)

Current authentication is handled via **Microsoft Entra ID** (formerly Azure Active Directory). Follow these steps to generate the required credentials.

### 1. Register the Application
1.  Log in to the [Azure Portal](https://portal.azure.com/).
2.  Search for **"Microsoft Entra ID"** and select **App registrations** from the sidebar.
3.  Click **+ New registration**.
4.  **Name**: `TeamBoost-Dev` (or similar).
5.  **Supported account types**:
    *   Choose **"Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant)"** if building a SaaS-like app.
    *   Choose **"Single tenant"** for internal organization use only.
6.  **Redirect URI**:
    *   Platform: **Web**
    *   URI: `http://localhost:3000/api/auth/callback/microsoft-entra-id` (Add your production URL later).
7.  Click **Register**.

### 2. Configure Credentials
1.  **Client ID**: On the app **Overview** page, copy the **Application (client) ID**.
    *   Paste into `.env.local` -> `AUTH_MICROSOFT_ENTRA_ID_ID`.
2.  **Tenant ID**: Copy the **Directory (tenant) ID**.
    *   Paste into `.env.local` -> `AUTH_MICROSOFT_ENTRA_ID_TENANT_ID`.
3.  **Client Secret**:
    *   Go to **Certificates & secrets** (sidebar).
    *   Click **+ New client secret**.
    *   Description: `TeamBoost Local`. Expiry: `180 days`.
    *   Click **Add**.
    *   **IMPORTANT**: Copy the **Value** immediately (you won't see it again).
    *   Paste into `.env.local` -> `AUTH_MICROSOFT_ENTRA_ID_SECRET`.

---

## 📊 Telemetry Setup (Azure App Insights)

We use Azure Application Insights to track client-side performance and errors.

### 1. Create Resource
1.  Search for **"Application Insights"** in Azure Portal.
2.  Click **+ Create**.
3.  Resource Group: Select or create one (e.g., `rg-teamboost-dev`).
4.  Name: `ai-teamboost-dev`.
5.  Region: `East US` (or your preferred region).
6.  Click **Review + create** -> **Create**.

### 2. Get Connection String
1.  Navigate to the created resource.
2.  On the **Overview** page, copy the **Connection String** (top right).
3.  Paste into `.env.local` -> `NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING`.

---

## 🚢 Deployment Guide

### Vercel (Recommended)
1.  Push your code to GitHub/GitLab.
2.  Import project into Vercel.
3.  **Environment Variables**: Copy all values from `.env.local` into the Vercel Project Settings.
4.  **Update Callbacks**:
    *   Go to your Azure App Registration -> Authentication.
    *   Add the production URL to Redirect URIs: `https://<your-vercel-domain>.vercel.app/api/auth/callback/microsoft-entra-id`.

### Azure Container Apps / App Service
1.  Build the Docker image (if using Docker) or configure the Node.js runtime.
2.  Inject environment variables into the App Service configuration.
3.  Update the Azure App Registration Redirect URI to match the Azure domain.

---

## 🧑‍💻 Developer Notes

### Adding New Notes (Mock Data)
Currently, data is mocked in `lib/mock-data.ts`. To add new permanent test data, edit the `NOTES` array in that file.

### Extending the UI
- **Global Styles**: Defined in `app/globals.css`.
- **Theme**: Managed via `next-themes` (Dark/Light mode support included).
- **Icons**: Use `lucide-react` for all standard iconography.
