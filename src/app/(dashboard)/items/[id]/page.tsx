"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Category, Item } from "@/types/menu";
import PageHeader from "@/components/PageHearder";
import ItemForm from "@/components/ItemForm";

export default function EditItemPage() {
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<Item | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            supabase
                .from("items")
                .select("*, item_images(*), item_addons(*)")
                .eq("id", id)
                .single(),
            supabase.from("categories").select("*").order("sort_order"),
        ]).then(([itemResult, categoriesResult]) => {
            setItem(itemResult.data as Item | null);
            setCategories((categoriesResult.data as Category[]) ?? []);
            setIsLoading(false);
        });
    }, [id]);

    return (
        <>
            <PageHeader title="تعديل صنف" />
            {isLoading && <p>جاري التحميل...</p>}
            {!isLoading && !item && <p className="empty-state">الصنف غير موجود</p>}
            {item && <ItemForm key={item.id} item={item} categories={categories} />}
        </>
    );
}