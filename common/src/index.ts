export { AuthorSchema } from "./schemas/author.schema.js";
export { PostSchema } from "./schemas/post.schema.js";

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