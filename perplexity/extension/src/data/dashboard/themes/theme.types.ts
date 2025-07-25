import { z } from "zod";

import type { BuiltInColorValue } from "@/data/dashboard/themes/built-in-colors";

export const ThemeFormSchema = z
  .object({
    title: z.string().min(1, { message: "A title is required" }),
    accentColor: z
      .string()
      .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, {
        message: "Must be a valid hex color (e.g. #72AEFD)",
      })
      .transform((val) => val.toUpperCase())
      .or(z.literal(""))
      .optional(),
    builtInAccentColor: z.string() as z.ZodType<BuiltInColorValue>,
    accentColorSelection: z.enum(["built-in", "custom", "default"]),
    fonts: z.object({
      ui: z.string().optional(),
      mono: z.string().optional(),
    }),
    enhanceThreadTypography: z.boolean().optional(),
    customCss: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.accentColorSelection === "custom") {
        return !!data.accentColor && data.accentColor !== "";
      }
      return true;
    },
    {
      message: "Accent color is required when custom color is selected",
      path: ["accentColor"],
    },
  )
  .refine(
    (data) => {
      if (data.accentColorSelection === "built-in") {
        return !!data.builtInAccentColor;
      }
      return true;
    },
    {
      message:
        "Built-in accent color is required when built-in color is selected",
      path: ["builtInAccentColor"],
    },
  );

export type ThemeFormValues = z.infer<typeof ThemeFormSchema>;

export const ThemeSchema = z.object({
  id: z.string().refine((id) => /^[a-zA-Z0-9-]+$/.test(id), {
    message: "Must only contains a-z, A-Z, 0-9, and -",
  }),
  title: z.string(),
  description: z.string().optional(),
  displayBannerColors: z.array(z.string()),
  css: z.string(), // final css when combined with the base css and all the misc modifications
  config: ThemeFormSchema.optional(),
});

export type Theme = z.infer<typeof ThemeSchema>;
