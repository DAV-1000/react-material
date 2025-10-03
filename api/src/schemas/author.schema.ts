import { z } from "zod";

export const authorSchema = z.object({
  name: z.string().min(1, "Author name is required"),
  avatar: z
    .string()
    .min(1, "Avatar is required")
    .regex(/\.(jpg|jpeg|png|gif|webp)$/i, "Avatar must be a valid image file"),
});

export type Author = z.infer<typeof authorSchema>;