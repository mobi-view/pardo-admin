"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { isAdminUser } from "@/lib/auth";

export default function AuthGuard({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const checkAccess = async () => {
            const { data } = await supabase.auth.getSession();
            const user = data.session?.user;

            if (!user || !(await isAdminUser(user.id))) {
                router.replace("/login");
                return;
            }

            setIsReady(true);
        };

        checkAccess();

        const { data: listener } = supabase.auth.onAuthStateChange((event) => {
            if (event === "SIGNED_OUT") router.replace("/login");
        });

        return () => listener.subscription.unsubscribe();
    }, [router]);

    if (!isReady) return <div className="admin-loading">جاري التحميل...</div>;

    return <>{children}</>;
}