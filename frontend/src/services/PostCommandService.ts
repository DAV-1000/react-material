import { PostCommand } from "../schemas/post.schema";
const ARTICLE_URL = import.meta.env.VITE_BLOG_ARTICLE_URL;

export interface PostCommandService {
  /** Get a single blog post by id */
  getById: (id: string) => Promise<PostCommand>;

  /** Create a new blog post */
  create: (post: Omit<PostCommand, "id" | "createdAt">) => Promise<PostCommand>;

  /** Update an existing blog post */
  update: (
    id: string,
    post: Partial<Omit<PostCommand, "id" | "createdAt">>
  ) => Promise<PostCommand>;

  /** Delete a blog post by id */
  delete: (id: string) => Promise<void>;
  getContent: (postId: string | null) => Promise<string>;
}

export const postCommandService: PostCommandService = {
  async getById(id: string) {
    const res = await fetch(`/api/posts/${id}/edit`);
    if (!res.ok) {
      throw new Error(`Failed to fetch post ${id}: ${res.statusText}`);
    }
    return res.json();
  },

  async create(post) {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    if (!res.ok) {
      throw new Error(`Failed to create post: ${res.statusText}`);
    }
    const rtn = res.json();
    console.log("Created post:", rtn);
    return rtn;
  },

  async update(id, post) {
    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    if (!res.ok) {
      throw new Error(`Failed to update post ${id}: ${res.statusText}`);
    }
    return res.json();
  },

  async delete(id) {
    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(`Failed to delete post ${id}: ${res.statusText}`);
    }
  },

  getContent: async (postId: string | null) => {
    if (!postId) {
      throw new Error("Post ID is null");
    }
    const url = `${ARTICLE_URL}${postId}.md`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch content");
    }

    const text = await response.text();

    if (
      text.trim().startsWith("<!DOCTYPE html") ||
      text.trim().startsWith("<html")
    ) {
      return "CONTENT UNAVAILABLE";
    }

    return text;
  },
};
