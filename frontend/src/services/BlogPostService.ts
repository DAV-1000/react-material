import { BlogPost } from "../types";
const ARTICLE_URL = import.meta.env.VITE_BLOG_ARTICLE_URL;

export interface BlogPostService {
  get: () => Promise<BlogPost[]>;
  getById: (id: string) => Promise<BlogPost>;
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

  getById: async (id: string) => {
    const posts = await blogPostService.get();
    return posts.filter(post => {
      return post.id == id;
    })[0] || null; // Return the first match or null if not found
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
