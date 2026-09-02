import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Nama kategori minimal 2 karakter")
    .max(100, "Nama kategori maksimal 100 karakter"),
  image_url: z
    .string()
    .max(500, "URL gambar terlalu panjang")
    .optional()
    .or(z.literal("")),
});

export type CategoryInput = z.infer<typeof categorySchema>;
