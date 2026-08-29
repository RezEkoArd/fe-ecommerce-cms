"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getCart } from "../utils/api/get-cart";
import {
  addCartItem,
  removeCartItem,
  updateCartItem,
} from "../utils/api/cart-items";
import { getErrorMessage } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";

export const cartKeys = {
  all: ["cart"] as const,
};

export function useCart() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: cartKeys.all,
    queryFn: getCart,
    // Keranjang butuh login — jangan memanggil endpoint kalau belum masuk.
    enabled: !!user,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => addCartItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success("Ditambahkan ke keranjang");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => updateCartItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success("Item dihapus dari keranjang");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
