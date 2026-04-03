// Usage: NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/emulator/init-cosmos.js
// Ensure the Cosmos DB Emulator is running on https://localhost:8081

const fs = require('fs')
const path = require('path')
const { CosmosClient } = require('@azure/cosmos')

async function main() {
  const schemaPath = path.join(__dirname, '..', '..', 'infra', 'cosmos', 'cosmos-schema.json')
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'))

  // Emulator defaults
  const endpoint = process.env.COSMOS_EMULATOR_ENDPOINT || 'https://localhost:8081'
  const key = process.env.COSMOS_EMULATOR_KEY || 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJI=='

  const client = new CosmosClient({ endpoint, key })

  const dbId = schema.database.id
  console.log('Creating database:', dbId)
  const { database } = await client.databases.createIfNotExists({ id: dbId })

  for (const c of schema.containers) {
    const containerId = c.name
    console.log('Ensuring container:', containerId, 'partitionKey:', c.partitionKey)
    const partitionKey = { kind: 'Hash', paths: [c.partitionKey] }

    const options = {}
    await database.containers.createIfNotExists({ id: containerId, partitionKey, defaultTtl: c.defaultTtl }, options)
  }

  console.log('Emulator initialization complete')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
