**Cosmos DB provisioning (Bicep)**

- **Purpose**: Deploy Cosmos DB (SQL) and containers using Bicep. The schema is defined once in `infra/cosmos/cosmos-schema.json` and consumed by the Bicep template at `infra/bicep/main.bicep`.

Quick commands
- What-if (staging):
```
az login --service-principal -u <appId> -p <secret> --tenant <tid>
az deployment group what-if --resource-group <rg> --template-file infra/bicep/main.bicep --parameters @infra/bicep/parameters/staging.parameters.json
```
- Deploy (production):
```
az deployment group create --resource-group <rg> --template-file infra/bicep/main.bicep --parameters @infra/bicep/parameters/production.parameters.json
```

Local emulator
- To initialize the Cosmos DB Emulator for local development (reads the same schema file):
```
cd <repo-root>
npm install @azure/cosmos
SET NODE_TLS_REJECT_UNAUTHORIZED=0
node scripts/emulator/init-cosmos.js
```

Files created
- `infra/cosmos/cosmos-schema.json` — single source of truth for DB and containers
- `infra/bicep/main.bicep` — Bicep template that loads the schema
- `infra/bicep/parameters/*.parameters.json` — environment-specific parameter files (checked in)
- `scripts/emulator/init-cosmos.js` — Node script to initialize Cosmos Emulator from schema

What to remove from repository / CI
- Remove the imperative Azure CLI provisioning block in the GitHub Actions workflow (done). Remove any other `az cosmosdb sql container create` calls in other CI or deployment scripts.

Common mistakes
- Do not duplicate schema in Bicep — use `loadTextContent()` and `json()` as implemented.
- Ensure Bicep file path to the schema is correct relative to `main.bicep`.
- For container throughput vs DB throughput: choose a model and be consistent. This template sets DB-level throughput; extend if you need container-level autoscale.
- Keep parameter files in repo, but keep secrets (account keys) in GitHub Secrets.
