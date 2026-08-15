"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Ticket,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useLogout } from "@/features/auth/hooks/use-logout";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/products", label: "Produk", icon: Package },
  { href: "/orders", label: "Pesanan", icon: ShoppingCart },
  { href: "/categories", label: "Kategori", icon: Tags },
  { href: "/coupons", label: "Kupon", icon: Ticket },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { mutate: logout, isPending } = useLogout();

  return (
    <aside className="sticky top-0 flex h-screen w-62 flex-col bg-sidebar text-sidebar-foreground">
      <div className="border-b border-white/8 px-6 pt-6.5 pb-5.5">
        <div className="flex items-baseline gap-2.5">
          <span className="text-xl font-bold tracking-[0.06em] text-white">
            ichiba
          </span>
          <span className="text-[17px] text-sidebar-foreground">市場</span>
        </div>
        <div className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-sidebar-muted">
          Admin CMS
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-3.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-active font-medium text-white"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-active/60 hover:text-white",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/8 p-4">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-[13px] font-bold text-white">
            {initials(user?.userId)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium text-white">
              Administrator
            </div>
            <div className="text-[11px] text-sidebar-muted">
              {user?.role ?? "—"}
            </div>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            disabled={isPending}
            title="Keluar"
            aria-label="Keluar"
            className="rounded p-1.5 text-sidebar-muted transition-colors hover:text-white disabled:opacity-50"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

// Sementara pakai potongan user id — backend belum mengirim nama di klaim JWT.
function initials(userId: string | undefined) {
  return userId ? userId.slice(0, 2).toUpperCase() : "AD";
}
