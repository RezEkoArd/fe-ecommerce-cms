"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { register } from "../api/register";
import { getErrorMessage } from "@/lib/api-client";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      // Backend tidak mengembalikan token — user harus login setelah daftar.
      toast.success("Akun berhasil dibuat. Silakan masuk.");
      router.replace("/masuk");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
