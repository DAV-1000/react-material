const { copyItems } = require("./copy-items.cjs");
// const { fetchAll } = require("./fetch-all.cjs");

async function main() {
  try {
    await copyItems();
  } catch (err) {
    console.error(err);
  }
}

main();