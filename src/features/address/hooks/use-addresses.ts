"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
    createAddress,
    deleteAddress,
    getAddresses,
    setPrimaryAddress,
    updateAddress,
} from "../utils/api/address-api";
import type { AddressInput } from "../schema/address-schema";
import { getErrorMessage } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";

export const addressKeys = {
    all: ["addresses"] as const,
};

export function useAddresses() {
    const user = useAuthStore((s) => s.user);

    return useQuery({
        queryKey: addressKeys.all,
        queryFn: getAddresses,
        enabled: !!user,
    });
}

export function useCreateAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: addressKeys.all });
            toast.success("Alamat berhasil ditambahkan");
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}

export function useUpdateAddress(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: AddressInput) => updateAddress(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: addressKeys.all });
            toast.success("Alamat berhasil diperbarui");
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}

export function useDeleteAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: addressKeys.all });
            toast.success("Alamat berhasil dihapus");
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}

export function useSetPrimaryAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: setPrimaryAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: addressKeys.all });
            toast.success("Alamat utama diperbarui");
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
