import { PostQuery } from "../types";

const ARTICLE_URL = import.meta.env.VITE_BLOG_ARTICLE_URL;

export type GetFilteredParams = {
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  tags?: string[];
};

type OffsetResponse<T> = {
  data: T[];
  page: number;
  pageSize: number;
};

export interface PostQueryService {
  getFiltered: (
    params?: GetFilteredParams
  ) => Promise<
    OffsetResponse<PostQuery> & {
      hasNext: boolean;
      hasPrev: boolean;
    }
  >;

  next: (
    params?: GetFilteredParams
  ) => Promise<
    OffsetResponse<PostQuery> & {
      hasNext: boolean;
      hasPrev: boolean;
    }
  >;

  prev: (
    params?: GetFilteredParams
  ) => Promise<
    OffsetResponse<PostQuery> & {
      hasNext: boolean;
      hasPrev: boolean;
    }
  >;

  reset: () => void;

  getAll: () => Promise<PostQuery[]>;
  getById: (id: string) => Promise<PostQuery>;
  getContent: (postId: string | null) => Promise<string>;
}

// --- 📄 Pagination state ---
let page = 1;
let lastQueryKey = "";

// --- Helpers ---
const buildQueryKey = (params: GetFilteredParams) =>
  JSON.stringify({
    pageSize: params.pageSize ?? 10,
    sortBy: params.sortBy ?? "title",
    sortOrder: params.sortOrder ?? "ASC",
    tags: params.tags ?? [],
  });

const ensureQueryState = (params: GetFilteredParams) => {
  const key = buildQueryKey(params);

  if (key !== lastQueryKey) {
    page = 1;
    lastQueryKey = key;
  }
};

const buildUrl = (params: GetFilteredParams, page: number) => {
  const query = new URLSearchParams();

  query.set("pageSize", String(params.pageSize ?? 10));
  query.set("page", String(page)); // ✅ use page instead of token
  query.set("sortBy", params.sortBy ?? "title");
  query.set("sortOrder", params.sortOrder ?? "ASC");

  if (params.tags?.length) {
    query.set("tags", params.tags.join(","));
  }

  return `/api/v2/posts?${query.toString()}`;
};

// --- Core fetch ---
const fetchPage = async (
  params: GetFilteredParams,
  page: number
): Promise<OffsetResponse<PostQuery>> => {
  const url = buildUrl(params, page);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
};

// --- Service ---
export const postQueryService: PostQueryService = {
  async getFiltered(params: GetFilteredParams = {}) {
    ensureQueryState(params);

    const data = await fetchPage(params, page);

    return {
      ...data,
      hasNext: data.data.length === (params.pageSize ?? 10), // ✅ heuristic
      hasPrev: page > 1,
    };
  },

  async next(params: GetFilteredParams = {}) {
    ensureQueryState(params);

    page++;

    const data = await fetchPage(params, page);

    return {
      ...data,
      hasNext: data.data.length === (params.pageSize ?? 10),
      hasPrev: page > 1,
    };
  },

  async prev(params: GetFilteredParams = {}) {
    ensureQueryState(params);

    if (page > 1) {
      page--;
    }

    const data = await fetchPage(params, page);

    return {
      ...data,
      hasNext: data.data.length === (params.pageSize ?? 10),
      hasPrev: page > 1,
    };
  },

  reset() {
    page = 1;
    lastQueryKey = "";
  },

  async getAll() {
    const response = await fetch("/api/posts");

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    return response.json();
  },

  async getById(id: string) {
    const res = await fetch(`/api/posts/${id}/detail`);
    if (!res.ok) {
      throw new Error(`Failed to fetch post ${id}: ${res.statusText}`);
    }
    return res.json();
  },

  async getContent(postId: string | null) {
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