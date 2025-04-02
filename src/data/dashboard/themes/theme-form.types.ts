import { z } from "zod";

export const ThemeFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  fonts: z.object({
    ui: z.string().optional(),
    mono: z.string().optional(),
  }),
  accentColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, {
      message: "Must be a valid hex color (e.g. #72AEFD)",
    })
    .transform((val) => val.toUpperCase())
    .or(z.literal(""))
    .optional(),
  enhanceThreadTypography: z.boolean().optional(),
  customCss: z.string().optional(),
});

export type ThemeFormValues = z.infer<typeof ThemeFormSchema>;
