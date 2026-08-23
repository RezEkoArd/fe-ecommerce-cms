import { CouponOutput } from "../schema/coupon-schema";


export function toPayload(input: CouponOutput) {
    return {
        code: input.code.toUpperCase(),
        discount_type: input.discount_type,
        discount_value: String(input.discount_value),
        is_active: input.is_active,
        ...(input.expires_at ? { expires_at: new Date(input.expires_at).toISOString()} : {}),
    };
}