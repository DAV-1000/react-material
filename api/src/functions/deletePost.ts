import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { cache } from "./getPosts.js"; // reuse the cache
import { CosmosClient } from "@azure/cosmos";
import { getClientPrincipal, requireRole } from "../auth.js";
import { COSMOS_DB_CONNECTION_STRING } from "../config.js";

export async function deletePost(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const principal = getClientPrincipal(request);

  // Enforce editor role
  const authResponse = requireRole(principal, ["editor"]);
  if (authResponse) return authResponse;

  if (!COSMOS_DB_CONNECTION_STRING) {
    throw new Error("COSMOS_DB_CONNECTION_STRING not set");
  }
  const client = new CosmosClient(COSMOS_DB_CONNECTION_STRING);

  const database = client.database("cosmicworks");
  const container = database.container("posts");

  const id = request.params.id;
  if (!id) {
    return { status: 400, body: "Missing post id" };
  }

  try {
    // Try to read the post first (optional: lets us return 404)
    const { resource: existing } = await container.item(id, id).read();

    if (!existing) {
      return { status: 404, body: "Post not found" };
    }

    // Delete the post
    await container.item(id, id).delete();

    // Invalidate cache so GET sees the latest data
    cache.delete("myData");

    return {
      status: 204, // No Content
    };
  } catch (err: any) {
    context.error(`Failed to delete post: ${err.message}`);
    return { status: 500, body: "Failed to delete post" };
  }
}

app.http("deletePost", {
  methods: ["DELETE"],
  route: "posts/{id}",
  authLevel: "anonymous",
  handler: deletePost,
});
