"use client"

import { useAuthStore } from '@/store/auth-store';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { getErrorMessage } from '@/lib/api-client';
import { login } from '../api/login';
import { getSession } from '@/lib/auth';

export default function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((s) => s.login);
  
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
        setSession(data.access_token);
        toast.success("Berhasil masuk");

        const redirect = searchParams.get("redirect");
        if (redirect) {
            router.replace(redirect);
            return;
        }

        const session = getSession();
        router.replace(session?.role === "admin" ? "/dashboard" : "/");
    },
    onError: (error) => {
        toast.error(getErrorMessage(error));
    }
  })
}
