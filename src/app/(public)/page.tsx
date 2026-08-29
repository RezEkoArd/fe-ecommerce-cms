import { CategoryGrid } from "@/features/category/components/category-grid";
import { FeaturedProducts } from "@/features/product/components/featured-products";
import Link from "next/link";


export default function HomePage() {
  return (
    <>
      {/* Hero A — teks di tengah dengan 市場 raksasa sebagai latar */}
      <section className="relative mx-auto max-w-300 px-10 pb-32 pt-30 text-center">
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-13 -translate-x-1/2 text-[220px] font-black leading-none tracking-[0.1em] opacity-[0.035]"
        >
          市場
        </span>

        <p className="relative mb-7 text-[13px] uppercase tracking-[0.28em] text-accent">
          Busana Butik Jepang
        </p>
        <h1 className="relative mx-auto mb-8 max-w-195 text-5xl font-bold leading-[1.16] tracking-tight text-balance sm:text-6xl">
          Pakaian yang tenang, dibuat untuk bertahan.
        </h1>
        <p className="relative mx-auto mb-11 max-w-122 text-lg leading-relaxed text-muted-foreground">
          Kemeja linen, jaket sashiko, dan gaun indigo yang dicelup perlahan.
          Sedikit pilihan, dipikirkan matang.
        </p>
        <Link
          href="/produk"
          className="relative inline-block rounded-md bg-primary px-10 py-4 text-[15px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Jelajahi Katalog
        </Link>
      </section>

      <CategoryGrid />
      <FeaturedProducts />
    </>
  );
}
