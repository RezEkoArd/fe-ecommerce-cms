import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/providers";
import { Zen_Kaku_Gothic_New } from "next/font/google";

const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-zen",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ichiba 市場 — Admin CMS",
  description: "Panel pengelolaan toko ichiba.",
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", zenKaku.variable)}
    >
      <body className="min-h-full flex flex-col">
          <Providers>{children}</Providers>
      </body>
    </html>
  );
}
