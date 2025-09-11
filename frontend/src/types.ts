export { Author, BlogPost } from "common"
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