const { CosmosClient } = require("@azure/cosmos");

async function standUpDb() {
  const databaseId = "cosmicworks";
  const containerId = "posts";

    console.log("Setting up Cosmos DB...");

    const client = new CosmosClient({
        endpoint: process.env.COSMOS_URI,
        key: process.env.COSMOS_KEY,
    });

  // Create database if not exists
  const { database } = await client.databases.createIfNotExists({
    id: databaseId,
  });

  // Create container if not exists
await database.containers.createIfNotExists({
    id: containerId,

    partitionKey: {
      paths: ["/id"], 
      kind: "Hash",
    },

    // Optional indexing policy tuned for your structure
    indexingPolicy: {
      indexingMode: "consistent",
      automatic: true,
      includedPaths: [
        { path: "/*" }
      ],
      excludedPaths: [
        { path: '/"_etag"/?' }
      ]
    }
  });

  console.log(`Container "${containerId}" created`);
}

module.exports = { standUpDb };