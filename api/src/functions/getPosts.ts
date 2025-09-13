import { CosmosClient } from "@azure/cosmos";
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

import { cache } from "../cache.js";

export async function posts(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const key = "myData";
  const ttlMs = 5 * 60 * 1000; // cache for 5 minutes
  const cached = cache.get(key);

  if (cached && cached.expiresAt > Date.now()) {
    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cached.value),
    };
  }
  const cosmosConnectionString = process.env.COSMOS_DB_CONNECTION_STRING;

  if (!cosmosConnectionString) {
    throw new Error("COSMOS_DB_CONNECTION_STRING not set");
  }

  const client = new CosmosClient(cosmosConnectionString);

  const database = client.database("cosmicworks");
  const container = database.container("posts");

  const { resources } = await container.items
    .query("SELECT * FROM c")
    .fetchAll();

  cache.set(key, {
    value: resources,
    expiresAt: Date.now() + ttlMs,
  });

  return {
    status: 200,
    jsonBody: resources,
  };
}

app.http("posts", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: posts,
});
