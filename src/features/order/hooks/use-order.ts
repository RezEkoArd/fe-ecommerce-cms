"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders } from "../utils/api/get-orders";
import { getOrder } from "../utils/api/get-order";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api-client";
import { updateOrderStatus } from "../utils/api/update-orders-status";
import { OrderStatus } from "../types/api";

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
