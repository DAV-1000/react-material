import { z } from "zod";
import { authorSchema } from "./author.schema.js";

export const postSchema = z.object({
  id: z.string().min(1, "ID cannot be empty"),
  img: z
    .string()
    .min(1, "Image is required")
    .regex(/\.(jpg|jpeg|png|gif|webp)$/i, "Must be a valid image file"),
  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .nonempty("Must contain at least one valid tag"),
  title: z
    .string()
    .min(1, "Title cannot be null")
    .max(60, "Title cannot exceed 60 characters"),
  description: z
    .string()
    .min(1, "Description cannot be null")
    .max(200, "Description cannot exceed 200 characters"),
  authors: z.array(authorSchema).min(1, "At least one author is required"),
});

export type PostCommand = z.infer<typeof postSchema>;

export function newPost(): PostCommand {
  return {
    id: "NEW_POST",
    img: "",
    tags: [],
    title: "",
    description: "",
    authors: [],
  };
}
