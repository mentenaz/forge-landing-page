import { createClient } from "@supabase/supabase-js";

const twinUrl = process.env.NEXT_PUBLIC_TWIN_URL!;
const twinAnonKey = process.env.NEXT_PUBLIC_TWIN_ANON_KEY!;

export const twin = createClient(twinUrl, twinAnonKey);
