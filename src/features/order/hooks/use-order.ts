"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders } from "../utils/api/get-orders";
import { getOrder } from "../utils/api/get-order";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api-client";
import { updateOrderStatus } from "../utils/api/update-orders-status";
import { OrderStatus } from "../types/api";
import { useAuthStore } from "@/store/auth-store";
import { getMyOrders } from "../utils/api/get-my-order";
import { checkout } from "../utils/api/checkout";
import { useRouter } from "next/navigation";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

export function useOrders() {
  return useQuery({
    queryKey: orderKeys.lists(),
    queryFn: getOrders,
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: orderKeys.detail(id ?? ""),
    queryFn: () => getOrder(id!),
    // Jangan jalan sebelum ada id — dipakai modal yang awalnya kosong.
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast.success("Status pesanan diperbarui");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}


export function useMyOrders() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: [...orderKeys.all, "mine"] as const,
    queryFn: getMyOrders,
    enabled: !!user,
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (couponCode?: string) => checkout(couponCode),
    onSuccess: () => {
      // Keranjang dikosongkan backend saat checkout.
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast.success("Pesanan berhasil dibuat");
      router.push("/pesanan");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
