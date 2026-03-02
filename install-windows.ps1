# SAP BI Hub - Windows Installation Script (PowerShell)

Write-Host "--- SAP BI Hub Installer ---" -ForegroundColor Cyan

# 1. Check/Install Chocolatey
if (!(Get-Command "choco" -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Chocolatey..."
    Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
}

# 2. Install dependencies via Choco
Write-Host "Installing dependencies (dotnet-sdk, postgresql, ollama)..."
choco install dotnet-8.0-sdk postgresql15 ollama -y

# 3. Setup PostgreSQL
Write-Host "Configuring PostgreSQL..."
$pg_path = "C:\Program Files\PostgreSQL\15\bin\psql.exe"
& $pg_path -U postgres -c "CREATE USER sapuser WITH PASSWORD 'sappassword';"
& $pg_path -U postgres -c "CREATE DATABASE sap_bi_hub OWNER sapuser;"

# 4. Clone and Build
Write-Host "Cloning and Building Sap BI Hub..."
# git clone https://github.com/LORDMANUEL/sapslayer.git
# cd sapslayer

dotnet publish src/SapBiHub.Api/SapBiHub.Api.csproj -c Release -r win-x64 --self-contained true /p:PublishSingleFile=true -o ./publish/win
dotnet publish src/SapBiHub.Worker/SapBiHub.Worker.csproj -c Release -r win-x64 --self-contained true /p:PublishSingleFile=true -o ./publish/win

# 5. Done
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "Run ./publish/win/SapBiHub.Api.exe to start."
