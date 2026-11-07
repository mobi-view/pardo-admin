import { supabase } from "./supabase";
import type { AddonDraft, ExtraGroupOption } from "@/types/menu";

export async function syncGroupOptions(
    groupId: string,
    drafts: AddonDraft[],
    originalOptions: ExtraGroupOption[]
) {
    const buildRow = (draft: AddonDraft, index: number) => ({
        group_id: groupId,
        name_ar: draft.name_ar.trim(),
        name_en: draft.name_en.trim() || null,
        price: Number(draft.price),
        sort_order: index + 1,
        is_active: draft.is_active,
    });

    const existingRows = drafts.flatMap((draft, index) =>
        draft.id ? [{ id: draft.id, ...buildRow(draft, index) }] : []
    );
    const newRows = drafts.flatMap((draft, index) =>
        draft.id ? [] : [buildRow(draft, index)]
    );
    const keptIds = existingRows.map((row) => row.id);
    const removedIds = originalOptions
        .map((option) => option.id)
        .filter((optionId) => !keptIds.includes(optionId));

    if (existingRows.length > 0) {
        const { error } = await supabase.from("extra_group_options").upsert(existingRows);
        if (error) return error;
    }

    if (newRows.length > 0) {
        const { error } = await supabase.from("extra_group_options").insert(newRows);
        if (error) return error;
    }

    if (removedIds.length > 0) {
        const { error } = await supabase
            .from("extra_group_options")
            .delete()
            .in("id", removedIds);
        if (error) return error;
    }

    return null;
}