import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { LoginForm } from "@/features/auth/components/login-form";
import Link from "next/link";

export default function MasukPage() {
  return (
    <div className="mx-auto max-w-110 px-10 py-20">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-[26px] font-bold">Masuk ke akun Anda</h1>
        <p className="text-sm text-muted-foreground">
          Lanjutkan belanja koleksi ichiba.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-64" />}>
        <LoginForm />
      </Suspense>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-medium text-primary hover:underline">
          Daftar
        </Link>
      </p>
    </div>
  );
}
