import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { getPostsContainer } from "../cosmos-client.js";

import { cache } from "./getPosts.js";  

export async function postsV2(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const container = getPostsContainer();

  // --- Query params ---
  const pageSize = Number.parseInt(request.query.get("pageSize") || "10");
  const page = Number.parseInt(request.query.get("page") || "1"); // ✅ new
  const offset = (page - 1) * pageSize; // ✅ calculate offset

  const sortBy = request.query.get("sortBy") || "title";
  const sortOrder =
    request.query.get("sortOrder")?.toUpperCase() === "DESC" ? "DESC" : "ASC";

  // --- Tags filter ---
  const tags = (request.query.get("tags") || "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  // --- Cache key (use page instead of token) ---
  const key = `posts:${page}:${pageSize}:${sortBy}:${sortOrder}:${tags.join(",")}`;
  const ttlMs = 5 * 60 * 1000;

  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return {
      status: 200,
      jsonBody: cached.value,
    };
  }

  // --- Build query ---
  let query = "SELECT * FROM c";
  const parameters: any[] = [];

  if (tags.length > 0) {
    const conditions = tags.map((tag, i) => {
      parameters.push({ name: `@tag${i}`, value: tag });
      return `EXISTS (
        SELECT VALUE t FROM t IN c.tags 
        WHERE LOWER(t) = @tag${i}
      )`;
    });

    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += ` ORDER BY c.${sortBy} ${sortOrder}`;
  query += ` OFFSET @offset LIMIT @limit`; // ✅ key change

  parameters.push({ name: "@offset", value: offset }, { name: "@limit", value: pageSize });

  // --- Execute query ---
  const { resources } = await container.items
    .query({ query, parameters })
    .fetchAll(); // ✅ no continuation token

  // --- Response ---
  const responseBody = {
    page,
    pageSize,
    sortBy,
    sortOrder,
    tags,
    data: resources,
  };

  // --- Cache ---
  cache.set(key, {
    value: responseBody,
    expiresAt: Date.now() + ttlMs,
  });

  return {
    status: 200,
    jsonBody: responseBody,
  };
}

app.http("posts-v2", {
  methods: ["GET"],
  route: "v2/posts",
  authLevel: "anonymous",
  handler: postsV2,
});