"use client";

import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { AddressFormDialog } from "./address-form-dialog";
import {
  useAddresses,
  useDeleteAddress,
  useSetPrimaryAddress,
} from "../hooks/use-addresses";
import type { Address } from "../types/api";
import { useConfirm } from "@/lib/use-confirm";
import { cn } from "@/lib/utils";

export function AddressList() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Address | undefined>();
  const [listRef] = useAutoAnimate<HTMLDivElement>();

  const { data, isLoading, isError } = useAddresses();
  const remove = useDeleteAddress();
  const setPrimary = useSetPrimaryAddress();
  const confirmDelete = useConfirm<Address>();

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(address: Address) {
    setEditing(address);
    setFormOpen(true);
  }

  return (
    <>
      <Card className="gap-0 p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="mb-1.5 text-[17px] font-bold">Alamat Tersimpan</h2>
            <p className="text-sm text-muted-foreground">
              Dipakai otomatis saat checkout.
            </p>
          </div>
          <Button variant="outline" onClick={openCreate}>
            <Plus className="size-4" />
            Tambah Alamat
          </Button>
        </div>

        <div ref={listRef} className="grid gap-4">
          {isLoading ? (
            [0, 1].map((i) => <Skeleton key={i} className="h-28" />)
          ) : isError ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Gagal memuat alamat. Coba muat ulang halaman.
            </p>
          ) : !data?.length ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Belum ada alamat tersimpan.
            </p>
          ) : (
            data.map((address) => (
              <div
                key={address.ID}
                className={cn(
                  "rounded-lg border p-5",
                  // Alamat utama diberi border lebih tegas.
                  address.IsPrimary && "border-2 border-primary",
                )}
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="font-medium">{address.Label}</span>
                    {address.IsPrimary && (
                      <Badge className="bg-secondary text-muted-foreground">
                        Utama
                      </Badge>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-3.5 text-sm">
                    {!address.IsPrimary && (
                      <button
                        type="button"
                        onClick={() => setPrimary.mutate(address.ID)}
                        disabled={setPrimary.isPending}
                        className="text-primary hover:underline disabled:opacity-50"
                      >
                        Jadikan utama
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openEdit(address)}
                      className="text-muted-foreground hover:text-foreground hover:underline"
                    >
                      Ubah
                    </button>
                    {/* Alamat utama tidak bisa dihapus selama ada alamat lain —
                        backend menolaknya, jadi tombolnya disembunyikan. */}
                    {!address.IsPrimary && (
                      <button
                        type="button"
                        onClick={() => confirmDelete.ask(address)}
                        className="text-destructive hover:underline"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <div>
                    {address.Recipient} · {address.Phone}
                  </div>
                  <div>
                    {address.Street}, {address.City} {address.PostalCode}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* key memaksa form dibuat ulang saat alamat berganti,
          supaya defaultValues ikut tersegarkan. */}
      <AddressFormDialog
        key={editing?.ID ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        address={editing}
      />

      <ConfirmDialog
        open={confirmDelete.isOpen}
        onOpenChange={confirmDelete.setOpen}
        title="Hapus alamat?"
        description={
          <>
            Alamat <strong>{confirmDelete.target?.Label}</strong> akan dihapus
            permanen. Tindakan ini tidak bisa dibatalkan.
          </>
        }
        confirmLabel="Hapus"
        variant="destructive"
        isPending={remove.isPending}
        onConfirm={() => {
          if (!confirmDelete.target) return;
          remove.mutate(confirmDelete.target.ID, {
            onSuccess: () => confirmDelete.close(),
          });
        }}
      />
    </>
  );
}
