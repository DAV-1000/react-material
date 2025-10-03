// cosmosClient.ts
import { CosmosClient, Container } from "@azure/cosmos";
import { COSMOS_DB_CONNECTION_STRING, POSTS_CONTAINER_NAME, POSTS_DATABASE_NAME } from "./config.js";

if (!COSMOS_DB_CONNECTION_STRING) {
  throw new Error("COSMOS_DB_CONNECTION_STRING not set");
}

// Single shared CosmosClient instance
export const cosmosClient = new CosmosClient(COSMOS_DB_CONNECTION_STRING);

export const getPostsContainer = (): Container =>
  cosmosClient.database(POSTS_DATABASE_NAME).container(POSTS_CONTAINER_NAME);
