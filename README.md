# SAP BI Hub

SAP BI Hub is a local platform designed to bridge the gap between SAP Business One (HANA/SQL) and BI tools like Power BI. It focuses on read-only data extraction using OData via the SAP Service Layer, materializing results into a local PostgreSQL data mart for high-performance reporting and AI-assisted analysis.

## 🚀 Purpose and Scope

- **Purpose**: To provide a secure, local environment for data engineering on SAP B1 data without impacting SAP's operational performance.
- **Scope**:
  - Connect to SAP B1 Service Layer using OData GET requests.
  - Materialize data into PostgreSQL tables (`ds_*`).
  - AI-assisted Query Builder using local LLMs (RAG support).
  - RBAC (Role-Based Access Control) for data governance.
  - Direct connectors for Power BI (CSV, JSON, PostgreSQL).

## 🛠️ Tech Stack

- **Backend**: ASP.NET Core 8.0 (Web API + Worker Service)
- **Frontend**: React 19 + Vite + Tailwind CSS v4
- **Database**: PostgreSQL 15
- **ORM**: Entity Framework Core + Npgsql
- **AI**: Query Builder Agent with local LLM support (Ollama/vLLM)

## 📁 Project Structure

- `src/SapBiHub.Api`: REST API for management and consumption.
- `src/SapBiHub.Core`: Core entities and business models.
- `src/SapBiHub.SapClient`: SAP Service Layer OData client.
- `src/SapBiHub.Storage`: EF Core migrations and DB context.
- `src/SapBiHub.Worker`: Background scheduler and ETL motor.
- `src/SapBiHub.AI`: AI agents and RAG services.
- `src/SapBiHub.Frontend`: React-based management dashboard.

## ⚙️ Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js 22+ & npm
- PostgreSQL 15+ (Running on port 5432)
- Docker (Optional, for easy DB setup)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd sap-bi-hub
   ```

2. **Database Setup**:
   If using Docker:
   ```bash
   docker-compose up -d db
   ```
   Or manually create a database `sap_bi_hub` and a user `sapuser` with password `sappassword`.

3. **Backend Configuration**:
   Update `src/SapBiHub.Api/appsettings.json` and `src/SapBiHub.Worker/appsettings.json` with your SAP Service Layer credentials and PostgreSQL connection string.

4. **Run Backend**:
   ```bash
   dotnet run --project src/SapBiHub.Api
   dotnet run --project src/SapBiHub.Worker
   ```

5. **Run Frontend**:
   ```bash
   cd src/SapBiHub.Frontend
   npm install
   npm run dev
   ```

## 📦 Building for Windows (.exe)

To create a self-contained executable for Windows:

```bash
# Publish the API
dotnet publish src/SapBiHub.Api/SapBiHub.Api.csproj -c Release -r win-x64 --self-contained true /p:PublishSingleFile=true -o ./publish/win

# Publish the Worker
dotnet publish src/SapBiHub.Worker/SapBiHub.Worker.csproj -c Release -r win-x64 --self-contained true /p:PublishSingleFile=true -o ./publish/win
```
The resulting `.exe` files will be in the `./publish/win` folder.

## 📊 Consumption in Power BI

1. **Option A (Recommended)**: Connect directly to the PostgreSQL database using the `ds_*` tables.
2. **Option B**: Use the API export endpoints:
   - `GET /api/Datasets/{name}/export/csv`
   - `GET /api/Datasets/{name}/export/json`

## 🛡️ Security (ISO 27001)

- **RBAC**: Predefined roles (Admin, DataEngineer, Analyst, Viewer).
- **Encryption**: SAP credentials are not stored in plain text (use DPAPI on Windows or Environment Variables).
- **Audit**: All data extractions are logged in the `QueryRuns` table.

## 📄 License
MIT License
