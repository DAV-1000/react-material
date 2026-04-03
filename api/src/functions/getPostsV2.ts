import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { getPostsContainer } from "../cosmos-client.js";

export const cache = new Map<string, { value: any; expiresAt: number }>();

export async function postsV2(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const container = getPostsContainer();

  // --- Parse query parameters ---
  const page = Number.parseInt(request.query.get("page") || "1");
  const pageSize = Number.parseInt(request.query.get("pageSize") || "10");
  const sortBy = request.query.get("sortBy") || "createdAt";
  const sortOrder =
    request.query.get("sortOrder")?.toUpperCase() === "DESC" ? "DESC" : "ASC";

  // ✅ NEW: tags filtering (comma-separated)
  const tagsParam = request.query.get("tags");
  const tags = tagsParam
    ? tagsParam.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  // --- Cache key includes tags ---
  const key = `posts:${page}:${pageSize}:${sortBy}:${sortOrder}:${tags.join(",")}`;
  const ttlMs = 5 * 60 * 1000;

  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cached.value),
    };
  }

  // --- Build query dynamically ---
  let query = `SELECT * FROM c`;
  const parameters: any[] = [];

  if (tags.length > 0) {
    const conditions = tags.map((tag, i) => {
      parameters.push({ name: `@tag${i}`, value: tag.toLowerCase() });
    
      return `
        EXISTS (
          SELECT VALUE t 
          FROM t IN c.tags 
          WHERE LOWER(t) = @tag${i}
        )
      `;
    });
  
    // ✅ ALL tags must match
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += ` ORDER BY c.${sortBy} ${sortOrder}`;

  // --- Fetch data ---
  const { resources } = await container.items
    .query({ query, parameters })
    .fetchAll();

  // --- Paging logic ---
  const totalItems = resources.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const pagedData = resources.slice(startIndex, startIndex + pageSize);

  const responseBody = {
    page,
    pageSize,
    totalItems,
    totalPages,
    sortBy,
    sortOrder,
    tags,
    data: pagedData,
  };

  // --- Cache result ---
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