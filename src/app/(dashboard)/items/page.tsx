"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Category, Item } from "@/types/menu";
import PageHeader from "@/components/PageHearder";

type ItemListRow = Omit<Item, "item_addons"> & {
    categories: { name_ar: string } | null;
};

export default function ItemsPage() {
    const [items, setItems] = useState<ItemListRow[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);

    const loadItems = useCallback(async () => {
        const { data } = await supabase
            .from("items")
            .select("*, categories(name_ar), item_images(*)")
            .order("sort_order");
        setItems((data as unknown as ItemListRow[]) ?? []);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadItems();

        supabase
            .from("categories")
            .select("*")
            .order("sort_order")
            .then(({ data }) => setCategories((data as Category[]) ?? []));
    }, [loadItems]);

    const toggleActive = async (item: ItemListRow) => {
        await supabase.from("items").update({ is_active: !item.is_active }).eq("id", item.id);
        loadItems();
    };

    const deleteItem = async (item: ItemListRow) => {
        const isConfirmed = window.confirm(`حذف الصنف "${item.name_ar}" مع صوره وإضافاته؟`);
        if (!isConfirmed) return;

        await supabase.from("items").delete().eq("id", item.id);
        loadItems();
    };

    const visibleItems =
        categoryFilter === "all"
            ? items
            : items.filter((item) => item.category_id === categoryFilter);

    return (
        <>
            <PageHeader title="الأصناف" actionHref="/items/new" actionLabel="إضافة صنف" />

            <div className="filter-bar">
                <select
                    className="form-input"
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                >
                    <option value="all">كل الأقسام</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name_ar}
                        </option>
                    ))}
                </select>
            </div>

            {isLoading && <p className="empty-state">جاري التحميل...</p>}

            {!isLoading && visibleItems.length === 0 && (
                <p className="empty-state">ما في أصناف</p>
            )}

            <div className="record-list">
                {visibleItems.map((item) => {
                    const coverImage = [...item.item_images].sort(
                        (first, second) => first.sort_order - second.sort_order
                    )[0];

                    return (
                        <div className="record-row" key={item.id}>
                            {coverImage ? (
                                <img className="record-image" src={coverImage.image_url} alt="" />
                            ) : (
                                <div className="record-image-empty">بدون صورة</div>
                            )}

                            <div className="record-info">
                                <span className="record-title">{item.name_ar}</span>
                                <span className="record-meta">
                                    {item.categories?.name_ar} · {Number(item.price).toFixed(2)} ·
                                    ترتيب {item.sort_order}
                                </span>
                            </div>

                            <div className="record-actions">
                                <button
                                    className={
                                        item.is_active
                                            ? "status-toggle status-toggle-active"
                                            : "status-toggle"
                                    }
                                    onClick={() => toggleActive(item)}
                                >
                                    {item.is_active ? "ظاهر" : "مخفي"}
                                </button>
                                <Link href={`/items/${item.id}`} className="secondary-button">
                                    تعديل
                                </Link>
                                <button className="danger-button" onClick={() => deleteItem(item)}>
                                    حذف
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}