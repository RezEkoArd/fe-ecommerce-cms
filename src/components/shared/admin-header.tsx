export function AdminHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-17 items-center justify-between border-b bg-background/90 px-9 backdrop-blur">
      <h1 className="text-[19px] font-bold">{title}</h1>
      {action}
    </header>
  );
}
