import { readFile } from "node:fs/promises";
import path from "node:path";

export type DocPage = {
	slug: string;
	title: string;
	description: string;
	/** A tutorial is listed under Tutorials, by feature, and not in the main docs list. Default: a guide. */
	kind?: "guide" | "tutorial";
	/** The features a tutorial belongs to (slugs from `docFeatures`). A tutorial can sit under more than one. */
	features?: string[];
	/** About how long a tutorial takes. */
	minutes?: number;
};

export type DocFeature = {
	slug: string;
	title: string;
	description: string;
	/** The same icon the feature has on the home page, from /public/icons. */
	icon: { src: string; alt: string; width: number; height: number };
};

// The features that tutorials are grouped under. One that has no tutorial yet
// is not shown.
export const docFeatures: DocFeature[] = [
	{
		slug: "workflows",
		title: "Workflows",
		description: "Build, run and stop flows in the Designer and the Flows panel.",
		icon: { src: "/icons/TaskRunner.png", alt: "Workflows", width: 40, height: 29 },
	},
	{
		slug: "node",
		title: "Node",
		description: "Node.js versions, scripts, packages and processes from the Node panel.",
		icon: { src: "/icons/Terminal.png", alt: "Node", width: 27, height: 40 },
	},
	{
		slug: "python",
		title: "Python",
		description: "Python versions, environments, packages and processes from the Python panel.",
		icon: { src: "/icons/Python.png", alt: "Python", width: 40, height: 39 },
	},
];

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
		slug: "first-flow",
		title: "Your first flow",
		description: "Build a small flow in the Designer, run it, and see what it did.",
		kind: "tutorial",
		features: ["workflows"],
		minutes: 5,
	},
	{
		slug: "task-chain",
		title: "Add a task chain",
		description: "Let Forge Super find the servers in your project and build a flow that starts them all.",
		kind: "tutorial",
		features: ["workflows", "node", "python"],
		minutes: 8,
	},
	{
		slug: "node-panel",
		title: "Get around the Node panel",
		description: "Choose a Node version, run scripts, keep packages up to date and stop stray processes.",
		kind: "tutorial",
		features: ["node"],
		minutes: 8,
	},
	{
		slug: "python-panel",
		title: "Get around the Python panel",
		description: "Get a Python, set up an environment, run your project and keep its packages up to date.",
		kind: "tutorial",
		features: ["python"],
		minutes: 8,
	},
	{
		slug: "add-an-extension",
		title: "Add an extension",
		description: "How an extension gets into the catalogue, and how to add one only Forge Super carries.",
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

/** The pages listed in the main docs grid: everything except tutorials. */
export function guidePages(): DocPage[] {
	return docPages.filter((page) => page.kind !== "tutorial");
}

export function tutorialPages(): DocPage[] {
	return docPages.filter((page) => page.kind === "tutorial");
}

export function tutorialsFor(feature: string): DocPage[] {
	return tutorialPages().filter((page) => page.features?.includes(feature));
}

export function findFeature(slug: string): DocFeature | undefined {
	return docFeatures.find((feature) => feature.slug === slug);
}

/** The features that have at least one tutorial, with how many. */
export function featuresWithTutorials(): (DocFeature & { count: number })[] {
	return docFeatures
		.map((feature) => ({ ...feature, count: tutorialsFor(feature.slug).length }))
		.filter((feature) => feature.count > 0);
}

export async function readDocBody(slug: string): Promise<string> {
	return readFile(path.join(process.cwd(), "src", "content", "docs", `${slug}.md`), "utf8");
}
