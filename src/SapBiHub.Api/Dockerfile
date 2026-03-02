FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/SapBiHub.Api/SapBiHub.Api.csproj", "src/SapBiHub.Api/"]
COPY ["src/SapBiHub.Core/SapBiHub.Core.csproj", "src/SapBiHub.Core/"]
COPY ["src/SapBiHub.SapClient/SapBiHub.SapClient.csproj", "src/SapBiHub.SapClient/"]
COPY ["src/SapBiHub.Storage/SapBiHub.Storage.csproj", "src/SapBiHub.Storage/"]
RUN dotnet restore "./src/SapBiHub.Api/SapBiHub.Api.csproj"
COPY . .
WORKDIR "/src/src/SapBiHub.Api"
RUN dotnet build "./SapBiHub.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./SapBiHub.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SapBiHub.Api.dll"]
