import { test, expect } from "@playwright/test";

// Helper to build a valid post payload matching api/src/schemas/post.schema.ts
export function buildValidPost() {
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

export async function postCreate(request: any, data: Record<string, any>) {
  const res = await request.post("/api/posts", {
    data,
  });
  return res;
}

async function expectValidationError(res: any) {
  expect(res.status()).toBe(400);
  const body = await res.json();
  expect(body).toMatchObject({ message: "Validation failed" });
  expect(Array.isArray(body.errors)).toBe(true);
  return body.errors as Array<{ path: (string | number)[]; message: string }>;
}

function expectIssue(issues: Array<{ path: (string | number)[]; message: string }>, expectedPath: (string | number)[], expectedMessage: string) {
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

// Note: Authorization is handled via global-setup and storageState configured in playwright.config.ts
// These tests call the API directly and assert zod validation behavior.

test.describe("Create Post API validation (zod rules)", () => {
  test("succeeds with valid payload and returns generated non-empty id", async ({ request }) => {
    const payload = buildValidPost();
    const res = await postCreate(request, payload);
    expect(res.status()).toBe(201);
    const json = await res.json();

    // Basic shape assertions
    expect(typeof json.id).toBe("string");
    expect(json.id.length).toBeGreaterThan(0); // id rule: non-empty string (server-generated)

    expect(json.title).toBe(payload.title);
    expect(json.description).toBe(payload.description);
    expect(json.img).toBe(payload.img);
    // tags may be sorted server-side; ensure it's an array containing submitted values
    expect(Array.isArray(json.tags)).toBe(true);
    expect(new Set(json.tags)).toEqual(new Set(payload.tags));

    // authors preserved
    expect(Array.isArray(json.authors)).toBe(true);
    expect(json.authors[0]).toMatchObject(payload.authors[0]);
  });

  test("rejects empty img", async ({ request }) => {
    const payload = { ...buildValidPost(), img: "" };
    const res = await postCreate(request, payload);
    const issues = await expectValidationError(res);
    expectIssue(issues, ["img"], "Image is required");
  });

  test("rejects img with invalid extension", async ({ request }) => {
    const payload = { ...buildValidPost(), img: "file.txt" };
    const res = await postCreate(request, payload);
    const issues = await expectValidationError(res);
    expectIssue(issues, ["img"], "Must be a valid image file");
  });

  test("rejects empty tags array (must contain at least one)", async ({ request }) => {
    const payload = { ...buildValidPost(), tags: [] as string[] };
    const res = await postCreate(request, payload);
    const issues = await expectValidationError(res);
    expectIssue(issues, ["tags"], "Must contain at least one valid tag");
  });

  test("rejects tags containing empty string entries", async ({ request }) => {
    const payload = { ...buildValidPost(), tags: ["alpha", ""] };
    const res = await postCreate(request, payload);
    const issues = await expectValidationError(res);
    // Server sorts tags before validation; assert under 'tags' regardless of index
    expectIssueUnderKey(issues, "tags", "Tag cannot be empty");
  });

  test("rejects empty title", async ({ request }) => {
    const payload = { ...buildValidPost(), title: "" };
    const res = await postCreate(request, payload);
    const issues = await expectValidationError(res);
    expectIssue(issues, ["title"], "Title cannot be null");
  });

  test("rejects title exceeding 60 characters", async ({ request }) => {
    const longTitle = "T".repeat(61);
    const payload = { ...buildValidPost(), title: longTitle };
    const res = await postCreate(request, payload);
    const issues = await expectValidationError(res);
    expectIssue(issues, ["title"], "Title cannot exceed 60 characters");
  });

  test("rejects empty description", async ({ request }) => {
    const payload = { ...buildValidPost(), description: "" };
    const res = await postCreate(request, payload);
    const issues = await expectValidationError(res);
    expectIssue(issues, ["description"], "Description cannot be null");
  });

  test("rejects description exceeding 200 characters", async ({ request }) => {
    const longDesc = "D".repeat(201);
    const payload = { ...buildValidPost(), description: longDesc };
    const res = await postCreate(request, payload);
    const issues = await expectValidationError(res);
    expectIssue(issues, ["description"], "Description cannot exceed 200 characters");
  });

  test("rejects empty authors array (at least one author required)", async ({ request }) => {
    const payload = { ...buildValidPost(), authors: [] as any[] };
    const res = await postCreate(request, payload);
    const issues = await expectValidationError(res);
    expectIssue(issues, ["authors"], "At least one author is required");
  });

  test("rejects author with empty name", async ({ request }) => {
    const payload = {
      ...buildValidPost(),
      authors: [
        {
          name: "",
          avatar: "avatar.jpg",
        },
      ],
    };
    const res = await postCreate(request, payload);
    const issues = await expectValidationError(res);
    expectIssue(issues, ["authors", 0, "name"], "Author name is required");
  });

  test("rejects author with empty avatar", async ({ request }) => {
    const payload = {
      ...buildValidPost(),
      authors: [
        {
          name: "Alice",
          avatar: "",
        },
      ],
    };
    const res = await postCreate(request, payload);
    const issues = await expectValidationError(res);
    expectIssue(issues, ["authors", 0, "avatar"], "Avatar is required");
  });

  test("rejects author avatar with invalid extension", async ({ request }) => {
    const payload = {
      ...buildValidPost(),
      authors: [
        {
          name: "Alice",
          avatar: "avatar.txt",
        },
      ],
    };
    const res = await postCreate(request, payload);
    const issues = await expectValidationError(res);
    expectIssue(issues, ["authors", 0, "avatar"], "Avatar must be a valid image file");
  });
});
