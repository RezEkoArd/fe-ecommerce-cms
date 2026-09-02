"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getProfile } from "../utils/api/get-profile";
import { updateProfile } from "../utils/api/update-profile";
import { changePassword } from "../utils/api/change-password";
import { getErrorMessage } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";

export const profileKeys = {
    all: ["profile"] as const,
};

export function useProfile() {
    const user = useAuthStore((s) => s.user);

    return useQuery({
        queryKey: profileKeys.all,
        queryFn: getProfile,
        enabled: !!user,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: profileKeys.all });
            toast.success("Profil berhasil diperbarui");
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: changePassword,
        onSuccess: () => {
            // Token lama tetap berlaku sampai kedaluwarsa — backend tidak
            // mencabut sesi, jadi user tidak perlu login ulang.
            toast.success("Password berhasil diubah");
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
