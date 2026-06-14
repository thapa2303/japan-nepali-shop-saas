import { ConsoleSidebar } from "./console-sidebar";

export function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] bg-background">
      <ConsoleSidebar />
      <main className="flex-1 flex flex-col max-w-full overflow-hidden bg-muted/20">
        {children}
      </main>
    </div>
  );
}
