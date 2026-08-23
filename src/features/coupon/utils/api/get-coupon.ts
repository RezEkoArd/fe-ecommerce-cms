import { apiClient } from "@/lib/api-client";
import { Coupon } from "../../types/api";

export async function getCoupon(id: string): Promise<Coupon> {
    return apiClient.get(`/coupons/${id}`);
}
