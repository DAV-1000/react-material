const { BulkOperationType, CosmosClient } = require("@azure/cosmos");
require("dotenv").config(); // loads .env into process.env

const client = new CosmosClient({
    endpoint: process.env.COSMOS_URI,
    key: process.env.COSMOS_KEY,
});

const database = client.database('cosmicworks');

const container = database.container('posts');

async function updateAllPosts() {
  // Step 1: Query all documents
  const { resources: posts } = await container.items
    .query('SELECT * FROM c')
    .fetchAll();

  // Step 2: Prepare bulk update operations
  const bulkOperations = posts.map(post => ({
    operationType: BulkOperationType.Replace, // use Replace to update
    resourceBody: { ...post, img: post.id + ".jpg" }, // example update
    id: post.id,
    partitionKey: post.id, // adjust if your partition key is different
  }));

  // Step 3: Execute bulk operations
  const response = await container.items.executeBulkOperations(bulkOperations);

  console.log(response);

}

updateAllPosts().catch(console.error);



