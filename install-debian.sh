# Install PostgreSQL
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql -c "CREATE USER sapuser WITH PASSWORD 'sappassword';"
sudo -u postgres psql -c "CREATE DATABASE sap_bi_hub OWNER sapuser;"

# Publish .NET services
dotnet publish SapBiHub.sln -c Release -o ./publish

# Setup Systemd services (Optional, but recommended)
echo "Services published to ./publish"
