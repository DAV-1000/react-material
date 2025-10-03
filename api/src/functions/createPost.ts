import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { cache } from "./getPosts.js"; // reuse the cache
import { v4 as uuidv4 } from "uuid"; // npm install uuid
import { getClientPrincipal, requireRole } from "../auth.js";
import { PostCommand, postSchema } from "../schemas/post.schema.js";
import { ZodError } from "zod";
import { getPostsContainer } from "../cosmos-client.js";

export async function createPost(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const principal = getClientPrincipal(request);

  // Enforce editor role
  const authResponse = requireRole(principal, ["editor"]);
  if (authResponse) return authResponse;

  const container = getPostsContainer();

  const body = (await request.json().catch(() => null)) as Record<
    string,
    any
  > | null;
  if (!body) {
    return { status: 400, body: "Invalid JSON body" };
  }

  try {
    const tags = (body.tags || [])
      .slice()
      .sort((a: string, b: string) => a.localeCompare(b));

    const newPost = {
      ...body, // allow extra fields if you want
      id: uuidv4(), // Override the id with a new UUID
      title: body.title,
      content: body.content,
      tags: tags,
      tag: tags.join(", "), // denormalized for query
      createdAt: new Date().toISOString(),
    };

    const validatedPost: PostCommand = postSchema.parse(newPost);

    const { resource } = await container.items.create(validatedPost);

    // Invalidate cache so GET will include new post
    cache.delete("myData");

    return {
      status: 201,
      jsonBody: resource,
    };
  } catch (err: any) {
    if (err instanceof ZodError) {
      return {
        status: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Validation failed",
          errors: err.issues, // now safely serialized
        }),
      };
    }
  }

  return {
    status: 500,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Internal server error" }),
  };
}

app.http("createPost", {
  methods: ["POST"],
  route: "posts",
  authLevel: "anonymous",
  handler: createPost,
});
