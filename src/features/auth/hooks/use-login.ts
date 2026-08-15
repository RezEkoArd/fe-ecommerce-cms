"use client"

import { useAuthStore } from '@/store/auth-store';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { getErrorMessage } from '@/lib/api-client';
import { login } from '../api/login';

export default function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((s) => s.login);
  
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
        setSession(data.access_token);
        toast.success("Berhasil masuk")

        // replace() sudah memicu request ke server, dan middleware membaca
        // cookie pada request itu — refresh() tambahan hanya menambah round-trip.
        const redirect = searchParams.get("redirect");
        router.replace(redirect ?? "/dashboard");
    },
    onError: (error) => {
        toast.error(getErrorMessage(error));
    }
  })
}
