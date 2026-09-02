"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile, useUpdateProfile } from "../hooks/use-profile";
import { profileSchema, type ProfileInput } from "../schema/profile-schema";

const EMPTY: ProfileInput = {
  name: "",
  email: "",
  phone: "",
  birth_date: "",
};

export function ProfileForm() {
  const { data: profile, isLoading } = useProfile();
  const { mutate, isPending } = useUpdateProfile();

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: EMPTY,
  });

  // Data profil datang setelah render pertama, jadi form perlu diisi ulang
  // saat query selesai. reset() dipakai agar dirty-state ikut bersih.
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        birth_date: profile.birth_date,
      });
    }
  }, [profile, form]);

  if (isLoading) {
    return (
      <Card className="gap-4 p-7">
        <Skeleton className="h-5 w-32" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="gap-0 p-7">
      <h2 className="mb-1.5 text-[17px] font-bold">Informasi Akun</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Nama dan email yang dipakai untuk pesanan.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => mutate(values))}
          className="grid gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama lengkap</FormLabel>
                  <FormControl>
                    <Input autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. telepon</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      autoComplete="tel"
                      placeholder="0812 3456 7890"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal lahir</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-2 flex justify-end gap-2 border-t pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                form.reset(
                  profile
                    ? {
                        name: profile.name,
                        email: profile.email,
                        phone: profile.phone,
                        birth_date: profile.birth_date,
                      }
                    : EMPTY,
                )
              }
              disabled={!form.formState.isDirty || isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending || !form.formState.isDirty}
            >
              {isPending ? "Menyimpan…" : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
