import { NextRequest, NextResponse } from "next/server";
import { createTwinAdminClient } from "@/lib/supabase-admin";

export async function DELETE(req: NextRequest) {
	let body: { userId?: string };
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
	}

	const { userId } = body;
	if (!userId || typeof userId !== "string") {
		return NextResponse.json({ error: "userId required" }, { status: 400 });
	}

	const twinAdmin = createTwinAdminClient();

	const authHeader = req.headers.get("authorization");
	if (!authHeader) {
		return NextResponse.json({ error: "Missing authorization header" }, { status: 401 });
	}

	const token = authHeader.replace("Bearer ", "");

	const {
		data: { user: caller },
		error: authError,
	} = await twinAdmin.auth.getUser(token);

	if (authError || !caller) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { data: profile } = await twinAdmin
		.from("profiles")
		.select("is_admin")
		.eq("id", caller.id)
		.single();

	if (profile?.is_admin !== "true" && profile?.is_admin !== true) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const { error } = await twinAdmin.auth.admin.deleteUser(userId);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}

export const dynamic = "force-dynamic";
