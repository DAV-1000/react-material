import { z } from "zod";

export const authorSchema = z.object({
  name: z.string().min(1, "Author name is required"),
  avatar: z.string().superRefine((val, ctx) => {
    if (!val || val.trim().length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Avatar is required",
      });
      return;
    }

    const isValidImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(val);
    if (!isValidImage) {
      ctx.addIssue({
        code: "custom",
        message: "Avatar must be a valid image file",
      });
    }
  }),
});


export type Author = z.infer<typeof authorSchema>;