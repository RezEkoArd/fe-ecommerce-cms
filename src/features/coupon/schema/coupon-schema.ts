import {z} from 'zod';

export const couponSchema = z.object({
    code: z.string().min(3, "Kode minimal 3 Karakter")
    .max(50, "Kode maksimal 50 karakter"),
    discount_type: z.enum(["percent", "fixed"], "Pilih jenis diskon"),
    discount_value: z.coerce
        .number("Nilai diskon harus berupa angka")
        .positive("Nilai diskon harus lebih dari 0"),
    expires_at: z.string().optional().or(z.literal("")),
    is_active: z.boolean(),
})
// Diskon persen tidak boleh lebih dari 100 — backend juga menolaknya,
// ini agar user tahu sebelum request dikirim.
.refine(
    (data) => data.discount_type !== "percent" || data.discount_value <= 100,
    {
        message: "Diskon persentase maksimal 100%",
        path: ["discount_value"],
    },
)

// `z.coerce` membuat tipe input dan output berbeda: input menerima apa saja
// (nilai mentah dari <input>), output sudah berupa number setelah validasi.
export type CouponInput = z.input<typeof couponSchema>;
export type CouponOutput = z.output<typeof couponSchema>;