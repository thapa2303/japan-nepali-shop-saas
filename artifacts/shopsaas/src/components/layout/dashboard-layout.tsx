import { DashboardSidebar } from "./dashboard-sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] bg-background">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col max-w-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}
