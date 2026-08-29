"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV = [
  { href: "/produk", label: "Katalog" },
  { href: "/pesanan", label: "Pesanan" },
  { href: "/keranjang", label: "Keranjang" },
];

export function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-300 items-center justify-between px-10">
        <Link href="/" className="flex items-baseline gap-2.5">
          <span className="text-[22px] font-bold tracking-[0.06em]">ichiba</span>
          <span className="text-[19px] font-medium text-primary">市場</span>
        </Link>

        <nav className="flex items-center gap-1.5">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-4 py-2.5 text-sm transition-colors hover:text-primary",
                pathname.startsWith(href) && "text-primary",
              )}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/masuk"
            className="ml-1.5 rounded-md bg-primary px-5.5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Masuk
          </Link>
        </nav>
      </div>
    </header>
  );
}
