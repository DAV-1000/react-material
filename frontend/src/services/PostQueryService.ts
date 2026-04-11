import { PostQuery } from "../types";

const ARTICLE_URL = import.meta.env.VITE_BLOG_ARTICLE_URL;

export type GetFilteredParams = {
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  tags?: string[];
};

type ContinuationResponse<T> = {
  continuationToken: string | null;
  data: T[];
};

export interface PostQueryService {
  getFiltered: (params?: GetFilteredParams) => Promise<ContinuationResponse<PostQuery> & {
    hasNext: boolean;
    hasPrev: boolean;
  }>;

  next: (params?: GetFilteredParams) => Promise<ContinuationResponse<PostQuery> & {
    hasNext: boolean;
    hasPrev: boolean;
  }>;

  prev: (params?: GetFilteredParams) => Promise<ContinuationResponse<PostQuery> & {
    hasNext: boolean;
    hasPrev: boolean;
  }>;

  reset: () => void;

  getAll: () => Promise<PostQuery[]>;
  getById: (id: string) => Promise<PostQuery>;
  getContent: (postId: string | null) => Promise<string>;
}

// --- 🔁 Pagination state (client-side token stack) ---
let tokens: (string | null)[] = [null];
let index = 0;
let lastQueryKey = "";

// --- Helpers ---
const buildQueryKey = (params: GetFilteredParams) =>
  JSON.stringify({
    pageSize: params.pageSize ?? 10,
    sortBy: params.sortBy ?? "createdAt",
    sortOrder: params.sortOrder ?? "ASC",
    tags: params.tags ?? [],
  });

const ensureQueryState = (params: GetFilteredParams) => {
  const key = buildQueryKey(params);

  if (key !== lastQueryKey) {
    tokens = [null];
    index = 0;
    lastQueryKey = key;
  }
};

const buildUrl = (
  params: GetFilteredParams,
  continuationToken?: string | null
) => {
  const query = new URLSearchParams();

  query.set("pageSize", String(params.pageSize ?? 10));
  query.set("sortBy", params.sortBy ?? "createdAt");
  query.set("sortOrder", params.sortOrder ?? "ASC");

  if (params.tags?.length) {
    query.set("tags", params.tags.join(","));
  }

  if (continuationToken) {
    query.set("continuationToken", continuationToken);
  }

  return `/api/v2/posts?${query.toString()}`;
};

// --- Core fetch ---
const fetchPage = async (
  params: GetFilteredParams,
  token: string | null
): Promise<ContinuationResponse<PostQuery>> => {
  const url = buildUrl(params, token);

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

    const token = tokens[index];
    const data = await fetchPage(params, token);

    return {
      ...data,
      hasNext: !!data.continuationToken,
      hasPrev: index > 0,
    };
  },

  async next(params: GetFilteredParams = {}) {
    ensureQueryState(params);

    const currentToken = tokens[index];
    const data = await fetchPage(params, currentToken);

    const nextToken = data.continuationToken ?? null;

    // store next token safely
    if (tokens[index + 1] !== nextToken) {
      tokens = tokens.slice(0, index + 1);
      tokens.push(nextToken);
    }

    index++;

    return {
      ...data,
      hasNext: !!nextToken,
      hasPrev: index > 0,
    };
  },

  async prev(params: GetFilteredParams = {}) {
    ensureQueryState(params);

    if (index === 0) {
      return this.getFiltered(params);
    }

    index--;

    const token = tokens[index];
    const data = await fetchPage(params, token);

    return {
      ...data,
      hasNext: !!data.continuationToken,
      hasPrev: index > 0,
    };
  },

  reset() {
    tokens = [null];
    index = 0;
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