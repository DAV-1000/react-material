import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { getClientPrincipal, requireRole } from "../auth.js";
import { PostCommand, postSchema } from "../schemas/post.schema.js";
import { ZodError } from "zod";

// reuse the same cache map defined in GET
import { cache } from "./getPosts.js";
import { getPostsContainer } from "../cosmos-client.js";

export async function updatePost(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const principal = getClientPrincipal(request);

  // Enforce editor role
  const authResponse = requireRole(principal, ["editor"]);
  if (authResponse) return authResponse;

  const id = request.params.id;
  if (!id) {
    return { status: 400, body: "Missing post id" };
  }

  const body = (await request.json().catch(() => null)) as Record<
    string,
    any
  > | null;
  if (!body) {
    return { status: 400, body: "Invalid JSON body" };
  }

  try {
    // Get existing post
    const container = getPostsContainer();
    const { resource: existing } = await container.item(id, id).read();

    if (!existing) {
      return { status: 404, body: "Post not found" };
    }

    const tags = (body.tags
      ? body.tags.slice()
      : (existing.tags as string[]))
      .sort((a: string, b: string) => a.localeCompare(b));

    // Merge updates into existing post
    const updatedRaw = {
      ...existing,
      ...body,
      tag: tags.join(", "),
      tags,
    };

    // Validate against zod schema
    const validated: PostCommand = postSchema.parse(updatedRaw);

    // Replace in Cosmos
    const { resource } = await container.item(id, id).replace(validated);

    // Invalidate cache
    cache.delete("myData");

    return {
      status: 200,
      jsonBody: resource,
    };
  } catch (err: any) {
    if (err instanceof ZodError) {
      return {
        status: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Validation failed",
          errors: err.issues,
        }),
      };
    }
    context.error(`Failed to update post: ${err?.message ?? String(err)}`);
    return { status: 500, body: "Failed to update post" };
  }
}

app.http("updatePost", {
  methods: ["PUT"],
  route: "posts/{id}",
  authLevel: "anonymous",
  handler: updatePost,
});
