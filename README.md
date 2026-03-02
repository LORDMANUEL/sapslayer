# SAP BI Hub 🚀

[🇺🇸 English](#english) | [🇪🇸 Español](#español) | [🇮🇹 Italiano](#italiano)

---

<a name="english"></a>
## 🇺🇸 English

### 🎯 Purpose
SAP BI Hub was created to simplify data extraction from SAP Business One and enable high-performance analytics. By using OData GET requests, it materializes SAP data into a local PostgreSQL database, allowing Power BI and other tools to consume data without putting load on the SAP server.

### ✨ Key Features
- **Materialization Engine**: Automatically converts SAP OData into PostgreSQL tables.
- **AI Query Studio**: Uses the **Coder 1.0b** LLM to translate natural language into optimized OData queries.
- **Plug & Play**: Automated installers for Windows and Linux (Debian).
- **Daemon Support**: Runs as a background service or systemd daemon.

### 🛠️ Requirements
- **Ollama** with `coder 1.0b` model.
- **.NET 8 SDK**.
- **PostgreSQL 15+**.

### 🚀 Quick Start
1. `git clone https://github.com/LORDMANUEL/sapslayer.git`
2. **Windows**: Run `.\install-windows.ps1` as Admin.
3. **Linux**: Run `chmod +x install-debian.sh && ./install-debian.sh`.

---

<a name="español"></a>
## 🇪🇸 Español

### 🎯 Propósito
SAP BI Hub fue creado para simplificar la extracción de datos de SAP Business One y permitir analítica de alto rendimiento. Utilizando peticiones OData GET, materializa los datos de SAP en una base de datos PostgreSQL local, permitiendo que Power BI y otras herramientas consuman datos sin sobrecargar el servidor de SAP.

### ✨ Características Principales
- **Motor de Materialización**: Convierte automáticamente OData de SAP en tablas de PostgreSQL.
- **AI Query Studio**: Utiliza el LLM **Coder 1.0b** para traducir lenguaje natural en consultas OData optimizadas.
- **Plug & Play**: Instaladores automatizados para Windows y Linux (Debian).
- **Soporte de Demonios**: Funciona como servicio en segundo plano o demonio de systemd.

### 🛠️ Requisitos
- **Ollama** con el modelo `coder 1.0b`.
- **.NET 8 SDK**.
- **PostgreSQL 15+**.

### 🚀 Inicio Rápido
1. `git clone https://github.com/LORDMANUEL/sapslayer.git`
2. **Windows**: Ejecuta `.\install-windows.ps1` como Administrador.
3. **Linux**: Ejecuta `chmod +x install-debian.sh && ./install-debian.sh`.

---

<a name="italiano"></a>
## 🇮🇹 Italiano

### 🎯 Scopo
SAP BI Hub è stato creato per semplificare l'estrazione dei dati da SAP Business One e consentire analisi ad alte prestazioni. Utilizzando richieste OData GET, materializza i dati SAP in un database PostgreSQL locale, consentendo a Power BI e altri strumenti di consumare dati senza caricare il server SAP.

### ✨ Caratteristiche Principali
- **Motore di Materializzazione**: Converte automaticamente OData SAP in tabelle PostgreSQL.
- **AI Query Studio**: Utilizza l'LLM **Coder 1.0b** per tradurre il linguaggio naturale in query OData ottimizzate.
- **Plug & Play**: Installatori automatizzati per Windows e Linux (Debian).
- **Supporto Daemon**: Funziona come servizio in background o daemon systemd.

### 🛠️ Requisiti
- **Ollama** con il modello `coder 1.0b`.
- **.NET 8 SDK**.
- **PostgreSQL 15+**.

### 🚀 Avvio Rapido
1. `git clone https://github.com/LORDMANUEL/sapslayer.git`
2. **Windows**: Esegui `.\install-windows.ps1` come Amministratore.
3. **Linux**: Esegui `chmod +x install-debian.sh && ./install-debian.sh`.
