import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useListDashboardCouponRedemptions } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, History, Tag, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";

function exportRedemptionsCSV(
  redemptions: { orderNumber: string; customerName: string; orderDate: string; discountAmount: number; couponCode?: string }[],
  filename: string
) {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const header = ["Order #", "Customer Name", "Date", "Discount Applied (¥)"].map(escape).join(",");
  const rows = redemptions.map((r) =>
    [
      escape(r.orderNumber),
      escape(r.customerName),
      escape(new Date(r.orderDate).toLocaleDateString("en-JP", { year: "numeric", month: "short", day: "numeric" })),
      escape(String(r.discountAmount)),
    ].join(",")
  );
  const csv = [header, ...rows].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DashboardCouponRedemptionsPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const initialCode = searchParams.get("code") ?? "";

  const [codeFilter, setCodeFilter] = useState(initialCode);
  const [appliedCode, setAppliedCode] = useState(initialCode);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code") ?? "";
    setCodeFilter(code);
    setAppliedCode(code);
  }, [location]);

  const { data, isLoading, isError } = useListDashboardCouponRedemptions(
    appliedCode ? { code: appliedCode } : undefined
  );

  const redemptions = data?.redemptions ?? [];

  const handleFilter = () => {
    setAppliedCode(codeFilter.trim().toUpperCase());
  };

  const handleClear = () => {
    setCodeFilter("");
    setAppliedCode("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleFilter();
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6 max-w-5xl">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/coupons">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold">Redemption History</h1>
            <p className="text-muted-foreground">All coupon redemptions for your shop</p>
          </div>
        </div>

        <div className="flex items-center gap-2 max-w-sm">
          <div className="relative flex-1">
            <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Filter by coupon code…"
              value={codeFilter}
              onChange={(e) => setCodeFilter(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              className="pl-8 uppercase text-sm"
            />
          </div>
          <Button variant="secondary" size="sm" onClick={handleFilter}>
            Filter
          </Button>
          {(appliedCode || codeFilter) && (
            <Button variant="ghost" size="icon" onClick={handleClear} title="Clear filter">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {appliedCode && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtered by:</span>
            <Badge variant="secondary" className="font-mono">
              {appliedCode}
            </Badge>
            <button
              className="text-xs text-muted-foreground hover:text-foreground underline"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  {appliedCode ? `Redemptions for ${appliedCode}` : "All Redemptions"}
                </CardTitle>
                {!isLoading && !isError && (
                  <CardDescription className="mt-1">
                    {redemptions.length === 0
                      ? "No redemptions found"
                      : `${redemptions.length} redemption${redemptions.length !== 1 ? "s" : ""}`}
                  </CardDescription>
                )}
              </div>
              {!isLoading && !isError && redemptions.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 gap-1.5"
                  onClick={() =>
                    exportRedemptionsCSV(
                      redemptions,
                      appliedCode ? `${appliedCode}-redemptions.csv` : "redemptions.csv"
                    )
                  }
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Coupon Code</TableHead>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right pr-6">Discount Applied</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Loading redemptions…
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-destructive">
                      Failed to load redemptions. Please try again.
                    </TableCell>
                  </TableRow>
                ) : redemptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <History className="h-8 w-8 opacity-40" />
                        <p>
                          {appliedCode
                            ? `No redemptions found for coupon code "${appliedCode}"`
                            : "No coupon redemptions yet. Share your codes with customers to get started."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  redemptions.map((r) => (
                    <TableRow key={r.orderId}>
                      <TableCell className="pl-6 py-3">
                        <span className="font-mono font-semibold tracking-wider text-sm">
                          {r.couponCode}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="font-mono text-xs font-medium">{r.orderNumber}</span>
                      </TableCell>
                      <TableCell className="py-3 text-sm">{r.customerName}</TableCell>
                      <TableCell className="py-3 text-sm text-muted-foreground">
                        {new Date(r.orderDate).toLocaleDateString("en-JP", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="py-3 text-right pr-6 text-sm font-medium text-green-700">
                        −¥{r.discountAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
