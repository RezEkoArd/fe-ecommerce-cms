export type OrderStatus = 
    | "draft"
    | "paid"
    | "shipped"
    | "completed"
    | "cancelled";

export type Order = {
    ID: string;
    UserID: string;
    CouponID: string | null;
    Status: OrderStatus;
    Subtotal: string;
    Tax: string;
    Discount: string;
    Total: string;
    Items: OrderItems[] | null
    CreatedAt: string;
    UpdatedAt: string;
    // Hanya terisi pada endpoint detail (GET /admin/orders/:id).
    User?: OrderUser | null;
    Coupon?: OrderCoupon | null;
}

export type OrderUser = {
    ID: string;
    Name: string;
    Email: string;
}

export type OrderCoupon = {
    ID: string;
    Code: string;
    DiscountType: "percent" | "fixed";
    DiscountValue: string;
    ExpiresAt: string | null;
    IsActive: boolean;
}

export type OrderItems = {
    ID: string;
    OrderID: string;
    ProductID: string | null;
    ProductName: string;
    Price: string;
    Quantity: number;
}