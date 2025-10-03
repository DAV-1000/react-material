import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { getPostsContainer } from "../cosmos-client.js";

export async function getPostByIdDetail(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
;
  const container = getPostsContainer();

  const id = request.params.id;
  if (!id) {
    return { status: 400, body: "Missing post id" };
  }

  try {
    const { resource } = await container.item(id, id).read();

    if (!resource) {
      return { status: 404, body: "Post not found" };
    }

    return {
      status: 200,
      jsonBody: resource,
    };
  } catch (err: any) {
    context.error(`Failed to fetch post: ${err.message}`);
    return { status: 500, body: "Failed to fetch post" };
  }
}

app.http("getPostByIdDetail", {
  methods: ["GET"],
  route: "posts/{id}/detail",
  authLevel: "anonymous",
  handler: getPostByIdDetail,
});
