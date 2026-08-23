import { apiClient } from "@/lib/api-client";
import { CouponOutput } from "../../schema/coupon-schema";
import { Coupon } from "../../types/api";
import { toPayload } from "../utils";

export async function createCoupon(input: CouponOutput): Promise<Coupon> {
    return apiClient.post("/coupons", toPayload(input));
}