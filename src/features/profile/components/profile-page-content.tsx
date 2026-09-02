"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AccountSidebar, type AccountTab } from "./account-sidebar";
import { PasswordForm } from "./password-form";
import { ProfileForm } from "./profile-form";
import { AddressList } from "@/features/address/components/address-list";
import { useAuthStore } from "@/store/auth-store";

export function ProfilePageContent() {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<AccountTab>("profil");

  if (!user) {
    return (
      <div className="py-20 text-center">
        <p className="mb-6 text-muted-foreground">
          Masuk untuk mengelola akunmu.
        </p>
        <Button
          render={<Link href="/masuk?redirect=/akun" />}
          nativeButton={false}
        >
          Masuk
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-14 lg:grid-cols-[260px_1fr]">
      <AccountSidebar active={tab} onChange={setTab} />

      {tab === "profil" ? (
        <div className="grid gap-6">
          <ProfileForm />
          <PasswordForm />
        </div>
      ) : (
        <AddressList />
      )}
    </div>
  );
}
