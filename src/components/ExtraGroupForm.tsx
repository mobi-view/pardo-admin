"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { syncGroupOptions } from "@/lib/extraGroups";
import type { AddonDraft, ExtraGroup, ExtraGroupFormValues } from "@/types/menu";
import FormField from "./FormField";
import AddonsEditor from "./AddonsEditor";

type ExtraGroupFormProps = {
    group?: ExtraGroup;
};

export default function ExtraGroupForm({ group }: ExtraGroupFormProps) {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [values, setValues] = useState<ExtraGroupFormValues>({
        name_ar: group?.name_ar ?? "",
        name_en: group?.name_en ?? "",
        sort_order: group?.sort_order ?? 0,
    });
    const [options, setOptions] = useState<AddonDraft[]>(() =>
        [...(group?.extra_group_options ?? [])]
            .sort((first, second) => first.sort_order - second.sort_order)
            .map((option) => ({
                key: option.id,
                id: option.id,
                name_ar: option.name_ar,
                name_en: option.name_en ?? "",
                price: String(option.price),
                is_active: option.is_active,
            }))
    );

    const updateValue = <Key extends keyof ExtraGroupFormValues>(
        key: Key,
        value: ExtraGroupFormValues[Key]
    ) => {
        setValues((previous) => ({ ...previous, [key]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");

        if (options.length === 0) {
            setErrorMessage("أضف خياراً واحداً على الأقل");
            return;
        }

        setIsSaving(true);

        const payload = {
            name_ar: values.name_ar.trim(),
            name_en: values.name_en.trim() || null,
            sort_order: Number(values.sort_order),
        };

        let savedGroupId = group?.id ?? "";

        if (group) {
            const { error } = await supabase
                .from("extra_groups")
                .update(payload)
                .eq("id", group.id);

            if (error) {
                setErrorMessage("تعذر حفظ المجموعة، حاول مرة ثانية");
                setIsSaving(false);
                return;
            }
        } else {
            const { data, error } = await supabase
                .from("extra_groups")
                .insert(payload)
                .select("id")
                .single();

            if (error || !data) {
                setErrorMessage("تعذر حفظ المجموعة، حاول مرة ثانية");
                setIsSaving(false);
                return;
            }

            savedGroupId = data.id;
        }

        const optionsError = await syncGroupOptions(
            savedGroupId,
            options,
            group?.extra_group_options ?? []
        );

        if (optionsError) {
            if (!group) await supabase.from("extra_groups").delete().eq("id", savedGroupId);
            setErrorMessage("تعذر حفظ الخيارات، حاول مرة ثانية");
            setIsSaving(false);
            return;
        }

        router.push("/extra-groups");
    };

    return (
        <form className="admin-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <FormField label="اسم المجموعة بالعربي" hint="مثال: اختر نوع الحليب">
                    <input
                        className="form-input"
                        value={values.name_ar}
                        onChange={(event) => updateValue("name_ar", event.target.value)}
                        required
                    />
                </FormField>

                <FormField label="اسم المجموعة بالإنجليزي" hint="Example: Choose your milk">
                    <input
                        className="form-input"
                        dir="ltr"
                        value={values.name_en}
                        onChange={(event) => updateValue("name_en", event.target.value)}
                    />
                </FormField>
            </div>

            <FormField label="الترتيب" hint="الرقم الأصغر بيظهر أول بقائمة الاختيار">
                <input
                    className="form-input"
                    type="number"
                    value={values.sort_order}
                    onChange={(event) => updateValue("sort_order", Number(event.target.value))}
                />
            </FormField>

            <AddonsEditor
                label="الخيارات"
                addLabel="+ إضافة خيار"
                emptyLabel="ما في خيارات بعد"
                addons={options}
                onChange={setOptions}
            />

            {errorMessage && <p className="form-error">{errorMessage}</p>}

            <div className="form-actions">
                <button className="primary-button form-submit" type="submit" disabled={isSaving}>
                    {isSaving ? "جاري الحفظ..." : "حفظ"}
                </button>
                <Link href="/extra-groups" className="secondary-button">
                    إلغاء
                </Link>
            </div>
        </form>
    );
}