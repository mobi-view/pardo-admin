"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/types/menu";
import PageHeader from "@/components/PageHearder";
import ItemForm from "@/components/ItemForm";

export default function NewItemPage() {
    const [categories, setCategories] = useState<Category[] | null>(null);

    useEffect(() => {
        supabase
            .from("categories")
            .select("*")
            .order("sort_order")
            .then(({ data }) => setCategories((data as Category[]) ?? []));
    }, []);

    return (
        <>
            <PageHeader title="إضافة صنف" />
            {categories ? <ItemForm categories={categories} /> : <p>جاري التحميل...</p>}
        </>
    );
}