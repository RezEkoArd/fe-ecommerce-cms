# Panduan Setup Frontend — fe-cms-ecommerce

Panduan langkah demi langkah dari folder kosong sampai semua stack terpasang dan dev server jalan.

**Prasyarat:** Node.js ≥ 20 (terpasang: v22.14.0), pnpm ≥ 10 (terpasang: 10.23.0)

Semua perintah dijalankan dari:
```bash
cd "/Users/rezekoard/development/Project-ecommerce-cms/fe-cms-ecommerce"
```

---

## Langkah 0 — Amankan file konfigurasi AI

Folder ini sudah berisi `CLAUDE.md`, `.claude/`, dan `SETUP.md`. Scaffold Next.js menolak menulis ke folder yang tidak kosong, jadi pindahkan dulu ke tempat aman:

```bash
mkdir -p /tmp/fe-cms-backup
mv CLAUDE.md SETUP.md README.md .claude /tmp/fe-cms-backup/
ls -la    # pastikan folder sudah kosong
```

---

## Langkah 1 — Scaffold Next.js 16

```bash
pnpm create next-app@16.3.0 . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-pnpm \
  --no-turbopack \
  --skip-install
```

**Penjelasan flag:**
- `--src-dir` → kode di `src/`, sesuai struktur di CLAUDE.md
- `--import-alias "@/*"` → import jadi `@/components/...`
- `--skip-install` → tunda install, kita pin versi dulu di Langkah 3
- `--no-turbopack` → webpack lebih stabil untuk build produksi; hapus flag ini kalau mau coba Turbopack

Kalau CLI menanyakan pertanyaan tambahan (mis. React Compiler), jawab **No** dulu — bisa diaktifkan belakangan.

### Kembalikan file konfigurasi AI

```bash
cp -r /tmp/fe-cms-backup/. .
```

Kalau ada konflik `README.md`, punyamu yang dipakai — timpa saja.

---

## Langkah 2 — Siapkan pnpm workspace

Buat `pnpm-workspace.yaml`:

```yaml
packages:
  - .
```

> Kalau nanti dipecah jadi `apps/cms` + `apps/web`, tinggal ubah jadi `- "apps/*"` dan `- "packages/*"`.

---

## Langkah 3 — Pin versi core di `package.json`

Buka `package.json`, samakan bagian `dependencies` dan `devDependencies` menjadi versi berikut. Versi ini sudah diverifikasi dari registry npm:

```jsonc
{
  "dependencies": {
    "next": "16.3.0",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "typescript": "^5.9.3",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9.39.0",
    "eslint-config-next": "16.3.0",
    "@eslint/eslintrc": "^3",
    "tailwindcss": "4.3.3",
    "@tailwindcss/postcss": "4.3.3"
  }
}
```

> **Catatan versi:** kamu menyebut Next 16.2.9 dan React 19.2.4 — rilis terbaru saat ini adalah 16.3.0 dan 19.2.8, jadi itu yang dipakai. TypeScript ditahan di `^5` (bukan 7) dan ESLint di `^9` (bukan 10) sesuai keputusanmu, karena `eslint-config-next` 16 menargetkan ESLint 9.

Lalu install:

```bash
pnpm install
```

---

## Langkah 4 — Install dependency stack

Dipecah per kelompok supaya kalau ada yang gagal, mudah dilacak.

### 4a. UI & Styling
```bash
pnpm add \
  @radix-ui/react-dialog@1.1.23 \
  @radix-ui/react-dropdown-menu@2.1.24 \
  @radix-ui/react-select@2.3.7 \
  @radix-ui/react-popover@1.1.23 \
  @radix-ui/react-checkbox@1.3.11 \
  @radix-ui/react-label@2.1.15 \
  @radix-ui/react-switch@1.3.7 \
  @radix-ui/react-slot@1.3.3 \
  @base-ui/react@1.7.0 \
  class-variance-authority@0.7.1 \
  clsx@2.1.1 \
  tailwind-merge@3.6.0 \
  lucide-react@1.28.0 \
  next-themes@0.4.6 \
  sonner@2.0.7

pnpm add -D tw-animate-css@1.4.0
```

### 4b. Data & State
```bash
pnpm add \
  @tanstack/react-query@5.101.4 \
  zustand@5.0.14 \
  axios@1.19.0

pnpm add -D @tanstack/react-query-devtools@5.101.4
```

### 4c. Form & Validasi
```bash
pnpm add \
  react-hook-form@7.84.0 \
  zod@4.4.3 \
  @hookform/resolvers@5.7.1
```

### 4d. Auth
```bash
pnpm add cookies-next@6.1.1 jwt-decode@4.0.0
```

### 4e. Editor Tiptap v3
```bash
pnpm add \
  @tiptap/react@3.29.2 \
  @tiptap/pm@3.29.2 \
  @tiptap/starter-kit@3.29.2 \
  @tiptap/extension-image@3.29.2 \
  @tiptap/extension-link@3.29.2 \
  @tiptap/extension-placeholder@3.29.2 \
  @tiptap/extension-table@3.29.2 \
  @tiptap/html@3.29.2
```

> **Dua catatan penting:**
> - `@tiptap/pm` wajib — peer dependency ProseMirror yang tidak ikut otomatis.
> - Di Tiptap v3, `extension-table` **sudah memuat** `TableCell`, `TableHeader`, dan `TableRow`. Tidak perlu install tiga paket terpisah seperti di v2.

### 4f. Animasi
```bash
pnpm add motion@13.0.0 lenis@1.3.26 @formkit/auto-animate@0.10.0
```

> `motion` v13 adalah penerus Framer Motion. Import tetap dari `motion/react`. Kamu menyebut `^12`; v13 dipakai karena kamu minta versi terbaru — API untuk penggunaan umum tidak berubah.

---

## Langkah 5 — Konfigurasi Tailwind v4

### `postcss.config.mjs`
```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### Hapus `tailwind.config.ts` / `tailwind.config.js` kalau ada
```bash
rm -f tailwind.config.ts tailwind.config.js
```
Tailwind v4 tidak membacanya — tema dikonfigurasi lewat CSS.

### `src/app/globals.css`
```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

## Langkah 6 — Inisialisasi shadcn/ui

```bash
pnpm dlx shadcn@4.16.1 init
```

Jawaban yang disarankan:
| Pertanyaan | Jawaban |
|---|---|
| Style | **New York** |
| Base color | **Neutral** |
| CSS variables | **Yes** |

Lalu generate komponen dasar:

```bash
pnpm dlx shadcn@4.16.1 add \
  button input textarea label form \
  dialog dropdown-menu select popover checkbox switch \
  table card badge skeleton separator avatar sonner
```

Verifikasi `components.json` terbentuk dan `src/components/ui/` terisi.

---

## Langkah 7 — Environment variable

### `.env.example` (di-commit)
```bash
NEXT_PUBLIC_API_URL=/api
BACKEND_URL=http://localhost:8080
```

### `.env.local` (JANGAN di-commit)
```bash
NEXT_PUBLIC_API_URL=/api
BACKEND_URL=http://localhost:8080
```

Pastikan `.gitignore` memuat:
```
.env*.local
```

> Jangan pernah menaruh secret di variabel berprefix `NEXT_PUBLIC_` — nilainya ikut terkirim ke browser.

Nilai di atas untuk **Mode A (proxy same-origin)**, yang dipakai secara default. `NEXT_PUBLIC_API_URL=/api` sengaja path relatif, bukan URL absolut — itulah yang membuat request jadi same-origin. Kalau nanti pindah ke Mode B, lihat Langkah 8.

---

## Langkah 8 — Konfigurasi Next.js (proxy ke backend)

### `next.config.ts`
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL ?? "http://localhost:8080"}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [{ protocol: "http", hostname: "localhost" }],
  },
};

export default nextConfig;
```

### Dua mode koneksi ke backend

Backend sudah punya CORS middleware di [`internal/middleware/cors.go`](../be-cms-ecommerce/internal/middleware/cors.go), jadi keduanya bisa dipakai.

**Mode A — Proxy same-origin (disarankan untuk dev).** Pakai `next.config.ts` di atas apa adanya.

Di `.env` backend:
```bash
CORS_ALLOWED_ORIGINS=          # kosong — CORS tidak diperlukan
COOKIE_SAMESITE=strict
```

Keunggulannya: request jadi same-origin sehingga CORS tidak berlaku sama sekali, cookie `refresh_token` terkirim otomatis, dan cookie tetap bisa memakai `SameSite=Strict` yang paling aman terhadap CSRF.

**Mode B — Cross-origin langsung.** Hapus blok `rewrites` dari `next.config.ts`, lalu set `NEXT_PUBLIC_API_URL=http://localhost:8080/api`.

Di `.env` backend:
```bash
CORS_ALLOWED_ORIGINS=http://localhost:3000
COOKIE_SAMESITE=lax
```

Kalau memakai mode ini, axios **wajib** menyertakan `withCredentials: true` agar cookie refresh ikut terkirim.

> ⚠️ **Jangan pakai `COOKIE_SAMESITE=strict` di mode B.** Cookie `Strict` tidak pernah dikirim browser pada request lintas origin, sehingga `/auth/refresh` akan selalu gagal.
>
> **Produksi beda domain:** `COOKIE_SAMESITE=none` **wajib** dibarengi `COOKIE_SECURE=true` — browser modern menolak `None` tanpa `Secure`.

---

## Langkah 9 — Script di `package.json`

```jsonc
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## Langkah 10 — Buat struktur folder

```bash
mkdir -p src/app/\(public\) \
         src/app/\(admin\) \
         src/app/\(auth\)/login \
         src/components/shared \
         src/features \
         src/lib \
         src/store \
         src/providers \
         src/types
```

Struktur akhir:
```
src/
├── app/
│   ├── (public)/          → storefront (lenis + motion)
│   ├── (admin)/           → CMS (auto-animate)
│   ├── (auth)/login/
│   ├── globals.css
│   └── layout.tsx
├── components/ui/         → hasil shadcn
├── components/shared/
├── features/              → auth, product, category, order, coupon, cart
│   └── <domain>/{api,hooks,schema,components}
├── lib/                   → api-client, query-client, auth, utils
├── store/
├── providers/
├── types/
└── middleware.ts
```

---

## Langkah 11 — Verifikasi

```bash
pnpm typecheck   # harus bersih
pnpm lint        # harus bersih
pnpm build       # harus sukses
pnpm dev         # buka http://localhost:3000
```

### Checklist
- [ ] `pnpm build` sukses tanpa error
- [ ] Halaman default tampil di `http://localhost:3000`
- [ ] Class Tailwind benar-benar diterapkan (bukan halaman tanpa gaya)
- [ ] `src/components/ui/button.tsx` ada
- [ ] Tidak ada `tailwind.config.js` / `tailwind.config.ts`
- [ ] Backend jalan: `curl http://localhost:8080/health`
- [ ] Proxy jalan: `curl http://localhost:3000/api/products` mengembalikan JSON dari backend

---

## Troubleshooting

| Gejala | Sebab & Solusi |
|---|---|
| Halaman tampil tanpa styling | `globals.css` belum di-import di `src/app/layout.tsx`, atau masih memakai sintaks v3 (`@tailwind base;`) |
| `Cannot find module '@/...'` | `paths` di `tsconfig.json` belum memuat `"@/*": ["./src/*"]` |
| `ERR_PNPM_PEER_DEP_ISSUES` | Buat `.npmrc` berisi `strict-peer-dependencies=false` |
| Tiptap error soal ProseMirror | `@tiptap/pm` belum terpasang (Langkah 4e) |
| Request `/api/*` kena 404 | `BACKEND_URL` salah, atau backend belum jalan. Restart dev server setelah mengubah `next.config.ts` |
| Kena CORS error | Berarti request tidak lewat proxy — pastikan `NEXT_PUBLIC_API_URL=/api` (path relatif), bukan URL absolut ke `:8080` |
| Login sukses tapi refresh selalu gagal | Cookie `refresh_token` tidak terkirim. Pastikan request lewat proxy same-origin dan axios memakai `withCredentials: true` |
| Dark mode tidak berubah | Class `.dark` belum dipasang di `<html>` — cek `ThemeProvider` dari `next-themes` dengan `attribute="class"` |

---

## Setelah Setup Selesai

Wiring fungsional (Fase 5 dari rencana) yang belum tercakup di panduan ini:

1. `src/lib/api-client.ts` — axios + interceptor (Bearer token, unwrap envelope, auto-refresh dengan antrean)
2. `src/lib/auth.ts` — kelola cookie token + decode JWT
3. `src/lib/query-client.ts` + `src/providers/` — QueryProvider, ThemeProvider, Toaster
4. `src/store/` — `auth-store`, `ui-store`
5. `src/middleware.ts` — proteksi route berbasis role
6. Alur login end-to-end ke `POST /api/auth/login`

Konvensi untuk semua itu sudah tertulis di [`CLAUDE.md`](CLAUDE.md) dan [`.claude/rules/`](.claude/rules/). Jalankan `/check-convention` sebelum mulai coding.

---

## Referensi Endpoint Backend

Base path `/api`, response selalu `{ code, message, data }`.

| Method | Endpoint | Akses |
|---|---|---|
| POST | `/auth/register` | publik |
| POST | `/auth/login` | publik |
| POST | `/auth/refresh` | cookie |
| POST | `/auth/logout` | cookie |
| GET | `/products` | publik |
| GET | `/products/{slug}` | publik |
| GET | `/categories` | publik |
| GET | `/me` | login |
| GET | `/cart` | login |
| POST | `/cart/items` | login |
| PUT/DELETE | `/cart/items/{productId}` | login |
| POST | `/orders` | login |
| GET | `/orders` · `/orders/{id}` | login |
| POST | `/products` · `/categories` | admin |
| PUT/DELETE | `/products/{id}` | admin |
| GET/POST | `/coupons` | admin |

Dokumentasi lengkap: `http://localhost:8080/swagger/index.html`

**Constraint validasi backend** (wajib dicerminkan di skema Zod):
- `password` — min 8, max 72 karakter
- `name` — min 2, max 100 karakter
- `email` — format email valid
