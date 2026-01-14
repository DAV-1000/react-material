const { copyItems } = require("./copy-items.cjs");
const { fetchAll } = require("./fetch-all.cjs");
const fs = require("node:fs");

async function main() {
  try {
    const posts = await fetchAll();
    // Convert the posts to JSON
    const data = JSON.stringify(posts, null, 2); // pretty print with 2 spaces

    // Write to a file
    fs.writeFileSync("posts.json", data, "utf8");
    // await copyItems();
    // console.log("Done");
  } catch (err) {
    console.error(err);
  }
}

main();