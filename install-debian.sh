#!/bin/bash
# SAP BI Hub - Debian/Linux Installation Script

set -e

echo "--- SAP BI Hub Linux Installer ---"

# 1. Update and install basic tools
sudo apt-get update
sudo apt-get install -y wget curl git

# 2. Install .NET 8 SDK
wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --version latest --channel 8.0
export PATH=$PATH:$HOME/.dotnet

# 3. Install PostgreSQL 15
sudo apt-get install -y postgresql-15 postgresql-contrib-15
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 4. Setup PostgreSQL Database and User
sudo -u postgres psql -c "CREATE USER sapuser WITH PASSWORD 'sappassword';"
sudo -u postgres psql -c "CREATE DATABASE sap_bi_hub OWNER sapuser;"

# 5. Install Ollama (for AI/LLM)
curl -fsSL https://ollama.com/install.sh | sh

# 6. Clone and Build
# git clone https://github.com/LORDMANUEL/sapslayer.git
# cd sapslayer
dotnet publish src/SapBiHub.Api/SapBiHub.Api.csproj -c Release -o /opt/sapbihub/api
dotnet publish src/SapBiHub.Worker/SapBiHub.Worker.csproj -c Release -o /opt/sapbihub/worker

# 7. Daemonize (Systemd Services)
sudo tee /etc/systemd/system/sapbihub-api.service > /dev/null <<EOF
[Unit]
Description=SAP BI Hub API Service
After=postgresql.service

[Service]
WorkingDirectory=/opt/sapbihub/api
ExecStart=/usr/bin/dotnet /opt/sapbihub/api/SapBiHub.Api.dll
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
ExecStart=/usr/bin/dotnet /opt/sapbihub/worker/SapBiHub.Worker.dll
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
sudo systemctl start sapbihub-api sapbihub-worker

echo "Installation Complete! Services are running as daemons."
sudo systemctl status sapbihub-api --no-pager
