import {z} from "zod";

export const productSchema = z.object({
    name: z
        .string()
        .min(2, "Nama product minimal 2 karakter")
        .max(200, "Nama produk maksimal 200 karakter"),
    description: z
        .string()
        .max(500, "Deskripsi maksimal 500 karakter")
        .optional()
        .or(z.literal("")),
    price: z.coerce
        .number("Harga harus berupa angka")
        .positive("Harga harus lebih dari 0"),
    stock: z.coerce
        .number("Stok harus berupa angka")
        .int("Stok harus bilangan bulat")
        .min(0, "Stok tidak boleh negatif"),
    category_id: z.uuid("Kategory tidak valid").optional().or(z.literal("")),
})

// `z.coerce` membuat tipe input dan output berbeda: input menerima apa saja
// (nilai mentah dari <input>), output sudah berupa number setelah validasi.
export type ProductInput = z.input<typeof productSchema>;
export type ProductOutput = z.output<typeof productSchema>;