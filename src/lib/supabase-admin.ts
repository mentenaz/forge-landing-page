import { createClient } from "@supabase/supabase-js";

// Server-side client with service role key — bypasses RLS.
// Only use in API routes / server actions, never in client components.
export function createAdminClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_KEY;
	if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY");
	return createClient(url, key);
}
