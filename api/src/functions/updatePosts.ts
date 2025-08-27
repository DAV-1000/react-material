import { CosmosClient } from "@azure/cosmos";
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

// reuse the same cache map defined in GET
import { cache } from "./getPosts.js";

export async function updatePost(request: HttpRequest, context: InvocationContext): 
Promise<HttpResponseInit> {
    const cosmosConnectionString = process.env.COSMOS_DB_CONNECTION_STRING;
    if (!cosmosConnectionString) {
        throw new Error("COSMOS_DB_CONNECTION_STRING not set");
    }

    const client = new CosmosClient(cosmosConnectionString);
    const database = client.database("cosmicworks");
    const container = database.container("posts");

    const id = request.params.id;
    if (!id) {
        return { status: 400, body: "Missing post id" };
    }

    const body = await request.json().catch(() => null) as Record<string, any> | null;
    if (!body) {
        return { status: 400, body: "Invalid JSON body" };
    }

    try {
        // Get existing post
        const { resource: existing } = await container.item(id, id).read();

        if (!existing) {
            return { status: 404, body: "Post not found" };
        }

        // Merge updates into existing post
        const updated = { ...existing, ...body };

        // Replace in Cosmos
        const { resource } = await container.item(id, id).replace(updated);

        // Invalidate cache
        cache.delete("myData");

        return {
            status: 200,
            jsonBody: resource
        };
    } catch (err: any) {
        context.error(`Failed to update post: ${err.message}`);
        return { status: 500, body: "Failed to update post" };
    }
};

app.http('updatePost', {
    methods: ['PUT'],
    route: 'posts/{id}',
    authLevel: 'anonymous',
    handler: updatePost
});
