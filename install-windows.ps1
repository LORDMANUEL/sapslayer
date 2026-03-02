# Windows installation script (Simplified)

Write-Host "Installing Sap BI Hub..."

# Check for Docker or Postgres locally
Write-Host "Please ensure PostgreSQL is installed and running at localhost:5432"

# Publish the solution
dotnet publish SapBiHub.sln -c Release -o ./publish-win

Write-Host "Done. Run ./publish-win/SapBiHub.Api.exe to start the API."
