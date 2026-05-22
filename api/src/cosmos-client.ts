// cosmosClient.ts

import fs from "node:fs";
import https from "node:https";

import { CosmosClient, Container } from "@azure/cosmos";

import {
  COSMOS_DB_CONNECTION_STRING,
  POSTS_CONTAINER_NAME,
  POSTS_DATABASE_NAME,
} from "./config.js";

if (!COSMOS_DB_CONNECTION_STRING) {
  throw new Error("COSMOS_DB_CONNECTION_STRING not set");
}

const isLocalCosmos =
  COSMOS_DB_CONNECTION_STRING.includes("localhost") ||
  COSMOS_DB_CONNECTION_STRING.includes("127.0.0.1");

let cosmosClient: CosmosClient;

// Local emulator
if (isLocalCosmos) {
  const ca = fs.readFileSync(
    "./certs/cosmos-emulator.pem",
    "utf8",
  );

  const agent = new https.Agent({
    ca,
  });

  cosmosClient = new CosmosClient({
    connectionString: COSMOS_DB_CONNECTION_STRING,

    agent,
  });

  console.log("Using local Cosmos emulator certificate");
} else {
  // Production / Azure
  cosmosClient = new CosmosClient(
    COSMOS_DB_CONNECTION_STRING,
  );
}

export { cosmosClient };

export const getPostsContainer = (): Container =>
  cosmosClient
    .database(POSTS_DATABASE_NAME)
    .container(POSTS_CONTAINER_NAME);