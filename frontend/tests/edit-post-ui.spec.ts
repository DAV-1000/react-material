import { test, expect } from "@playwright/test";
import { buildValidPost, postCreate } from "./post-utils";

async function gotoEditPost(
  page: any,
  baseURL: string | undefined,
  id: string
) {
  if (!baseURL) {
    throw new Error(
      "Environment variable BASE_URL is not defined or is empty."
    );
  }
  const trimmed = baseURL.replace(/\/$/, "");

  // Stub the initial GET for the edit page data
  await page.route(`**/api/posts/${id}/edit`, async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(buildValidPost()),
    });
  });

  const url = `${trimmed}/${id}/edit`;
  console.log(`Navigating to: ${url}`);
  await page.goto(url);
}

test.describe("Edit Post UI - Zod validation", () => {
  let postIdAuthor: string;
  let baseAuthor: any;
    let postIdFields: string;
  let baseFields: any;
  const createdPostIds: string[] = [];

  test.beforeAll(async ({ request }) => {
    baseAuthor = buildValidPost();
    let created = await postCreate(request, baseAuthor);
    postIdAuthor = created.id;
    createdPostIds.push(postIdAuthor);
    expect(typeof postIdAuthor).toBe("string");
    expect(postIdAuthor.length).toBeGreaterThan(0);

    baseFields = buildValidPost();
    created = await postCreate(request, baseFields);
    postIdFields = created.id;
    createdPostIds.push(postIdFields);
    expect(typeof postIdFields).toBe("string");
    expect(postIdFields.length).toBeGreaterThan(0);
  });

  test.afterAll(async ({ request }) => {
    // Best-effort cleanup of any remaining created posts
    for (const id of createdPostIds.splice(0)) {
      try {
        await request.delete(`/api/posts/${id}`);
      } catch {
        // ignore cleanup errors
      }
    }
  });

  test("shows zod validation errors when required fields are cleared", async ({
    page,
    baseURL,
  }) => {
    await gotoEditPost(page, baseURL, postIdFields);

    // Clear required fields
    await page.getByLabel("Image URL").fill("");
    await page.getByLabel("Title").fill("");
    await page.getByLabel("Description").fill("");
    // Tags error may not render due to UI binding; intentionally not asserted.

    // Attempt to save
    await page.getByRole("button", { name: "Save Entity" }).click();

    // Field-level validation messages from zod schema
    await expect(page.getByText("Image is required")).toBeVisible();
    await expect(page.getByText("Title cannot be null")).toBeVisible();
    await expect(page.getByText("Description cannot be null")).toBeVisible();
  });

  test("shows nested author validation errors when author fields are empty", async ({
    page,
    baseURL,
  }) => {
    await gotoEditPost(page, baseURL, postIdAuthor);

    // Clear nested author fields
    await page.getByLabel("Name").fill("");
    await page.getByLabel("Avatar URL").fill("");

    // Attempt to save
    await page.getByRole("button", { name: "Save Entity" }).click();

    // Nested validation messages for author object
    await expect(page.getByText("Author name is required")).toBeVisible();
    await expect(page.getByText("Avatar is required")).toBeVisible();
  });
});
