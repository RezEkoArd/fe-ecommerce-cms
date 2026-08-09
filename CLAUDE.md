# FE CMS Ecommerce — Next.js Frontend

Frontend untuk CMS Ecommerce: panel admin (kelola produk, kategori, order, kupon) dan storefront publik, mengonsumsi REST API Go di `be-cms-ecommerce`.

## Stack
- **Framework:** Next.js 16 App Router (`next`)
- **UI:** React 19 + TypeScript 5
- **Package Manager:** pnpm (wajib — jangan pakai npm/yarn)
- **Styling:** Tailwind CSS v4 via `@tailwindcss/postcss` (config lewat CSS, **bukan** `tailwind.config.js`)
- **Komponen:** shadcn/ui + Radix UI primitives + `@base-ui/react`
- **Data Fetching:** TanStack Query v5 (`@tanstack/react-query`)
- **Client State:** Zustand v5 (`src/store/`)
- **HTTP:** Axios (`src/lib/api-client.ts`)
- **Form & Validasi:** React Hook Form + Zod v4 + `@hookform/resolvers`
- **Auth:** JWT via `cookies-next` + `jwt-decode`
- **Editor:** Tiptap v3
- **Animasi:** `motion` (public), `lenis` (smooth scroll public), `@formkit/auto-animate` (admin)
- **Linter:** ESLint 9 flat config + `eslint-config-next`

## Build & Test Commands
- **Run dev:** `pnpm dev`
- **Build:** `pnpm build`
- **Start production:** `pnpm start`
- **Lint:** `pnpm lint`
- **Type check:** `pnpm typecheck` (`tsc --noEmit`)
- **Tambah komponen shadcn:** `pnpm dlx shadcn@latest add <nama>`

## Project Structure
```
src/
├── app/
│   ├── (public)/          → Storefront publik (lenis + motion)
│   ├── (admin)/           → Panel CMS (auto-animate)
│   ├── (auth)/            → Login/register
│   └── layout.tsx         → Root layout + Providers
├── components/ui/         → Komponen shadcn (JANGAN diedit manual kecuali perlu)
├── components/shared/     → Komponen reusable lintas fitur
├── features/<domain>/     → Modul per domain bisnis
│   ├── api/               → Fungsi request ke backend
│   ├── hooks/             → useQuery / useMutation
│   ├── schema/            → Skema Zod + tipe hasil infer
│   └── components/        → Komponen khusus domain
├── lib/                   → api-client, query-client, auth, utils
├── store/                 → Zustand store
├── providers/             → Provider React (query, theme)
├── types/                 → Tipe API bersama
└── middleware.ts          → Proteksi route berbasis role
```

## Architecture Rules
- **Server Component adalah default.** Tambahkan `"use client"` hanya kalau butuh hook, event handler, atau browser API
- **Arah dependency:** `app/` → `features/` → `lib/`. Satu arah, tidak bolak-balik
- `features/` **tidak boleh** saling import antar domain — kalau ada yang dipakai bersama, angkat ke `components/shared/` atau `lib/`
- Semua request HTTP lewat `src/lib/api-client.ts` — jangan pernah `fetch()` atau `axios` langsung di komponen
- Komponen **tidak boleh** memanggil fungsi `api/` langsung — selalu lewat hook di `features/<domain>/hooks/`

## Coding Conventions

### Server vs Client Component
```tsx
// ✅ Default: Server Component, tanpa directive
export default async function ProductPage() { ... }

// ✅ Client hanya saat perlu interaktivitas
"use client";
export function ProductForm() { const form = useForm(); ... }
```
Letakkan `"use client"` sedalam mungkin di pohon komponen — bukan di layout atau page kalau hanya satu tombol yang butuh interaktif.

### Data Fetching
- **Server Component** → fetch langsung di dalamnya untuk data awal
- **Client Component** → TanStack Query lewat hook custom
- Query key selalu array terstruktur: `["products", { page, search }]`
- Setelah mutation berhasil, `invalidateQueries` — jangan mutasi cache manual kecuali untuk optimistic update

### Response Envelope Backend
Backend selalu membungkus response dalam `{ code, message, data }`. Interceptor axios sudah meng-unwrap `data`, jadi fungsi API **mengembalikan isi `data` langsung**.

```ts
// ✅ Tipe yang ditulis adalah bentuk data, bukan envelope
export async function getProducts(params: ProductParams): Promise<Product[]> {
  return apiClient.get("/products", { params });
}
```

### Form & Validasi
- Semua form pakai React Hook Form + `zodResolver`
- Skema Zod di `features/<domain>/schema/`, tipe di-infer dari skema — **jangan tulis interface terpisah**
- Aturan validasi harus cocok dengan constraint backend (contoh: password `min(8).max(72)`)

```ts
export const loginSchema = z.object({
  email: z.email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter").max(72),
});
export type LoginInput = z.infer<typeof loginSchema>;
```

### Styling
- Tailwind v4: semua token tema di `globals.css` lewat `@theme` — **tidak ada `tailwind.config.js`**
- Gabungkan class dengan `cn()` dari `src/lib/utils.ts`, jangan template string manual
- Varian komponen pakai `class-variance-authority`, bukan percabangan if/else di JSX
- Pakai token semantik (`bg-background`, `text-muted-foreground`), bukan warna mentah (`bg-white`) agar dark mode ikut jalan

### State Management
| Jenis state | Pakai apa |
|---|---|
| Data dari server | TanStack Query |
| State UI global (sidebar, modal) | Zustand |
| State satu komponen | `useState` |
| State form | React Hook Form |

Jangan simpan data server ke Zustand — itu tugas TanStack Query.

### Auth
- Access token di cookie via `cookies-next`, decode klaim pakai `jwt-decode`
- Refresh token adalah cookie HttpOnly milik backend — **jangan pernah diakses dari JS**
- Auto-refresh saat 401 ditangani di interceptor axios, bukan di komponen
- Proteksi route admin lewat `src/middleware.ts` berbasis klaim `role`

### Penamaan
- File komponen: `kebab-case.tsx` (`product-form.tsx`)
- Komponen React: `PascalCase`
- Hook: `camelCase` diawali `use` (`useProducts`)
- Tipe/interface: `PascalCase`, tanpa prefix `I`

## Rules Maintenance
- Detail rules per-area ada di `.claude/rules/` (dimuat otomatis sesuai path file yang dikerjakan)
- `/check-convention` — jalankan sebelum mulai coding untuk checklist konvensi yang relevan
- `/add-rule` — tambah rule/contoh baru saat agent menulis kode yang tidak sesuai pattern
- `/audit-rules` — audit berkala agar rules tetap lean (setiap selesai feature besar / 2 minggu)

## Git Conventions
- Branch: `feature/nama-fitur`, `fix/nama-bug`, `refactor/nama-area`
- Commit: `feat: tambah halaman list produk`, `fix: perbaiki refresh token loop`
- Jangan commit: `.env*.local`, `node_modules/`, `.next/`

## Security Rules
- Variabel dengan prefix `NEXT_PUBLIC_` **terekspos ke browser** — jangan taruh secret di situ
- Jangan simpan token di `localStorage` — gunakan cookie
- Jangan render HTML mentah dari user tanpa sanitasi (termasuk output Tiptap)
- Jangan tampilkan pesan error internal backend ke user — pakai pesan yang ramah

## Hal yang JANGAN Dilakukan
- Jangan buat `tailwind.config.js` — proyek ini Tailwind v4, config lewat CSS
- Jangan pakai `npm install` / `yarn` — hanya `pnpm`
- Jangan pakai `fetch()` atau `axios` langsung di komponen — lewat `api-client`
- Jangan taruh `"use client"` di root layout atau page kalau tidak perlu
- Jangan pakai tipe `any` — pakai `unknown` lalu persempit kalau memang belum diketahui
- Jangan import antar folder `features/`
- Jangan edit file di `components/ui/` hasil generate shadcn kecuali memang perlu kustomisasi
- Jangan pakai `<img>` — pakai `next/image`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
