"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddresses } from "@/features/address/hooks/use-addresses";
import { cn } from "@/lib/utils";

type CheckoutAddressProps = {
  selectedId: string;
  onSelect: (id: string) => void;
};

export function CheckoutAddress({
  selectedId,
  onSelect,
}: CheckoutAddressProps) {
  const { data, isLoading } = useAddresses();

  // Pilih alamat utama secara otomatis supaya user tidak perlu
  // memilih ulang tiap kali membuka checkout.
  useEffect(() => {
    if (!selectedId && data?.length) {
      const primary = data.find((a) => a.IsPrimary) ?? data[0];
      onSelect(primary.ID);
    }
  }, [data, selectedId, onSelect]);

  if (isLoading) {
    return (
      <div className="grid gap-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="mb-4 text-sm text-muted-foreground">
          Belum ada alamat pengiriman.
        </p>
        <Button
          render={<Link href="/akun" />}
          nativeButton={false}
          variant="outline"
        >
          Tambah alamat di Akun Saya
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {data.map((address) => {
        const isSelected = address.ID === selectedId;

        return (
          <button
            key={address.ID}
            type="button"
            onClick={() => onSelect(address.ID)}
            className={cn(
              "rounded-lg border p-5 text-left transition-colors",
              isSelected
                ? "border-2 border-primary"
                : "hover:border-ring",
            )}
          >
            <div className="mb-2 flex items-center gap-2.5">
              <span className="font-medium">{address.Label}</span>
              {address.IsPrimary && (
                <Badge className="bg-secondary text-muted-foreground">
                  Utama
                </Badge>
              )}
              {isSelected && (
                <Check className="ml-auto size-4 shrink-0 text-primary" />
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              <div>
                {address.Recipient} · {address.Phone}
              </div>
              <div>
                {address.Street}, {address.City} {address.PostalCode}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
