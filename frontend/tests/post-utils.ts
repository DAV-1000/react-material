import { expect } from "@playwright/test";

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
  const res = await request.post("/api/posts", { data });
  expect(res.status(), await res.text()).toBe(201);
  return res.json();
}