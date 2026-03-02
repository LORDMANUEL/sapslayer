# SAP BI Hub

SAP BI Hub is a high-performance local platform designed to bridge the gap between SAP Business One (HANA/SQL) and BI tools like Power BI. Using OData via the SAP Service Layer, it materializes results into a local PostgreSQL data mart, optimizing reporting performance and providing AI-assisted analysis.

- **Repository**: [https://github.com/LORDMANUEL/sapslayer/tree/feature/sap-bi-hub-implementation-9863365322856994976](https://github.com/LORDMANUEL/sapslayer/tree/feature/sap-bi-hub-implementation-9863365322856994976)

## 🚀 Key Features

- **OData Materialization**: GET results from SAP are stored in local PostgreSQL tables (`ds_*`).
- **AI Query Studio**: Integrated with local LLMs via **Ollama** for natural language to OData proposals.
- **Power BI Connectivity**: Native PostgreSQL tables or CSV/JSON endpoints for local consumption.
- **Daemon/Daemonization**: Full support for running as a background service on Windows and a systemd daemon on Linux.
- **ISO 27001 Ready**: Credential protection and audit logs by design.

## ⚙️ Automated Installation

### 🪟 Windows (Using Chocolatey)
1. Open PowerShell as Administrator.
2. Run `.\install-windows.ps1`.
3. The script will install .NET 8, PostgreSQL 15, Ollama, set up the database, and publish the binaries.

### 🐧 Linux (Debian/Ubuntu)
1. Grant execute permissions: `chmod +x install-debian.sh`.
2. Run `./install-debian.sh`.
3. The script will install dependencies, set up the database, and configure **systemd services** (`sapbihub-api` and `sapbihub-worker`).

## 📊 Quick Start

1. **Clone**: `git clone <repo-url>`
2. **Setup**: Run the appropriate installation script for your OS.
3. **Configure**: Update `appsettings.json` with your SAP Service Layer and PostgreSQL credentials.
4. **Access**: Navigate to `http://localhost:5173` for the dashboard.

## 🛠️ Building the .exe (Manual)
To create a single-file executable for Windows:
```bash
dotnet publish -c Release -r win-x64 --self-contained true /p:PublishSingleFile=true -o ./publish/win
```

## 📄 Documentation
- [DEPLOY.md](./DEPLOY.md): Detailed deployment and infrastructure instructions.
- [src/SapBiHub.Frontend/README.md](./src/SapBiHub.Frontend/README.md): Frontend development guide.
