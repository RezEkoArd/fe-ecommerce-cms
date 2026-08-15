import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-10">
      <div className="w-full max-w-100">
        <div className="mb-9 text-center">
          <div className="mb-2.5 inline-flex items-baseline gap-2.5">
            <span className="text-2xl font-bold tracking-[0.06em]">ichiba</span>
            <span className="text-xl text-primary">市場</span>
          </div>
          <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Admin CMS
          </div>
        </div>

        <div className="rounded-2xl border bg-card px-8 py-9">
          <h1 className="mb-1.5 text-center text-xl font-bold">
            Masuk ke dashboard
          </h1>
          <p className="mb-7 text-center text-[13px] text-muted-foreground">
            Khusus pengelola toko ichiba.
          </p>

          {/* LoginForm memakai useSearchParams() untuk membaca ?redirect=,
              jadi wajib dibungkus Suspense agar halaman bisa di-prerender. */}
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Dilindungi · Akses hanya untuk staf
        </p>
      </div>
    </div>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="grid gap-4.5">
      <div className="grid gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="grid gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-full" />
      </div>
      <Skeleton className="mt-1 h-12 w-full" />
    </div>
  );
}
