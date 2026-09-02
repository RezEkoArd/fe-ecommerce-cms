"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useProfile } from "../hooks/use-profile";
import { cn } from "@/lib/utils";

export type AccountTab = "profil" | "alamat";

type AccountSidebarProps = {
  active: AccountTab;
  onChange: (tab: AccountTab) => void;
};

const TABS: { id: AccountTab; label: string }[] = [
  { id: "profil", label: "Profil & Keamanan" },
  { id: "alamat", label: "Alamat" },
];

export function AccountSidebar({ active, onChange }: AccountSidebarProps) {
  const { data: profile, isLoading } = useProfile();
  const { mutate: logout, isPending } = useLogout();

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="mb-6 flex items-center gap-3.5">
        {isLoading ? (
          <>
            <Skeleton className="size-12 rounded-full" />
            <div className="grid gap-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </>
        ) : (
          <>
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {initials(profile?.name)}
            </div>
            <div className="min-w-0">
              <div className="truncate font-medium">{profile?.name}</div>
              <div className="truncate text-[13px] text-muted-foreground">
                {profile?.email}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Preferensi menyusul saat endpoint-nya tersedia. */}
      <nav className="grid gap-0.5 border-t pt-5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "rounded-md px-3.5 py-2.5 text-left text-sm transition-colors",
              active === tab.id
                ? "bg-secondary font-medium"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="mt-5 border-t pt-5">
        <button
          type="button"
          onClick={() => logout()}
          disabled={isPending}
          className="px-3.5 text-sm text-destructive transition-opacity hover:underline disabled:opacity-50"
        >
          {isPending ? "Keluar…" : "Keluar dari akun"}
        </button>
      </div>
    </aside>
  );
}

function initials(name: string | undefined) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
