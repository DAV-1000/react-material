import { z } from "zod";
import { AuthorSchema } from "./author.schema";

export const PostSchema = z.object({
  id: z.string().min(1, "ID is required"),
  img: z
    .string()
    .min(1, "Image is required")
    .regex(/\.(jpg|jpeg|png|gif|webp)$/i, "Must be a valid image file"),
  tag: z
    .string()
    .min(1, "Tag cannot be empty")
    .transform((val) =>
      val.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
    )
    .refine(
      (tags) => tags.length > 0,
      "Must contain at least one valid tag"
    ),
  title: z
    .string()
    .min(1, "Title cannot be null")
    .max(60, "Title cannot exceed 60 characters"),
  description: z
    .string()
    .min(1, "Description cannot be null")
    .max(200, "Description cannot exceed 200 characters"),
  authors: z.array(AuthorSchema).min(1, "At least one author is required"),
});

// export type BlogPost = z.infer<typeof postSchema>;
