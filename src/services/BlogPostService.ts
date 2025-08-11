import { BlogPost } from "../types";

export interface BlogPostService {
  getAll: () => Promise<BlogPost[]>;
  getTopSix: () => Promise<BlogPost[]>;
  getById: (id: string) => Promise<BlogPost>;
}

export const blogPostService: BlogPostService = {
  getAll: async () => {
    const response = await fetch('/data/blogPosts.json');
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return await response.json();
  },

  getTopSix: async () => {
    const allPosts = await blogPostService.getAll();
    return allPosts.slice(0, 6);
  },

    getById: async (id: string) => {
    const posts = await blogPostService.getAll();
    return posts.filter(post => {
      return post.id == id;
    })[0] || null; // Return the first match or null if not found
  }
};
