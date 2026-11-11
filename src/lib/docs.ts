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
	{
		slug: "dotnet",
		title: ".NET",
		description: "The .NET SDK, projects, NuGet packages and processes from the .NET panel.",
		icon: { src: "/icons/CSharp.png", alt: ".NET", width: 40, height: 36 },
	},
	{
		slug: "database",
		title: "Databases",
		description: "Connect to SQLite and server databases, run SQL and see the schema in the Database panel.",
		icon: { src: "/icons/SQLWorkBenchNDG.png", alt: "Databases", width: 40, height: 35 },
	},
	{
		slug: "rust",
		title: "Rust",
		description: "Toolchains, crates, dependencies and advisories from the Rust panel and the Cargo Manager.",
		icon: { src: "/icons/Rust.png", alt: "Rust", width: 40, height: 36 },
	},
	{
		slug: "dashboard",
		title: "Cockpit and Dashboard",
		description: "Live system readings, and one view of every runtime's packages, security and git state.",
		icon: { src: "/icons/Forge_Cockpit.png", alt: "Cockpit and Dashboard", width: 40, height: 40 },
	},
	{
		slug: "script-runner",
		title: "Script Runner",
		description: "Run commands and read their output live, in the panel the other panels share.",
		icon: { src: "/icons/RunnerNoBG.png", alt: "Script Runner", width: 40, height: 37 },
	},
	{
		slug: "processes",
		title: "Processes",
		description: "Find, mark and end the processes running on your machine, from the Processes panel.",
		icon: { src: "/icons/Proccessors_NBG.png", alt: "Processes", width: 40, height: 34 },
	},
	{
		slug: "helm",
		title: "Helm",
		description: "Sign in to GitHub, read repositories without cloning, and handle everyday GitHub chores in the editor.",
		icon: { src: "/icons/GitOps_NBG.png", alt: "Helm", width: 40, height: 40 },
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
		slug: "different-from-zed",
		title: "What's different from Zed",
		description: "What Forge Super removed, changed and added, and when Zed's own documentation applies.",
	},
	{
		slug: "shortcuts",
		title: "Keyboard shortcuts",
		description: "The keys that open each Forge Super panel, the keys inside the panels, and how to change them.",
	},
	{
		slug: "using-zed-features",
		title: "Using Zed's own features",
		description: "Zed's documentation, section by section: which pages apply to Forge Super, which differ, and which do not.",
	},
	{
		slug: "ai-setup",
		title: "AI setup",
		description: "Connect a model provider for the agent and choose an edit prediction provider.",
	},
	{
		slug: "designer-reference",
		title: "Designer reference",
		description: "Every action, setting and state in the workflow Designer, and how steps connect and share results.",
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
		slug: "flows-panel",
		title: "Manage and run your flows",
		description: "Create, run and stop flows from the list, see how each last ended, and open the links of the servers they start.",
		kind: "tutorial",
		features: ["workflows"],
		minutes: 6,
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
		slug: "npm-manager",
		title: "Manage npm packages",
		description: "Search, install, update and remove npm packages, and open the manager from your code.",
		kind: "tutorial",
		features: ["node"],
		minutes: 6,
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
		slug: "python-manager",
		title: "Manage Python packages",
		description: "Look up packages on PyPI, install and update them, and scan for vulnerabilities.",
		kind: "tutorial",
		features: ["python"],
		minutes: 6,
	},
	{
		slug: "dotnet-panel",
		title: "Get around the .NET panel",
		description: "Build, run and test a project, and manage its NuGet packages.",
		kind: "tutorial",
		features: ["dotnet"],
		minutes: 8,
	},
	{
		slug: "nuget-manager",
		title: "Manage NuGet packages",
		description: "Search nuget.org, and install, update and remove the packages of a .NET project.",
		kind: "tutorial",
		features: ["dotnet"],
		minutes: 6,
	},
	{
		slug: "database-panel",
		title: "Connect to a database and run a query",
		description: "Add a connection, explore a schema, run SQL in the workbench and see the schema graph.",
		kind: "tutorial",
		features: ["database"],
		minutes: 10,
	},
	{
		slug: "rust-panel",
		title: "Get around the Rust panel",
		description: "Check, build and test a crate, read what is out of date, and manage its dependencies.",
		kind: "tutorial",
		features: ["rust"],
		minutes: 10,
	},
	{
		slug: "cargo-manager",
		title: "Manage Cargo dependencies",
		description: "Add, update and remove a crate's dependencies, with every change confirmed first.",
		kind: "tutorial",
		features: ["rust"],
		minutes: 8,
	},
	{
		slug: "dashboard-panel",
		title: "See your whole project on the Dashboard",
		description: "Open the Dashboard to check runtimes, outdated packages, vulnerabilities, git and system load at once.",
		kind: "tutorial",
		features: ["dashboard"],
		minutes: 5,
	},
	{
		slug: "script-runner",
		title: "Run commands in the Script Runner",
		description: "Run a command, watch its output live, stop it, and open the links it prints.",
		kind: "tutorial",
		features: ["script-runner"],
		minutes: 5,
	},
	{
		slug: "processes-panel",
		title: "Find and stop a process",
		description: "Find a process in the live table, mark the ones you care about, and end the ones you do not.",
		kind: "tutorial",
		features: ["processes"],
		minutes: 5,
	},
	{
		slug: "helm-panel",
		title: "Sign in to GitHub and explore a repository",
		description: "Sign in with Helm, find a repository, read its code without cloning, clone it, and use more than one account.",
		kind: "tutorial",
		features: ["helm"],
		minutes: 10,
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
		slug: "helm-admin",
		title: "Helm for administrators",
		description: "What Helm can reach, where it keeps credentials, and what a GitHub organisation owner controls.",
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
