"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/types/menu";
import PageHeader from "@/components/PageHearder";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadCategories = useCallback(async () => {
        const { data } = await supabase.from("categories").select("*").order("sort_order");
        setCategories((data as Category[]) ?? []);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const toggleActive = async (category: Category) => {
        await supabase
            .from("categories")
            .update({ is_active: !category.is_active })
            .eq("id", category.id);
        loadCategories();
    };

    const deleteCategory = async (category: Category) => {
        const isConfirmed = window.confirm(
            `حذف القسم "${category.name_ar}"؟ رح تنحذف كل أصنافه كمان.`
        );
        if (!isConfirmed) return;

        await supabase.from("categories").delete().eq("id", category.id);
        loadCategories();
    };

    return (
        <>
            <PageHeader title="الأقسام" actionHref="/categories/new" actionLabel="إضافة قسم" />

            {isLoading && <p className="empty-state">جاري التحميل...</p>}

            {!isLoading && categories.length === 0 && (
                <p className="empty-state">ما في أقسام بعد</p>
            )}

            <div className="record-list">
                {categories.map((category) => (
                    <div className="record-row" key={category.id}>
                        {category.image_url ? (
                            <img className="record-image" src={category.image_url} alt="" />
                        ) : (
                            <div className="record-image-empty">بدون صورة</div>
                        )}

                        <div className="record-info">
                            <span className="record-title">{category.name_ar}</span>
                            <span className="record-meta">
                                {category.name_en} · {category.slug} · ترتيب {category.sort_order}
                            </span>
                        </div>

                        <div className="record-actions">
                            <button
                                className={
                                    category.is_active
                                        ? "status-toggle status-toggle-active"
                                        : "status-toggle"
                                }
                                onClick={() => toggleActive(category)}
                            >
                                {category.is_active ? "ظاهر" : "مخفي"}
                            </button>
                            <Link href={`/categories/${category.id}`} className="secondary-button">
                                تعديل
                            </Link>
                            <button className="danger-button" onClick={() => deleteCategory(category)}>
                                حذف
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}