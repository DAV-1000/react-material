const { BulkOperationType, CosmosClient } = require("@azure/cosmos");
require("dotenv").config(); // loads .env into process.env

const client = new CosmosClient({
  endpoint: process.env.COSMOS_URI,
  key: process.env.COSMOS_KEY,
});

const database = client.database("cosmicworks");

const container = database.container("posts");

async function updateAllPosts() {
  // Step 1: Query all documents
  const { resources: posts } = await container.items
    .query("SELECT * FROM c")
    .fetchAll();

  // Step 2: Prepare bulk update operations
  const bulkOperations = posts.map((post) => ({
    operationType: BulkOperationType.Replace, // use Replace to update
    resourceBody: { ...post, img: post.id + ".jpg" }, // example update
    id: post.id,
    partitionKey: post.id, // adjust if your partition key is different
  }));

  // Step 3: Execute bulk operations
  const response = await container.items.executeBulkOperations(bulkOperations);

  console.log(response);
}

//updateAllPosts().catch(console.error);

async function createTags() {
  // Step 1: Query all documents
  const { resources: posts } = await container.items
    .query("SELECT * FROM c")
    .fetchAll();

  // Step 2: Prepare bulk update operations
  const bulkOperations = posts.map((post) => {
    const tags = post.tag
      ? post.tag.split(",").map((t) => t.trim())
      : [];

    return {
      operationType: BulkOperationType.Replace, // Replace existing doc
      resourceBody: {
        ...post,
        tags, // add new "tags" array
      },
      id: post.id,
      partitionKey: post.id, // adjust this if your partition key is NOT "id"
    };
  });

  // Step 3: Execute bulk operations
  const response = await container.items.bulk(bulkOperations);

  console.log("Bulk update completed:", response);
}


createTags().catch((err) => {
  console.error(err);
});
