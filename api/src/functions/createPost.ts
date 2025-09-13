import { CosmosClient } from "@azure/cosmos";
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { cache } from "../cache.js"; // reuse the cache
import { v4 as uuidv4 } from "uuid"; // npm install uuid
import { getClientPrincipal, requireRole } from "../auth.js";

export async function createPost(request: HttpRequest, context: InvocationContext): 
Promise<HttpResponseInit> {
      const principal = getClientPrincipal(request);
    
      // Enforce editor role
      const authResponse = requireRole(principal, ["editor"]);
      if (authResponse) return authResponse;
      
    const cosmosConnectionString = process.env.COSMOS_DB_CONNECTION_STRING;
    if (!cosmosConnectionString) {
        throw new Error("COSMOS_DB_CONNECTION_STRING not set");
    }

    const client = new CosmosClient(cosmosConnectionString);
    const database = client.database("cosmicworks");
    const container = database.container("posts");

    const body = await request.json().catch(() => null) as Record<string, any> | null;
    if (!body) {
        return { status: 400, body: "Invalid JSON body" };
    }

    try {
        // Ensure an id exists (Cosmos requires it)
        const newPost = {
            id: uuidv4(),
            title: body.title,
            content: body.content,
            tags: body.tags || [],
            createdAt: new Date().toISOString(),
            ...body // allow extra fields if you want
        };

        const { resource } = await container.items.create(newPost);

        // Invalidate cache so GET will include new post
        cache.delete("myData");

        return {
            status: 201,
            jsonBody: resource
        };
    } catch (err: any) {
        context.error(`Failed to create post: ${err.message}`);
        return { status: 500, body: "Failed to create post" };
    }
};

app.http('createPost', {
    methods: ['POST'],
    route: 'posts',
    authLevel: 'anonymous',
    handler: createPost
});
