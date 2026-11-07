"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { ExtraGroup } from "@/types/menu";
import PageHeader from "@/components/PageHearder";
import ExtraGroupForm from "@/components/ExtraGroupForm";

export default function EditExtraGroupPage() {
    const { id } = useParams<{ id: string }>();
    const [group, setGroup] = useState<ExtraGroup | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        supabase
            .from("extra_groups")
            .select("*, extra_group_options(*)")
            .eq("id", id)
            .single()
            .then(({ data }) => {
                setGroup(data as ExtraGroup | null);
                setIsLoading(false);
            });
    }, [id]);

    return (
        <>
            <PageHeader title="تعديل مجموعة" />
            {isLoading && <p>جاري التحميل...</p>}
            {!isLoading && !group && <p className="empty-state">المجموعة غير موجودة</p>}
            {group && <ExtraGroupForm key={group.id} group={group} />}
        </>
    );
}