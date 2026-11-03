"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/types/menu";
import PageHeader from "@/components/PageHearder";
import CategoryForm from "@/components/CategoryForm";

export default function EditCategoryPage() {
    const { id } = useParams<{ id: string }>();
    const [category, setCategory] = useState<Category | null>(null);

    useEffect(() => {
        supabase
            .from("categories")
            .select("*")
            .eq("id", id)
            .single()
            .then(({ data }) => setCategory(data as Category | null));
    }, [id]);

    return (
        <>
            <PageHeader title="تعديل قسم" />
            {category ? <CategoryForm key={category.id} category={category} /> : <p>جاري التحميل...</p>}
        </>
    );
}