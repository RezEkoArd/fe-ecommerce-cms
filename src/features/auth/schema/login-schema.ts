import {z} from "zod";

export const loginschema = z.object({
    email: z.email("Format email tidak valid"),
    password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(72, "Password maksimal 72 karakter"),
});

export type LoginInput = z.infer<typeof loginschema>