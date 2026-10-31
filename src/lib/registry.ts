import { createAdminClient } from "@/lib/supabase-admin";

// Shared by every src/app/api/registry/** route. Mirrors
// cloud_api_types::ExtensionMetadata / GetExtensionsResponse in the Zed
// fork (E:\zed_Source) — extension_host.rs (crates/extension_host) expects
// this exact flattened shape from whatever host its base URL is pointed at.
export type RegistryExtensionRow = {
	id: string;
	version: string;
	is_latest: boolean;
	name: string;
	description: string | null;
	authors: string[];
	repository: string;
	schema_version: number | null;
	wasm_api_version: string | null;
	provides: string[];
	published_at: string;
	download_count: number;
	artifact_url: string;
};

export type ExtensionMetadata = {
	id: string;
	name: string;
	version: string;
	description: string | null;
	authors: string[];
	repository: string;
	schema_version: number | null;
	wasm_api_version: string | null;
	provides: string[];
	published_at: string;
	download_count: number;
};

// Flattens a row to the shape ExtensionMetadata expects: id/name/version/...
// at the top level, not nested — cloud_api_types::ExtensionMetadata has
// #[serde(flatten)] on its manifest field, so the Rust client expects flat.
export function toExtensionMetadata(row: RegistryExtensionRow): ExtensionMetadata {
	return {
		id: row.id,
		name: row.name,
		version: row.version,
		description: row.description,
		authors: row.authors,
		repository: row.repository,
		schema_version: row.schema_version,
		wasm_api_version: row.wasm_api_version,
		provides: row.provides,
		published_at: row.published_at,
		download_count: row.download_count,
	};
}

export function registryAdminClient() {
	return createAdminClient();
}
