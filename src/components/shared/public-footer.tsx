import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t bg-secondary">
      <div className="mx-auto max-w-300 px-10 pb-10 pt-14">
        <div className="mb-11 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-[0.06em]">ichiba</span>
              <span className="text-[17px] text-primary">市場</span>
            </div>
            <p className="max-w-65 text-[13px] leading-relaxed text-muted-foreground">
              Busana butik Jepang. Dibuat dengan bahan alami dan ruang untuk
              bernapas.
            </p>
          </div>

          <FooterColumn title="Belanja">
            <Link href="/produk" className="hover:text-primary">
              Katalog
            </Link>
          </FooterColumn>

          <FooterColumn title="Bantuan">
            <span>Pengiriman</span>
            <span>Pengembalian</span>
            <span>Panduan Ukuran</span>
          </FooterColumn>

          <FooterColumn title="Pengelola">
            <Link href="/login" className="text-primary hover:underline">
              Masuk Admin CMS →
            </Link>
          </FooterColumn>
        </div>

        <div className="flex items-center justify-between border-t pt-6 text-xs text-muted-foreground">
          <span>© 2026 ichiba 市場</span>
          <span>Dibuat dengan filosofi 間 — ma</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-3.5 text-xs uppercase tracking-[0.08em] text-muted-foreground">
        {title}
      </h4>
      <div className="flex flex-col gap-2.5 text-sm">{children}</div>
    </div>
  );
}
