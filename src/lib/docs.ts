import { readFile } from "node:fs/promises";
import path from "node:path";

export type DocPage = {
	slug: string;
	title: string;
	description: string;
};

// The order here is the order on the docs hub. The body of each page is
// src/content/docs/<slug>.md.
export const docPages: DocPage[] = [
	{
		slug: "install",
		title: "Install",
		description: "Get Forge Super on Windows or Debian-based Linux.",
	},
	{
		slug: "ai-setup",
		title: "AI setup",
		description: "Connect a model provider for the agent and choose an edit prediction provider.",
	},
	{
		slug: "updating",
		title: "Updating",
		description: "How updates reach you, since the built-in updater is off.",
	},
	{
		slug: "privacy",
		title: "Privacy",
		description: "What Forge Super contacts and when, and what it never sends.",
	},
	{
		slug: "windows",
		title: "Windows troubleshooting",
		description: "Graphics, the software-emulated GPU warning, and file watching.",
	},
	{
		slug: "linux",
		title: "Linux and graphics troubleshooting",
		description: "Vulkan, software-emulated GPU warnings, choosing a GPU, and logs.",
	},
];

export function findDoc(slug: string): DocPage | undefined {
	return docPages.find((page) => page.slug === slug);
}

export async function readDocBody(slug: string): Promise<string> {
	return readFile(path.join(process.cwd(), "src", "content", "docs", `${slug}.md`), "utf8");
}
