import { supabase } from "./supabase";
import type { AddonDraft, ImageDraft, ItemAddon, ItemImage } from "@/types/menu";

export async function syncItemImages(
    itemId: string,
    drafts: ImageDraft[],
    originalImages: ItemImage[]
) {
    const existingRows = drafts.flatMap((draft, index) =>
        draft.id
            ? [{ id: draft.id, item_id: itemId, image_url: draft.image_url, sort_order: index + 1 }]
            : []
    );
    const newRows = drafts.flatMap((draft, index) =>
        draft.id
            ? []
            : [{ item_id: itemId, image_url: draft.image_url, sort_order: index + 1 }]
    );
    const keptIds = existingRows.map((row) => row.id);
    const removedIds = originalImages
        .map((image) => image.id)
        .filter((imageId) => !keptIds.includes(imageId));

    if (existingRows.length > 0) {
        const { error } = await supabase.from("item_images").upsert(existingRows);
        if (error) return error;
    }

    if (newRows.length > 0) {
        const { error } = await supabase.from("item_images").insert(newRows);
        if (error) return error;
    }

    if (removedIds.length > 0) {
        const { error } = await supabase.from("item_images").delete().in("id", removedIds);
        if (error) return error;
    }

    return null;
}

export async function syncItemAddons(
    itemId: string,
    drafts: AddonDraft[],
    originalAddons: ItemAddon[]
) {
    const buildRow = (draft: AddonDraft, index: number) => ({
        item_id: itemId,
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
    const removedIds = originalAddons
        .map((addon) => addon.id)
        .filter((addonId) => !keptIds.includes(addonId));

    if (existingRows.length > 0) {
        const { error } = await supabase.from("item_addons").upsert(existingRows);
        if (error) return error;
    }

    if (newRows.length > 0) {
        const { error } = await supabase.from("item_addons").insert(newRows);
        if (error) return error;
    }

    if (removedIds.length > 0) {
        const { error } = await supabase.from("item_addons").delete().in("id", removedIds);
        if (error) return error;
    }

    return null;
}