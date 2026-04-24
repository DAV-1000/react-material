import { test, expect, request } from "@playwright/test";

test.describe("@smoke /api/v2/posts API (in-memory paging)", () => {
  let baseURL: string;

  test.beforeAll(() => {
    const rawBaseURL = process.env.BASE_URL;
    if (!rawBaseURL) {
      throw new Error(
        "Environment variable BASE_URL is not defined or is empty."
      );
    }
    baseURL = rawBaseURL.replace(/\/$/, "");
    console.log("API Test: Using base URL:", baseURL);
  });

  test("@smoke GET /api/v2/posts returns posts with correct structure", async () => {
    const apiContext = await request.newContext();
    const response = await apiContext.get(`${baseURL}/api/v2/posts`);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toHaveProperty("page");
    expect(body).toHaveProperty("pageSize");
    expect(body).toHaveProperty("data");
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("GET /api/v2/posts supports paging with page & pageSize", async () => {
    const context = await request.newContext();

    // Fetch first page
    const firstResponse = await context.get(
      `${baseURL}/api/v2/posts?page=1&pageSize=2`
    );
    expect(firstResponse.ok()).toBeTruthy();
    const firstBody = await firstResponse.json();
    expect(firstBody.data.length).toBeLessThanOrEqual(2);
    expect(firstBody.page).toBe(1);

    // Fetch second page
    const secondResponse = await context.get(
      `${baseURL}/api/v2/posts?page=2&pageSize=2`
    );
    expect(secondResponse.ok()).toBeTruthy();
    const secondBody = await secondResponse.json();
    expect(secondBody.data.length).toBeLessThanOrEqual(2);
    expect(secondBody.page).toBe(2);

    // Ensure data differs between pages if multiple items exist
    if (firstBody.data.length > 0 && secondBody.data.length > 0) {
      expect(firstBody.data[0].id).not.toBe(secondBody.data[0].id);
    }
  });

test("@smoke GET /api/v2/posts supports filtering", async () => {
  const context = await request.newContext();
  const tagToFilter = "Company";

  const response = await context.get(
    `${baseURL}/api/v2/posts?pageSize=10&page=1&sortBy=title&sortOrder=ASC&tags=${tagToFilter}`
  );

  expect(response.ok()).toBeTruthy();

  const body = await response.json();

  // Verify every item's CSV tag string contains the requested tag
  expect(
    body.data.every((item: any) => item.tag.includes(tagToFilter))
  ).toBe(true);
});
});
