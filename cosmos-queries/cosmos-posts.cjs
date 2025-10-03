const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient({
  endpoint: process.env.COSMOS_URI,
  key: process.env.COSMOS_KEY,
});

const PostsDatabase = client.database("cosmicworks");

const PostsContainer = PostsDatabase.container("posts");

module.exports = { PostsContainer, PostsDatabase };