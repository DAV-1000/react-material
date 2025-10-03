import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { getPostsContainer } from "../cosmos-client.js";

export const cache = new Map<string, { value: any; expiresAt: number }>();

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

  const container = getPostsContainer();

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
