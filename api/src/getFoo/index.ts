import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    context.log("HTTP trigger function processed a request.");

    // Example: mock posts
    const posts = [
        { id: 1, title: "Hello Azure", content: "This is a sample post." },
        { id: 2, title: "Serverless FTW", content: "Azure Functions make things easier!" },
    ];

    context.res = {
        status: 200,
        body: posts,
    };
};

export default httpTrigger;
