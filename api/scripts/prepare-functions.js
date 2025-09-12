import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, "../dist/src/functions");
const outDir = path.join(__dirname, "../dist");

const filesToLift = ["auth.js", "types.js"];

// Lift auth.js and types.js from dist/src to dist
filesToLift.forEach(filename => {
  const fromPath = path.join(srcRoot, filename);
  const toPath = path.join(outDir, filename);
  if (fs.existsSync(fromPath)) {
    fs.copyFileSync(fromPath, toPath);
    // Optionally, remove from src after copying:
    // fs.unlinkSync(fromPath);
  }
});

const httpTriggerTemplate = (functionName) => ({
  bindings: [
    {
      authLevel: "anonymous",
      type: "httpTrigger",
      direction: "in",
      name: "req",
      methods: ["get"], // Adjust or detect methods if needed
      route: functionName
    },
    {
      type: "http",
      direction: "out",
      name: "res"
    }
  ],
  scriptFile: "index.js"
});

fs.readdirSync(srcDir).forEach((file) => {
  if (file.endsWith(".js")) {
    const functionName = path.basename(file, ".js");
    const functionDir = path.join(outDir, functionName); // Append '1' to avoid name conflicts
    if (!fs.existsSync(functionDir)) fs.mkdirSync(functionDir);
    // Move the JS file as index.js
    fs.copyFileSync(path.join(srcDir, file), path.join(functionDir, "index.js"));
    // Write function.json
    fs.writeFileSync(
      path.join(functionDir, "function.json"),
      JSON.stringify(httpTriggerTemplate(functionName), null, 2)
    );
  }
});