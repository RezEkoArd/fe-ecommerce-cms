import { z } from "zod";

// Batasan dari internal/user/handler.go
export const profileSchema = z.object({
    name: z
        .string()
        .min(2, "Nama minimal 2 karakter")
        .max(100, "Nama maksimal 100 karakter"),
    email: z.email("Format email tidak valid"),
    phone: z
        .string()
        .max(20, "No. telepon maksimal 20 karakter")
        .optional()
        .or(z.literal("")),
    birth_date: z.string().optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const passwordSchema = z
    .object({
        current_password: z
            .string()
            .min(8, "Password minimal 8 karakter")
            .max(72, "Password maksimal 72 karakter"),
        new_password: z
            .string()
            .min(8, "Password baru minimal 8 karakter")
            .max(72, "Password baru maksimal 72 karakter"),
        confirm_password: z.string(),
    })
    .refine((data) => data.new_password === data.confirm_password, {
        message: "Konfirmasi password tidak cocok",
        path: ["confirm_password"],
    })
    // Backend juga menolaknya — dicegah lebih awal agar tidak perlu request.
    .refine((data) => data.new_password !== data.current_password, {
        message: "Password baru harus berbeda dari yang lama",
        path: ["new_password"],
    });

export type PasswordInput = z.infer<typeof passwordSchema>;
