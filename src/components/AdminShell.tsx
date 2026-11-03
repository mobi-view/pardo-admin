"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabase";

const navLinks = [
    { href: "/", label: "لوحة التحكم" },
    { href: "/categories", label: "الأقسام" },
    { href: "/items", label: "الأصناف" },
];

export default function AdminShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="admin-shell">
            <header className="admin-header">
                <span className="admin-brand">Pardo Admin</span>
                <button className="admin-logout" onClick={handleLogout}>
                    تسجيل الخروج
                </button>
            </header>

            <div className="admin-body">
                <nav className="admin-nav">
                    {navLinks.map((link) => {
                        const isActive =
                            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={
                                    isActive
                                        ? "admin-nav-link admin-nav-link-active"
                                        : "admin-nav-link"
                                }
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <main className="admin-content">{children}</main>
            </div>
        </div>
    );
}