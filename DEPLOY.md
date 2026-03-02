# Sap BI Hub Deployment Guide

## Windows (Local EXE)
1. Ensure .NET 8 SDK is installed.
2. Install PostgreSQL 15+ locally.
3. Configure `appsettings.json` with your SAP credentials and PostgreSQL connection string.
4. Run `.\install-windows.ps1`.
5. Start the API: `.\publish-win\SapBiHub.Api.exe`.
6. Start the Worker: `.\publish-win\SapBiHub.Worker.exe`.

## Linux (Debian)
1. Run `chmod +x install-debian.sh`.
2. Execute `./install-debian.sh`.
3. Configure environment variables or `appsettings.json`.
4. Run the published binaries using `dotnet SapBiHub.Api.dll`.

## Docker (Recommended)
1. Run `docker-compose up -d`.
2. The API will be available at `http://localhost:7071`.

## ISO 27001 Compliance
- Ensure PostgreSQL data folder is encrypted (BitLocker/LUKS).
- Rotate SAP passwords regularly in the configuration.
- Audit logs are available in the `query_runs` table.
