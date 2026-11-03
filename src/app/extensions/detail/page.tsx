import { redirect } from "next/navigation";

// The extension catalogue used to open an extension at /extensions/detail?id=<id>.
// Extensions now live at /extensions/<id>, so old links are forwarded there.
export default async function LegacyExtensionDetail({
	searchParams,
}: {
	searchParams: Promise<{ id?: string }>;
}) {
	const { id } = await searchParams;
	redirect(id ? `/extensions/${encodeURIComponent(id)}` : "/extensions");
}
