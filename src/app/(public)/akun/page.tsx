import { ProfilePageContent } from "@/features/profile/components/profile-page-content";

export const metadata = { title: "Akun Saya — ichiba 市場" };

export default function AkunPage() {
  return (
    <div className="mx-auto max-w-300 px-10 pb-30 pt-12">
      <div className="mb-10">
        <div className="mb-2 text-xs uppercase tracking-[0.06em] text-muted-foreground">
          Akun
        </div>
        <h1 className="text-[34px] font-bold">Akun Saya</h1>
      </div>

      <ProfilePageContent />
    </div>
  );
}
