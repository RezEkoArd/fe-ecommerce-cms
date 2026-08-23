import { apiClient } from "@/lib/api-client";
import { Coupon } from "../../types/api";


export async function getCoupons(): Promise<Coupon[]> {
    return apiClient.get("/coupons");
}