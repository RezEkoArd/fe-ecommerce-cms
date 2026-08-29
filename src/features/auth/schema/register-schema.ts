import { z } from "zod";

// Batasan dari internal/auth/handler.go:
// Name min=2,max=100 · Email format · Password min=8,max=72
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  email: z.email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(72, "Password maksimal 72 karakter"),
  confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;