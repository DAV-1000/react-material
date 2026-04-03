export interface Author {
  name: string;
  avatar: string;
}

export interface Post {
  id: string; // Changed to string to match JSON data
  img: string;
  tag: string;
  title: string;
  description: string;
  authors: Author[];
}

export interface PostQuery {
  id: string; // Changed to string to match JSON data
  img: string;
  tag: string;
  title: string;
  description: string;
  authors: Author[];
}

export interface PagedResponse<T> {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc'; // adjust if needed
  filterField: string;
  filterValue: string;
  data: T[];
}



export interface Tag {
  tag: string | null;
  label: string;
};

export interface User {
  userId: string;
  userDetails: string;
  identityProvider: string;
  userRoles: string[];
  claims: { typ: string; val: string }[];
}

