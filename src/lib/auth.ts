import { supabase } from "./supabase";

export async function isAdminUser(userId: string) {
    const { data } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

    return Boolean(data);
}