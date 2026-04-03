
import { PagedResponse, PostQuery } from "../types";
const ARTICLE_URL = import.meta.env.VITE_BLOG_ARTICLE_URL;

export type GetFilteredParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  tags?: string[];
};

export interface PostQueryService {
  getFiltered: (params: GetFilteredParams) => Promise<PagedResponse<PostQuery>>;

  getAll: () => Promise<PostQuery[]>;

  /** Get a single blog post by id */
  getById: (id: string) => Promise<PostQuery>;

  getContent: (postId: string | null) => Promise<string>;
}

export const postQueryService: PostQueryService = {
  getFiltered: async (params: GetFilteredParams = {}) => {
      const query = new URLSearchParams();

      if (params.page !== undefined) query.append("page", params.page.toString());
      if (params.pageSize !== undefined) query.append("pageSize", params.pageSize.toString());
      if (params.sortBy) query.append("sortBy", params.sortBy);
      if (params.sortOrder) query.append("sortOrder", params.sortOrder);
      if (params.tags?.length) query.append("tags", params.tags.join(","));

      const url = `/api/v2/posts?${query.toString()}`;
    
      const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return await response.json();
  },
  getAll: async () => {
    const response = await fetch('/api/posts');

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return await response.json();
  },

 async getById(id: string) {
    const res = await fetch(`/api/posts/${id}/detail`);
    if (!res.ok) {
      throw new Error(`Failed to fetch post ${id}: ${res.statusText}`);
    }
    return res.json();
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
