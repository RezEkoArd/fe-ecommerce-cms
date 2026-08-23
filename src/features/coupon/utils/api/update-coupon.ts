import { apiClient } from "@/lib/api-client";
import { toPayload } from "../utils";
import { CouponOutput } from "../../schema/coupon-schema";
import { Coupon } from "../../types/api";

export async function updateCoupon(
    id: string,
    input: CouponOutput,
): Promise<Coupon> {
    return apiClient.put(`/coupons/${id}`, toPayload(input));
}

// Toggle aktif/nonaktif — backend menerima update sebagian,
// jadi cukup kirim satu field tanpa data kupon lainnya.
export async function toggleCouponActive(
    id: string,
    isActive: boolean,
): Promise<Coupon> {
    return apiClient.put(`/coupons/${id}`, { is_active: isActive });
}
