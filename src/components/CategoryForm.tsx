"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Category, CategoryFormValues } from "@/types/menu";
import FormField from "./FormField";
import ImageUploader from "./ImageUploader";

type CategoryFormProps = {
    category?: Category;
};

const slugify = (text: string) =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

export default function CategoryForm({ category }: CategoryFormProps) {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [values, setValues] = useState<CategoryFormValues>({
        slug: category?.slug ?? "",
        name_ar: category?.name_ar ?? "",
        name_en: category?.name_en ?? "",
        description_ar: category?.description_ar ?? "",
        description_en: category?.description_en ?? "",
        image_url: category?.image_url ?? null,
        sort_order: category?.sort_order ?? 0,
        is_active: category?.is_active ?? true,
    });

    const updateValue = <Key extends keyof CategoryFormValues>(
        key: Key,
        value: CategoryFormValues[Key]
    ) => {
        setValues((previous) => ({ ...previous, [key]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");

        const slug = values.slug.trim() || slugify(values.name_en);

        if (!slug) {
            setErrorMessage("اكتب الاسم الإنجليزي أو الرابط (slug)");
            return;
        }

        setIsSaving(true);

        const payload = {
            slug,
            name_ar: values.name_ar.trim(),
            name_en: values.name_en.trim() || null,
            description_ar: values.description_ar.trim() || null,
            description_en: values.description_en.trim() || null,
            image_url: values.image_url,
            sort_order: Number(values.sort_order),
            is_active: values.is_active,
        };

        const { error } = category
            ? await supabase.from("categories").update(payload).eq("id", category.id)
            : await supabase.from("categories").insert(payload);

        if (error) {
            setErrorMessage(
                error.code === "23505" ? "هذا الرابط (slug) مستخدم لقسم ثاني" : "تعذر الحفظ، حاول مرة ثانية"
            );
            setIsSaving(false);
            return;
        }

        router.push("/categories");
    };

    return (
        <form className="admin-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <FormField label="الاسم بالعربي">
                    <input
                        className="form-input"
                        value={values.name_ar}
                        onChange={(event) => updateValue("name_ar", event.target.value)}
                        required
                    />
                </FormField>

                <FormField label="الاسم بالإنجليزي">
                    <input
                        className="form-input"
                        dir="ltr"
                        value={values.name_en}
                        onChange={(event) => updateValue("name_en", event.target.value)}
                    />
                </FormField>
            </div>

            <div className="form-row">
                <FormField label="الوصف بالعربي">
                    <textarea
                        className="form-textarea"
                        value={values.description_ar}
                        onChange={(event) => updateValue("description_ar", event.target.value)}
                    />
                </FormField>

                <FormField label="الوصف بالإنجليزي">
                    <textarea
                        className="form-textarea"
                        dir="ltr"
                        value={values.description_en}
                        onChange={(event) => updateValue("description_en", event.target.value)}
                    />
                </FormField>
            </div>

            <div className="form-row">
                <FormField label="الرابط (slug)" hint="يظهر بالرابط، إذا تركته فاضي بيتولد من الاسم الإنجليزي">
                    <input
                        className="form-input"
                        dir="ltr"
                        value={values.slug}
                        onChange={(event) => updateValue("slug", event.target.value)}
                    />
                </FormField>

                <FormField label="الترتيب" hint="الرقم الأصغر بيظهر أول">
                    <input
                        className="form-input"
                        type="number"
                        value={values.sort_order}
                        onChange={(event) => updateValue("sort_order", Number(event.target.value))}
                    />
                </FormField>
            </div>

            <ImageUploader
                label="صورة القسم"
                value={values.image_url}
                folder="categories"
                onChange={(imageUrl) => updateValue("image_url", imageUrl)}
            />

            <label className="form-checkbox-row">
                <input
                    type="checkbox"
                    checked={values.is_active}
                    onChange={(event) => updateValue("is_active", event.target.checked)}
                />
                <span>ظاهر بالمنيو</span>
            </label>

            {errorMessage && <p className="form-error">{errorMessage}</p>}

            <div className="form-actions">
                <button className="primary-button form-submit" type="submit" disabled={isSaving}>
                    {isSaving ? "جاري الحفظ..." : "حفظ"}
                </button>
                <Link href="/categories" className="secondary-button">
                    إلغاء
                </Link>
            </div>
        </form>
    );
}