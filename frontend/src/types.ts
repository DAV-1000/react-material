export interface Author {
  name: string;
  avatar: string;
}

export interface BlogPost {
  id: string; // Changed to string to match JSON data
  img: string;
  tag: string;
  title: string;
  description: string;
  authors: Author[];
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