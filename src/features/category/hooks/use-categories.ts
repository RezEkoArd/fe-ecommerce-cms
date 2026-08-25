"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getCategories } from "../utils/api/get-categories";
import { createCategory } from "../utils/api/create-categories";
import { updateCategory } from "../utils/api/update-category";
import { deleteCategory } from "../utils/api/delete-category";
import type { CategoryInput } from "../schema/category-schema";
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

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CategoryInput) => updateCategory(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      // Nama kategori tampil di tabel produk — ikut disegarkan.
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Kategori berhasil diperbarui");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Kategori berhasil dihapus");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
