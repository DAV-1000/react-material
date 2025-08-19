import { BlogPost } from "../types";

export interface BlogPostService {
  get: () => Promise<BlogPost[]>;
  getById: (id: string) => Promise<BlogPost>;
}

export const blogPostService: BlogPostService = {
  get: async () => {
    const response = await fetch('/api/HttpExample');

    console.log(response.text());

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
  }
};
