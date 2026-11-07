"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Category, ExtraGroup } from "@/types/menu";
import PageHeader from "@/components/PageHearder";
import ItemForm from "@/components/ItemForm";

export default function NewItemPage() {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [extraGroups, setExtraGroups] = useState<ExtraGroup[]>([]);

    useEffect(() => {
        Promise.all([
            supabase.from("categories").select("*").order("sort_order"),
            supabase.from("extra_groups").select("*, extra_group_options(*)").order("sort_order"),
        ]).then(([categoriesResult, groupsResult]) => {
            setCategories((categoriesResult.data as Category[]) ?? []);
            setExtraGroups((groupsResult.data as ExtraGroup[]) ?? []);
        });
    }, []);

    return (
        <>
            <PageHeader title="إضافة صنف" />
            {categories ? (
                <ItemForm categories={categories} extraGroups={extraGroups} />
            ) : (
                <p>جاري التحميل...</p>
            )}
        </>
    );
}