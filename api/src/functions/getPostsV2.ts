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
  const sortOrder = request.query.get("sortOrder")?.toUpperCase() === "DESC" ? "DESC" : "ASC";
  const filterField = request.query.get("filterField");
  const filterValue = request.query.get("filterValue");

  // --- Cache key includes paging, sorting & filtering ---
  const key = `posts:${page}:${pageSize}:${sortBy}:${sortOrder}:${filterField || ""}:${filterValue || ""}`;
  const ttlMs = 5 * 60 * 1000; // 5 minutes
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

  if (filterField && filterValue) {
    query += ` WHERE c.${filterField} = @filterValue`;
    parameters.push({ name: "@filterValue", value: filterValue });
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
    filterField,
    filterValue,
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
