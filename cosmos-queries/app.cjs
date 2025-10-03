const { copyItems } = require("./copy-items.cjs");

async function main() {
  try {
    await copyItems();
    console.log("Done");
  } catch (err) {
    console.error(err);
  }
}

main();