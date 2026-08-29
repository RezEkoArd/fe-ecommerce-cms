import type { Product } from "@/types/api";

export type CartItem = {
  ID: string;
  CartID: string;
  ProductID: string;
  Quantity: number;
  CreatedAt: string;
  // Hanya Name, Price, Stock yang terisi — Slug & Images kosong.
  Product: Product | null;
};

export type Cart = {
  ID: string;
  UserID: string;
  Items: CartItem[];
  CreatedAt: string;
  UpdatedAt: string;
};
