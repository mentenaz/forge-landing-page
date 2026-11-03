import { NextResponse } from "next/server";
import {
	registryAdminClient,
	toExtensionMetadata,
	RegistryExtensionRow,
	REGISTRY_ROW_COLUMNS,
} from "@/lib/registry";

// GET /api/registry/extensions/{id} — single extension's latest version.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const admin = registryAdminClient();
	const { data, error } = await admin
		.from("registry_extensions")
		.select(REGISTRY_ROW_COLUMNS)
		.eq("id", id)
		.eq("is_latest", true)
		.maybeSingle();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	if (!data) {
		return NextResponse.json({ error: "not found" }, { status: 404 });
	}

	return NextResponse.json({
		data: [toExtensionMetadata(data as RegistryExtensionRow)],
	});
}

export const dynamic = "force-dynamic";
