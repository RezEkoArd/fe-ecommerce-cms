"use client";

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
import { useChangePassword } from "../hooks/use-profile";
import { passwordSchema, type PasswordInput } from "../schema/profile-schema";

export function PasswordForm() {
  const { mutate, isPending } = useChangePassword();

  const form = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  function handleSubmit(values: PasswordInput) {
    mutate(values, {
      // Kosongkan field setelah berhasil — password tidak perlu tetap terisi.
      onSuccess: () => form.reset(),
    });
  }

  return (
    <Card className="gap-0 p-7">
      <h2 className="mb-1.5 text-[17px] font-bold">Ubah Password</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Masukkan password saat ini untuk mengonfirmasi perubahan.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password saat ini</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password baru</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Konfirmasi password baru</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan…" : "Ubah Password"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
