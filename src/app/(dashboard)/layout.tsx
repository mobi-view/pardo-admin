import type { ReactNode } from "react";
import "@/style/items.css";
import AuthGuard from "@/components/AuthGuard";
import AdminShell from "@/components/AdminShell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <AuthGuard>
            <AdminShell>{children}</AdminShell>
        </AuthGuard>
    );
}