import { z } from "zod";

// Batasan dari internal/address/handler.go
export const addressSchema = z.object({
    label: z
        .string()
        .min(2, "Label minimal 2 karakter")
        .max(50, "Label maksimal 50 karakter"),
    recipient: z
        .string()
        .min(2, "Nama penerima minimal 2 karakter")
        .max(100, "Nama penerima maksimal 100 karakter"),
    phone: z
        .string()
        .min(8, "No. telepon minimal 8 karakter")
        .max(20, "No. telepon maksimal 20 karakter"),
    street: z
        .string()
        .min(5, "Alamat minimal 5 karakter")
        .max(500, "Alamat maksimal 500 karakter"),
    city: z
        .string()
        .min(2, "Kota minimal 2 karakter")
        .max(100, "Kota maksimal 100 karakter"),
    postal_code: z
        .string()
        .min(4, "Kode pos minimal 4 karakter")
        .max(10, "Kode pos maksimal 10 karakter"),
    is_primary: z.boolean(),
});

export type AddressInput = z.infer<typeof addressSchema>;
