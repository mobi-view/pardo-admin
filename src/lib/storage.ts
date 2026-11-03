import { supabase } from "./supabase";

export async function uploadImage(file: File, folder: string) {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${folder}/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
        .from("menu-images")
        .upload(path, file, { cacheControl: "31536000", upsert: false });

    if (error) throw error;

    const { data } = supabase.storage.from("menu-images").getPublicUrl(path);
    return data.publicUrl;
}