import Link from "next/link";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { RegistrationForm } from "@/features/auth/components/registration-form";

export default function DaftarPage() {
  return (
    <div className="mx-auto max-w-110 px-10 py-20">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-[26px] font-bold">Buat akun baru</h1>
        <p className="text-sm text-muted-foreground">
          Bergabung dengan pasar ichiba.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-80" />}>
        <RegistrationForm />
      </Suspense>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="font-medium text-primary hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}
