const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient({
  endpoint: process.env.COSMOS_URI,
  key: process.env.COSMOS_KEY,
});

const database = client.database("cosmicworks");

const PostsContainer = database.container("posts");

module.exports = { PostsContainer };