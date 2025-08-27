import { BlogPost } from "../types";
const ARTICLE_URL = import.meta.env.VITE_BLOG_ARTICLE_URL;

export interface BlogPostService {
  // get: () => Promise<BlogPost[]>;
  // getById: (id: string) => Promise<BlogPost>;
    /** Get all blog posts */
  get: () => Promise<BlogPost[]>;

  /** Get a single blog post by id */
  getById: (id: string) => Promise<BlogPost>;

  /** Create a new blog post */
  create: (post: Omit<BlogPost, "id" | "createdAt">) => Promise<BlogPost>;

  /** Update an existing blog post */
  update: (id: string, post: Partial<Omit<BlogPost, "id" | "createdAt">>) => Promise<BlogPost>;

  /** Delete a blog post by id */
  delete: (id: string) => Promise<void>;
  getContent: (postId: string | null) => Promise<string>;
}

export const blogPostService: BlogPostService = {
  get: async () => {
    const response = await fetch('/api/posts');

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return await response.json();
  },

 async getById(id: string) {
    const res = await fetch(`/api/posts/${id}`);
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
    return res.json();
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
      throw new Error('Post ID is null');
    }
    const url = `${ARTICLE_URL}${postId}.md`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch content');
    }

    const text = await response.text();

    if (text.trim().startsWith("<!DOCTYPE html") || text.trim().startsWith("<html")) {
      return "CONTENT UNAVAILABLE";
    }

    return text;

  },
};
