"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getCoupons } from "../utils/api/get-coupons";
import { getCoupon } from "../utils/api/get-coupon";
import { createCoupon } from "../utils/api/create-coupon";
import { deleteCoupon } from "../utils/api/delete-coupon";
import { toggleCouponActive, updateCoupon } from "../utils/api/update-coupon";
import { CouponOutput } from "../schema/coupon-schema";
import { getErrorMessage } from "@/lib/api-client";

export const couponKeys = {
    all: ["coupons"] as const,
    lists: () => [...couponKeys.all, "list"] as const,
    details: () => [...couponKeys.all, "detail"] as const,
    detail: (id: string) => [...couponKeys.details(), id] as const,
};

export function useCoupons() {
    return useQuery({
        queryKey: couponKeys.lists(),
        queryFn: getCoupons,
    });
}

export function useCoupon(id: string | undefined) {
    return useQuery({
        queryKey: couponKeys.detail(id ?? ""),
        queryFn: () => getCoupon(id!),
        // Jangan jalan sebelum ada id — dipakai modal yang awalnya kosong.
        enabled: !!id,
    });
}

export function useCreateCoupon() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCoupon,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: couponKeys.lists()});
            toast.success("Kupon berhasil dibuat");
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}

export function useUpdateCoupon(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CouponOutput) => updateCoupon(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: couponKeys.all });
            toast.success("Kupon berhasil diperbarui");
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}

export function useToggleCouponActive() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            toggleCouponActive(id, isActive),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: couponKeys.all });
            toast.success(
                variables.isActive ? "Kupon diaktifkan" : "Kupon dinonaktifkan",
            );
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}

export function useDeleteCoupon() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCoupon,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
            toast.success("Kupon berhasil dihapus");
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
