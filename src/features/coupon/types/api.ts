export type Coupon = {
    ID: string;
    Code: string;
    DiscountType: "percent" | "fixed";
    DiscountValue: string;
    ExpiresAt: string | null;
    IsActive: boolean;
};
