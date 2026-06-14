import { AdminSidebar } from "./admin-sidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] bg-background">
      <AdminSidebar />
      <main className="flex-1 flex flex-col max-w-full overflow-hidden bg-muted/10">
        {children}
      </main>
    </div>
  );
}
