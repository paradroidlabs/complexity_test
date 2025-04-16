import { z } from "zod";

import { ThemeFormSchema } from "@/data/dashboard/themes/theme-form.types";

export const ThemeSchema = z.object({
  id: z.string().refine((id) => /^[a-zA-Z0-9-]+$/.test(id), {
    message: "Must only contains a-z, A-Z, 0-9, and -",
  }),
  title: z.string(),
  description: z.string().optional(),
  featuredImage: z.string().optional(),
  author: z.string(),
  compatibleWith: z.array(z.enum(["desktop", "mobile"])).optional(),
  colorScheme: z.array(z.enum(["light", "dark"])).optional(),
  css: z.string(),
  config: ThemeFormSchema.optional(),
});

export type Theme = z.infer<typeof ThemeSchema>;
