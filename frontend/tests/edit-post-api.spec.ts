import { test, expect } from "@playwright/test";

function buildValidPost() {
  return {
    img: "image.jpg",
    tags: ["alpha", "beta"],
    title: "A valid post title",
    description: "A valid description within the allowed length.",
    authors: [
      {
        name: "Alice",
        avatar: "avatar.png",
      },
    ],
  };
}

async function postCreate(request: any, data: Record<string, any>) {
  const res = await request.post("/api/posts", { data });
  expect(res.status(), await res.text()).toBe(201);
  return res.json();
}

async function putUpdate(request: any, id: string, data: Record<string, any>) {
  const res = await request.put(`/api/posts/${id}`, { data });
  return res;
}

async function expectValidationError(res: any) {
  expect(res.status()).toBe(400);
  const body = await res.json();
  expect(body).toMatchObject({ message: "Validation failed" });
  expect(Array.isArray(body.errors)).toBe(true);
  return body.errors as Array<{ path: (string | number)[]; message: string }>;
}

function expectIssue(
  issues: Array<{ path: (string | number)[]; message: string }>,
  expectedPath: (string | number)[],
  expectedMessage: string
) {
  expect(issues).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ path: expectedPath, message: expectedMessage }),
    ])
  );
}

function expectIssueUnderKey(
  issues: Array<{ path: (string | number)[]; message: string }>,
  key: string,
  expectedMessage: string
) {
  const match = issues.find(
    (issue) =>
      issue.message === expectedMessage &&
      Array.isArray(issue.path) &&
      issue.path[0] === key
  );
  expect(match, `Expected issue under ${key} with message: ${expectedMessage}`).toBeTruthy();
}

// Tests create a valid post first, then exercise PUT /api/posts/{id}

test.describe("Update Post API validation (zod rules)", () => {
  let postId: string;
  let base: any;

  test.beforeEach(async ({ request }) => {
    base = buildValidPost();
    const created = await postCreate(request, base);
    postId = created.id;
    expect(typeof postId).toBe("string");
    expect(postId.length).toBeGreaterThan(0);
  });

  test("succeeds with valid update payload", async ({ request }) => {
    const update = {
      title: "Updated title",
      tags: ["gamma", "alpha"],
      description: "Updated description",
      img: "updated.png",
      authors: [{ name: "Bob", avatar: "bob.webp" }],
    };

    const res = await putUpdate(request, postId, update);
    expect(res.status(), await res.text()).toBe(200);
    const json = await res.json();

    expect(json.id).toBe(postId);
    expect(json.title).toBe(update.title);
    expect(json.description).toBe(update.description);
    expect(json.img).toBe(update.img);
    expect(Array.isArray(json.tags)).toBe(true);
    expect(new Set(json.tags)).toEqual(new Set(update.tags));
    expect(Array.isArray(json.authors)).toBe(true);
    expect(json.authors[0]).toMatchObject(update.authors[0]);
  });

  test("rejects empty img", async ({ request }) => {
    const res = await putUpdate(request, postId, { img: "" });
    const issues = await expectValidationError(res);
    expectIssue(issues, ["img"], "Image is required");
  });

  test("rejects img with invalid extension", async ({ request }) => {
    const res = await putUpdate(request, postId, { img: "file.txt" });
    const issues = await expectValidationError(res);
    expectIssue(issues, ["img"], "Must be a valid image file");
  });

  test("rejects empty tags array (must contain at least one)", async ({ request }) => {
    const res = await putUpdate(request, postId, { tags: [] as string[] });
    const issues = await expectValidationError(res);
    expectIssue(issues, ["tags"], "Must contain at least one valid tag");
  });

  test("rejects tags containing empty string entries", async ({ request }) => {
    const res = await putUpdate(request, postId, { tags: ["alpha", ""] });
    const issues = await expectValidationError(res);
    expectIssueUnderKey(issues, "tags", "Tag cannot be empty");
  });

  test("rejects empty title", async ({ request }) => {
    const res = await putUpdate(request, postId, { title: "" });
    const issues = await expectValidationError(res);
    expectIssue(issues, ["title"], "Title cannot be null");
  });

  test("rejects title exceeding 60 characters", async ({ request }) => {
    const res = await putUpdate(request, postId, { title: "T".repeat(61) });
    const issues = await expectValidationError(res);
    expectIssue(issues, ["title"], "Title cannot exceed 60 characters");
  });

  test("rejects empty description", async ({ request }) => {
    const res = await putUpdate(request, postId, { description: "" });
    const issues = await expectValidationError(res);
    expectIssue(issues, ["description"], "Description cannot be null");
  });

  test("rejects description exceeding 200 characters", async ({ request }) => {
    const res = await putUpdate(request, postId, { description: "D".repeat(201) });
    const issues = await expectValidationError(res);
    expectIssue(issues, ["description"], "Description cannot exceed 200 characters");
  });

  test("rejects empty authors array (at least one author required)", async ({ request }) => {
    const res = await putUpdate(request, postId, { authors: [] as any[] });
    const issues = await expectValidationError(res);
    expectIssue(issues, ["authors"], "At least one author is required");
  });

  test("rejects author with empty name", async ({ request }) => {
    const res = await putUpdate(request, postId, {
      authors: [{ name: "", avatar: "avatar.jpg" }],
    });
    const issues = await expectValidationError(res);
    expectIssue(issues, ["authors", 0, "name"], "Author name is required");
  });

  test("rejects author with empty avatar", async ({ request }) => {
    const res = await putUpdate(request, postId, {
      authors: [{ name: "Alice", avatar: "" }],
    });
    const issues = await expectValidationError(res);
    expectIssue(issues, ["authors", 0, "avatar"], "Avatar is required");
  });

  test("rejects author avatar with invalid extension", async ({ request }) => {
    const res = await putUpdate(request, postId, {
      authors: [{ name: "Alice", avatar: "avatar.txt" }],
    });
    const issues = await expectValidationError(res);
    expectIssue(issues, ["authors", 0, "avatar"], "Avatar must be a valid image file");
  });
});
