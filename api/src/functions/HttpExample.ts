import { CosmosClient } from "@azure/cosmos";
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function HttpExample(request: HttpRequest, context: InvocationContext): 
Promise<HttpResponseInit> {

    // const cosmosConnectionString = process.env.COSMOS_DB_CONNECTION_STRING;

    // if (!cosmosConnectionString) {
    //     throw new Error("COSMOS_DB_CONNECTION_STRING not set");
    // }

    // const client = new CosmosClient(cosmosConnectionString);

    // const database = client.database("cosmicworks");
    // const container = database.container("posts");

    // const { resources } = await container.items.query("SELECT * FROM c").fetchAll();

    // return {
    //     status: 200,
    //     jsonBody: resources
    // };


    return {
        status: 200,
        body: "Hello from HttpExample function! " + process.env.TEST_SECRET_STRING
    };
};

app.http('HttpExample', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: HttpExample
});
