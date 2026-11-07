"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { ExtraGroup } from "@/types/menu";
import PageHeader from "@/components/PageHearder";

type ExtraGroupRow = Omit<ExtraGroup, "extra_group_options"> & {
    extra_group_options: { id: string }[];
};

export default function ExtraGroupsPage() {
    const [groups, setGroups] = useState<ExtraGroupRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadGroups = useCallback(async () => {
        const { data } = await supabase
            .from("extra_groups")
            .select("*, extra_group_options(id)")
            .order("sort_order");
        setGroups((data as unknown as ExtraGroupRow[]) ?? []);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadGroups();
    }, [loadGroups]);

    const deleteGroup = async (group: ExtraGroupRow) => {
        const isConfirmed = window.confirm(
            `حذف المجموعة "${group.name_ar}"؟ الأصناف اللي نسخت منها قبل ما بتتأثر.`
        );
        if (!isConfirmed) return;

        await supabase.from("extra_groups").delete().eq("id", group.id);
        loadGroups();
    };

    return (
        <>
            <PageHeader
                title="مجموعات الإضافات"
                actionHref="/extra-groups/new"
                actionLabel="إضافة مجموعة"
            />

            {isLoading && <p className="empty-state">جاري التحميل...</p>}

            {!isLoading && groups.length === 0 && (
                <p className="empty-state">ما في مجموعات بعد</p>
            )}

            <div className="record-list">
                {groups.map((group) => (
                    <div className="record-row" key={group.id}>
                        <div className="record-info">
                            <span className="record-title">{group.name_ar}</span>
                            <span className="record-meta">
                                {group.name_en} · {group.extra_group_options.length} خيارات
                            </span>
                        </div>

                        <div className="record-actions">
                            <Link href={`/extra-groups/${group.id}`} className="secondary-button">
                                تعديل
                            </Link>
                            <button className="danger-button" onClick={() => deleteGroup(group)}>
                                حذف
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}