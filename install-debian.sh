#!/bin/bash
# SAP BI Hub - Debian/Linux "Plug & Play" Installer

set -e

echo "--- SAP BI Hub Linux Installer ---"

# 1. Update and install basic tools
sudo apt-get update
sudo apt-get install -y wget curl git unzip

# 2. Install .NET 8 SDK
if ! command -v dotnet &> /dev/null; then
    wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh
    chmod +x dotnet-install.sh
    ./dotnet-install.sh --version latest --channel 8.0
    echo 'export PATH=$PATH:$HOME/.dotnet' >> ~/.bashrc
    export PATH=$PATH:$HOME/.dotnet
fi

# 3. Install PostgreSQL 15
if ! command -v psql &> /dev/null; then
    sudo apt-get install -y postgresql-15 postgresql-contrib-15
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
fi

# 4. Setup PostgreSQL Database and User
sudo -u postgres psql -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'sapuser') THEN CREATE USER sapuser WITH PASSWORD 'sappassword'; END IF; END \$\$;"
sudo -u postgres psql -c "SELECT 'CREATE DATABASE sap_bi_hub OWNER sapuser' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'sap_bi_hub')\gexec"

# 5. Install Ollama (for AI/LLM)
if ! command -v ollama &> /dev/null; then
    curl -fsSL https://ollama.com/install.sh | sh
    ollama pull coder:1.0b
fi

# 6. Build and Publish
echo "Building applications..."
dotnet publish src/SapBiHub.Api/SapBiHub.Api.csproj -c Release -o /opt/sapbihub/api
dotnet publish src/SapBiHub.Worker/SapBiHub.Worker.csproj -c Release -o /opt/sapbihub/worker

# 7. Configure Systemd Services
echo "Configuring services..."
sudo tee /etc/systemd/system/sapbihub-api.service > /dev/null <<EOF
[Unit]
Description=SAP BI Hub API Service
After=postgresql.service

[Service]
WorkingDirectory=/opt/sapbihub/api
ExecStart=$(which dotnet || echo "/home/$USER/.dotnet/dotnet") /opt/sapbihub/api/SapBiHub.Api.dll
Restart=always
RestartSec=10
SyslogIdentifier=sapbihub-api
User=$USER
Environment=ASPNETCORE_ENVIRONMENT=Production

[Install]
WantedBy=multi-user.target
EOF

sudo tee /etc/systemd/system/sapbihub-worker.service > /dev/null <<EOF
[Unit]
Description=SAP BI Hub Worker Service
After=postgresql.service

[Service]
WorkingDirectory=/opt/sapbihub/worker
ExecStart=$(which dotnet || echo "/home/$USER/.dotnet/dotnet") /opt/sapbihub/worker/SapBiHub.Worker.dll
Restart=always
RestartSec=10
SyslogIdentifier=sapbihub-worker
User=$USER
Environment=DOTNET_ENVIRONMENT=Production

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable sapbihub-api sapbihub-worker
sudo systemctl restart sapbihub-api sapbihub-worker

echo "Installation Complete! SAP BI Hub is now running as a Debian daemon."
