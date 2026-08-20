"use client";

import { Product, ProductParams } from '@/types/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { getProducts } from '../utils/api/get-products';
import { createProduct } from '../utils/api/create-products';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api-client';
import { ProductOutput } from '../schema/product-schema';
import { updateProduct } from '../utils/api/update-products';
import { error } from 'console';
import { deleteProduct } from '../utils/api/delete-products';

export const productKeys = {
    all: ["products"] as const,
    lists: () => [...productKeys.all, "list"] as const,
    list: (params: ProductParams) => [...productKeys.lists(), params] as const,
    details: () => [...productKeys.all, "detail"] as const ,
    detail: (slug: string) => [...productKeys.details(), slug] as const,
}

export function useProducts(params: ProductParams = {}) {
    return useQuery({
        queryKey: productKeys.list(params),
        queryFn: () => getProducts(params),
    });
}

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success("Produk berhasil dibuat");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}


export function useUpdateProduct(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: ProductOutput) => updateProduct(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists()});
            toast.success("Product berhasil di perbarui");
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    })
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            toast.success("Produk berhasil dihapus");
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}

export default useProducts