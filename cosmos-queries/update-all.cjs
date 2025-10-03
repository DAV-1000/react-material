const { BulkOperationType } = require("@azure/cosmos");
const { PostsContainer } = require("./cosmos-posts.cjs");
require("dotenv").config(); // loads .env into process.env

async function updateAllPosts() {
    
  // Step 1: Query all documents
  const { resources: posts } = await PostsContainer.items
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
  const response = await PostsContainer.items.executeBulkOperations(bulkOperations);

  return response;
}

module.exports = { updateAllPosts };
