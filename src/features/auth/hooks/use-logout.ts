"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearSession = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: () => apiClient.post("/auth/logout"),
    // onSettled, bukan onSuccess: sesi lokal tetap dibersihkan
    // walaupun panggilan ke backend gagal.
    onSettled: () => {
      clearSession();
      queryClient.clear();
      router.replace("/login");
      router.refresh();
    },
  });
}
