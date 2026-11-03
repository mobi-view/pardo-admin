import type { Metadata } from "next";
import "../style/Admin.css";

export const metadata: Metadata = {
    title: "Pardo Admin",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ar" dir="rtl">
            <body>{children}</body>
        </html>
    );
}