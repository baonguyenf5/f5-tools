import { UserMapping } from "@/lib/types/types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getUserMapping(
  supabase: SupabaseClient,
  userEmail: string | undefined
) {
  const query = await supabase
    .from("user_mapping")
    .select("*")
    .eq("user_email", userEmail);

  if (query.error) {
    throw new Error(`Error fetching user mapping: ${query.error.message}`);
  }

  return query.data?.[0] as UserMapping | undefined;
}
