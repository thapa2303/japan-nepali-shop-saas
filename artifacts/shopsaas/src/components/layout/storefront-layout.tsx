import { StorefrontNavbar } from "./storefront-navbar";

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <StorefrontNavbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ShopSaaS. Bringing Nepali shops in Japan closer to you.</p>
        </div>
      </footer>
    </div>
  );
}
