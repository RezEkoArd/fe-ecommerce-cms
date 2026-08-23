"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getCategories } from "../utils/api/get-categories";
import { createCategory } from "../utils/api/create-categories";
import { getErrorMessage } from "@/lib/api-client";

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: getCategories,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      // Kategori muncul di dropdown form produk — segarkan juga.
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Kategori berhasil dibuat");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
