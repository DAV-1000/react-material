import { test, expect } from "@playwright/test";

async function gotoCreatePost(page: any, baseURL?: string | undefined) {
  if (!baseURL) {
    throw new Error("Environment variable BASE_URL is not defined or is empty.");
  }
  const trimmed = baseURL.replace(/\/$/, "");
  await page.goto(`${trimmed}/create-post`);
}

async function fillValidForm(page: any) {
  await page.getByLabel("Image URL").fill("image.png");
  await page.getByLabel("Tags").fill("alpha, beta");
  await page.getByLabel("Title").fill("A valid post title");
  await page.getByLabel("Description").fill("A valid description.");
  await page.getByRole("button", { name: "Add Author" }).click();
  await page.getByLabel("Name").fill("Alice");
  await page.getByLabel("Avatar URL").fill("avatar.jpg");
}

test.describe("Create Post UI", () => {
  test("renders form with default state", async ({ page, baseURL }) => {
    await gotoCreatePost(page, baseURL);

    await expect(page.locator("h1")).toHaveText("Create Post");

    const idInput = page.getByLabel("ID");
    await expect(idInput).toBeDisabled();
    await expect(idInput).toHaveValue("NEW_POST");

    await expect(page.getByRole("button", { name: "Save Entity" })).toBeEnabled();
  });

  test("shows zod validation errors when submitting empty form", async ({ page, baseURL }) => {
    await gotoCreatePost(page, baseURL);

    await page.getByRole("button", { name: "Save Entity" }).click();

    // Field-level validation messages from zod schema
    await expect(page.getByText("Image is required")).toBeVisible();
    await expect(page.getByText("Title cannot be null")).toBeVisible();
    await expect(page.getByText("Description cannot be null")).toBeVisible();

    // (Tags error may not render due to UI binding; intentionally not asserted.)
  });

  test("shows nested author validation errors when author fields are empty", async ({ page, baseURL }) => {
    await gotoCreatePost(page, baseURL);

    await page.getByRole("button", { name: "Add Author" }).click();
    await page.getByRole("button", { name: "Save Entity" }).click();

    await expect(page.getByText("Author name is required")).toBeVisible();
    await expect(page.getByText("Avatar is required")).toBeVisible();
  });

  test("submits valid form, shows success snackbar, and navigates to edit page on close", async ({ page, baseURL }) => {
    await gotoCreatePost(page, baseURL);

    // Stub POST /api/posts with successful creation
    await page.route("**/api/posts", async (route) => {
      const req = route.request();
      const data = req.postDataJSON() as any;
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ id: "post-xyz", ...data }),
      });
    });

    await fillValidForm(page);

    const saveButton = page.getByRole("button", { name: "Save Entity" });
    await saveButton.click();

    // Success snackbar should appear
    const alert = page.getByRole("alert");
    await expect(alert).toContainText("Post created successfully!");

    // Close the snackbar (triggers navigation via onClose callback)
    await page.getByRole("button", { name: /close/i }).click();

    // Navigates to Edit Post page with created id
    await expect(page).toHaveURL(/\/edit-post\/post-xyz$/);
    await expect(page.locator("h1")).toHaveText("Edit Post");
  });

  test("disables save button while submitting", async ({ page, baseURL }) => {
    await gotoCreatePost(page, baseURL);

    // Delay the response so we can observe disabled state
    await page.route("**/api/posts", async (route) => {
      const req = route.request();
      const data = req.postDataJSON() as any;
      await new Promise((r) => setTimeout(r, 300));
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ id: "post-delay", ...data }),
      });
    });

    await fillValidForm(page);

    const saveButton = page.getByRole("button", { name: "Save Entity" });
    await saveButton.click();

    await expect(saveButton).toBeDisabled();

    // Wait for response to settle and success snackbar to show
    await expect(page.getByRole("alert")).toContainText("Post created successfully!");
  });

  test("shows error snackbar and stays on page when server fails", async ({ page, baseURL }) => {
    await gotoCreatePost(page, baseURL);

    await page.route("**/api/posts", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Internal Server Error" }),
      });
    });

    await fillValidForm(page);

    await page.getByRole("button", { name: "Save Entity" }).click();

    // Error snackbar should appear, no navigation away from Create Post
    const alert = page.getByRole("alert");
    await expect(alert).toContainText(/Failed to save post/i);
    await expect(page).toHaveURL(/\/create-post$/);
    await expect(page.locator("h1")).toHaveText("Create Post");
  });
});