const { fetchAll } = require("./fetch-all.cjs");

async function main() {
  try {
    const posts = await fetchAll();
    console.log(posts);
  } catch (err) {
    console.error(err);
  }
}

main();