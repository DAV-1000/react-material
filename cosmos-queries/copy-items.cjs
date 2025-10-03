const { PostsDatabase } = require("./cosmos-posts.cjs");
const sourceContainerId = "posts";
const targetContainerId = "posts_production";

async function copyItems() {

  const database = PostsDatabase;
  const sourceContainer = database.container(sourceContainerId);
  const targetContainer = database.container(targetContainerId);

  console.log(`Copying items from '${sourceContainerId}' to '${targetContainerId}'...`);

  // Query all items from source container
  const query = "SELECT * FROM c";
  const { resources: items } = await sourceContainer.items.query(query).fetchAll();

  console.log(`Found ${items.length} items to copy.`);

  for (const item of items) {
    try {
      // If you want to keep the same id, you can directly upsert.
      await targetContainer.items.upsert(item);
      console.log(`Copied item with id: ${item.id}`);
    } catch (err) {
      console.error(`Failed to copy item with id: ${item.id}`, err.message);
    }
  }

  console.log("✅ Copy completed.");
}


module.exports = { copyItems };
