"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { syncItemAddons, syncItemImages } from "@/lib/itemRelations";
import type { AddonDraft, Category, ImageDraft, Item, ItemFormValues } from "@/types/menu";
import FormField from "./FormField";
import ImageListUploader from "./ImageListUploader";
import AddonsEditor from "./AddonsEditor";

type ItemFormProps = {
    item?: Item;
    categories: Category[];
};

export default function ItemForm({ item, categories }: ItemFormProps) {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [values, setValues] = useState<ItemFormValues>({
        category_id: item?.category_id ?? categories[0]?.id ?? "",
        name_ar: item?.name_ar ?? "",
        name_en: item?.name_en ?? "",
        description_ar: item?.description_ar ?? "",
        description_en: item?.description_en ?? "",
        price: item ? String(item.price) : "",
        sort_order: item?.sort_order ?? 0,
        is_active: item?.is_active ?? true,
    });
    const [images, setImages] = useState<ImageDraft[]>(() =>
        [...(item?.item_images ?? [])]
            .sort((first, second) => first.sort_order - second.sort_order)
            .map((image) => ({ key: image.id, id: image.id, image_url: image.image_url }))
    );
    const [addons, setAddons] = useState<AddonDraft[]>(() =>
        [...(item?.item_addons ?? [])]
            .sort((first, second) => first.sort_order - second.sort_order)
            .map((addon) => ({
                key: addon.id,
                id: addon.id,
                name_ar: addon.name_ar,
                name_en: addon.name_en ?? "",
                price: String(addon.price),
                is_active: addon.is_active,
            }))
    );

    const updateValue = <Key extends keyof ItemFormValues>(
        key: Key,
        value: ItemFormValues[Key]
    ) => {
        setValues((previous) => ({ ...previous, [key]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        setIsSaving(true);

        const payload = {
            category_id: values.category_id,
            name_ar: values.name_ar.trim(),
            name_en: values.name_en.trim() || null,
            description_ar: values.description_ar.trim() || null,
            description_en: values.description_en.trim() || null,
            price: Number(values.price),
            sort_order: Number(values.sort_order),
            is_active: values.is_active,
        };

        let savedItemId = item?.id ?? "";

        if (item) {
            const { error } = await supabase.from("items").update(payload).eq("id", item.id);

            if (error) {
                setErrorMessage("تعذر حفظ الصنف، حاول مرة ثانية");
                setIsSaving(false);
                return;
            }
        } else {
            const { data, error } = await supabase
                .from("items")
                .insert(payload)
                .select("id")
                .single();

            if (error || !data) {
                setErrorMessage("تعذر حفظ الصنف، حاول مرة ثانية");
                setIsSaving(false);
                return;
            }

            savedItemId = data.id;
        }

        const imagesError = await syncItemImages(savedItemId, images, item?.item_images ?? []);
        const addonsError = await syncItemAddons(savedItemId, addons, item?.item_addons ?? []);

        if (imagesError || addonsError) {
            if (!item) await supabase.from("items").delete().eq("id", savedItemId);
            setErrorMessage("تعذر حفظ الصور أو الإضافات، حاول مرة ثانية");
            setIsSaving(false);
            return;
        }

        router.push("/items");
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
                <FormField label="القسم">
                    <select
                        className="form-input"
                        value={values.category_id}
                        onChange={(event) => updateValue("category_id", event.target.value)}
                        required
                    >
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name_ar}
                            </option>
                        ))}
                    </select>
                </FormField>

                <FormField label="السعر">
                    <input
                        className="form-input"
                        dir="ltr"
                        type="number"
                        min="0"
                        step="0.01"
                        value={values.price}
                        onChange={(event) => updateValue("price", event.target.value)}
                        required
                    />
                </FormField>
            </div>

            <div className="form-row">
                <FormField label="الترتيب" hint="الرقم الأصغر بيظهر أول داخل القسم">
                    <input
                        className="form-input"
                        type="number"
                        value={values.sort_order}
                        onChange={(event) => updateValue("sort_order", Number(event.target.value))}
                    />
                </FormField>

                <label className="form-checkbox-row form-checkbox-aligned">
                    <input
                        type="checkbox"
                        checked={values.is_active}
                        onChange={(event) => updateValue("is_active", event.target.checked)}
                    />
                    <span>ظاهر بالمنيو</span>
                </label>
            </div>

            <ImageListUploader
                label="صور الصنف"
                hint="أول صورة هي الرئيسية وبتظهر بالمنيو"
                images={images}
                folder="items"
                onChange={setImages}
            />

            <AddonsEditor addons={addons} onChange={setAddons} />

            {errorMessage && <p className="form-error">{errorMessage}</p>}

            <div className="form-actions">
                <button className="primary-button form-submit" type="submit" disabled={isSaving}>
                    {isSaving ? "جاري الحفظ..." : "حفظ"}
                </button>
                <Link href="/items" className="secondary-button">
                    إلغاء
                </Link>
            </div>
        </form>
    );
}