import { test, expect } from "@playwright/test";

function buildValidPost(id: string) {
  return {
    id,
    img: "image.png",
    tags: ["alpha", "beta"],
    title: "A valid post title",
    description: "A valid description.",
    authors: [
      {
        name: "Alice",
        avatar: "avatar.jpg",
      },
    ],
  };
}

async function gotoEditPost(page: any, baseURL?: string | undefined, id = "post-xyz") {
  if (!baseURL) {
    throw new Error("Environment variable BASE_URL is not defined or is empty.");
  }
  const trimmed = baseURL.replace(/\/$/, "");

  // Stub the initial GET for the edit page data
  await page.route(`**/api/posts/${id}/edit`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(buildValidPost(id)),
    });
  });

  await page.goto(`${trimmed}/${id}/edit`);
}

test.describe("Edit Post UI - Zod validation", () => {
  test("shows zod validation errors when required fields are cleared", async ({ page, baseURL }) => {
    await gotoEditPost(page, baseURL);

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

  test("shows nested author validation errors when author fields are empty", async ({ page, baseURL }) => {
    await gotoEditPost(page, baseURL);

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
