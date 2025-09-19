import { CosmosClient } from "@azure/cosmos";
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function getPostByIdEdit(request: HttpRequest, context: InvocationContext): 
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

    try {
        const { resource } = await container.item(id, id).read();

        if (!resource) {
            return { status: 404, body: "Post not found" };
        }

        return {
            status: 200,
            jsonBody: resource
        };
    } catch (err: any) {
        context.error(`Failed to fetch post: ${err.message}`);
        return { status: 500, body: "Failed to fetch post" };
    }
};

app.http('getPostByIdEdit', {
    methods: ['GET'],
    route: 'posts/{id}/edit',
    authLevel: 'anonymous',
    handler: getPostByIdEdit
});
