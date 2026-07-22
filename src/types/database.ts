export interface Extension {
	id: string;
	name: string;
	author: string;
	description: string;
	tier: number;
	downloads: number;
	official: boolean;
	version: string;
	license: string;
	icon_url: string | null;
	repository_url: string | null;
	created_at: string;
	updated_at: string;
}

export interface Release {
	id: string;
	version: string;
	name: string;
	description: string | null;
	is_latest: boolean;
	release_date: string;
	created_at: string;
}

export interface ReleaseAsset {
	id: string;
	release_id: string;
	platform: string;
	filename: string;
	file_size: number | null;
	download_url: string;
	created_at: string;
}

export interface SiteStat {
	key: string;
	value: number;
	updated_at: string;
}

export interface ExtensionSubmission {
	name: string;
	author: string;
	email: string;
	description: string;
	extension_id: string;
	tier: number;
}
