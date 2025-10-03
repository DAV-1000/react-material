const { PostsContainer } = require("./cosmos-posts.cjs");

async function fetchAll() {
  const { resources: posts } = await PostsContainer.items
    .query("SELECT * FROM c")
    .fetchAll();

    return posts;
}

module.exports = { fetchAll };
