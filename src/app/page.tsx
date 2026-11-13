import Link from "next/link";
import FeatureCard, { ForgeIcon } from "@/components/FeatureCard";
import StatCard from "@/components/StatCard";
import DownloadButton from "@/components/DownloadButton";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroMedia from "@/components/HeroMedia";
import { heroChips, heroChipsNote, heroEngines } from "@/config/hero";
import { supabase } from "@/lib/supabase";
import type { InstallMethod, LatestRelease } from "@/types/database";
import styles from "./page.module.css";

const FEATURES = [
	{
		icon: <ForgeIcon src="/icons/Code.png" alt="Editor" width={40} height={21} />,
		title: "Built on Zed",
		description:
			"A fast, GPU-accelerated native editor with tree-sitter highlighting, multi-cursor editing and Zed's extension system.",
	},
	{
		icon: <ForgeIcon src="/icons/ProblemsNBG.png" alt="Language support" width={40} height={36} />,
		title: "Language support",
		description:
			"Language servers for the languages you use, installed when a project needs them. Diagnostics, go to definition and formatting.",
	},
	{
		icon: <ForgeIcon src="/icons/SQLWorkBenchNDG.png" alt="Database workbench" width={40} height={35} />,
		title: "Database workbench",
		description:
			"SQLite, PostgreSQL, MySQL and MariaDB, SQL Server and Oracle in the editor. In testing on Windows, 30 connections open at once, each with its schema graph and workbench, added under 100 MB of memory.",
	},
	{
		icon: <ForgeIcon src="/icons/GitOps_NBG.png" alt="GitHub" width={40} height={40} />,
		title: "Helm",
		description:
			"GitHub management in the editor, plus a read-only repository workspace for files, commits, comparisons and code search.",
	},
	{
		icon: <ForgeIcon src="/icons/AITwin.png" alt="AI" width={40} height={40} />,
		title: "Your AI, or none",
		description:
			"Connect Anthropic, OpenAI, Google, Ollama or any compatible endpoint. Nothing is switched on until you set it up.",
	},
	{
		icon: <ForgeIcon src="/icons/Forge_Cockpit.png" alt="Cockpit" width={40} height={40} />,
		title: "Cockpit and processes",
		description:
			"See what is running and what is slow, and kill what is stuck, without opening the Task Manager.",
	},
	{
		icon: <ForgeIcon src="/icons/TaskRunner.png" alt="Workflows" width={40} height={29} />,
		title: "Workflows",
		description:
			"Chain scripts into branching workflows and run them from an interactive graph.",
	},
	{
		icon: <ForgeIcon src="/icons/Terminal.png" alt="Runtimes and packages" width={27} height={40} />,
		title: "Runtimes and packages",
		description:
			"Node, .NET, Python and Rust panels with npm, NuGet, pip and Cargo: registry search, outdated views and security advisories.",
	},
];

const GETTING_STARTED = [
	{
		title: "Install",
		text: "Use the Windows installer or apt. It takes about a minute.",
		href: "/docs/install",
		linkLabel: "Install guide",
	},
	{
		title: "Open a project",
		text: "Open a folder. The panels for Node, Python, .NET, Rust, databases and GitHub are one key press away.",
		href: "/docs/tutorials",
		linkLabel: "Browse the tutorials",
	},
	{
		title: "Try a flow",
		text: "Build a small workflow, run it, and see what it did. About five minutes.",
		href: "/docs/first-flow",
		linkLabel: "Your first flow",
	},
];

// const FALLBACK_STATS = [
// 	{ value: "161", label: "Rust Commands" },
// 	{ value: "28MB", label: "RAM Usage" },
// 	{ value: "7", label: "LSP Languages" },
// 	{ value: "19", label: "Panels" },
// ];

// The downloads, stats and install methods come from the database. Without
// this the page is built once and keeps showing what existed at that moment,
// so a new release would not appear until the next deploy.
export const revalidate = 300;

const GITHUB_REPO = "https://github.com/mentenaz/mentenaz.Forge.Super";

const PLATFORM_LABEL: Record<string, string> = {
	windows: "Windows",
	"linux-deb": "Linux (.deb)",
	"linux-tarball": "Linux (.tar.gz)",
	macos: "macOS",
};

function formatStat(value: number): string {
	if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
	return String(value);
}

// The repository's star count, from GitHub. Fetched here on the server, so no
// visitor's browser contacts GitHub, and refreshed with the rest of the page.
// GITHUB_TOKEN is optional: without it GitHub allows 60 requests an hour per
// IP address, which a host shared with other sites can use up. Any failure
// returns null, which leaves the stat out instead of breaking the page.
async function getStars(): Promise<number | null> {
	const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
	if (process.env.GITHUB_TOKEN) {
		headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
	}
	try {
		const response = await fetch("https://api.github.com/repos/mentenaz/mentenaz.Forge.Super", {
			headers,
			next: { revalidate },
		});
		if (!response.ok) return null;
		const repository = (await response.json()) as { stargazers_count?: number };
		return typeof repository.stargazers_count === "number" ? repository.stargazers_count : null;
	} catch {
		return null;
	}
}

export default async function Home() {
	const [extensionCount, releaseCount, releaseResult, methodsResult, stars] = await Promise.all([
		supabase
			.from("registry_extensions")
			.select("id", { count: "exact", head: true })
			.eq("is_latest", true),
		supabase
			.from("releases")
			.select("id", { count: "exact", head: true })
			.eq("product", "forge-super"),
		supabase
			.from("releases")
			.select("version, release_date, release_assets(platform, filename, download_url)")
			.eq("product", "forge-super")
			.eq("is_latest", true)
			.maybeSingle(),
		supabase
			.from("install_methods")
			.select("platform, label, command, note, sort_order")
			.eq("product", "forge-super")
			.order("sort_order"),
		getStars(),
	]);

	// A count of zero would read as a mistake (no release has been recorded
	// yet, or the query failed), so those stats are left out until they have a
	// real number.
	const stats = [
		{ value: formatStat(extensionCount.count ?? 0), label: "Extensions", show: (extensionCount.count ?? 0) > 0 },
		{ value: formatStat(releaseCount.count ?? 0), label: "Releases", show: (releaseCount.count ?? 0) > 0 },
		{ value: formatStat(stars ?? 0), label: "GitHub stars", show: (stars ?? 0) > 0 },
		{ value: "2", label: "Platforms", show: true },
		{ value: "0", label: "Accounts needed", show: true },
	].filter((s) => s.show);

	const latest = (releaseResult.data as LatestRelease | null) ?? null;
	const methods = (methodsResult.data as InstallMethod[]) ?? [];

	// Direct downloads of the newest Forge Super release. Until one has been
	// recorded, everything points at the GitHub releases page.
	const downloads = (latest?.release_assets ?? []).map((a) => ({
		icon: (
			<ForgeIcon
				src="/icons/Forge_Cockpit.png"
				alt={PLATFORM_LABEL[a.platform] ?? a.platform}
				width={48}
				height={48}
			/>
		),
		platform: PLATFORM_LABEL[a.platform] ?? a.platform,
		filename: a.filename,
		url: a.download_url,
	}));
	// Only the chips that have a value; an empty one is left out, not shown blank.
	const heroChipList = [heroChips.memory, heroChips.startup, heroChips.accounts].filter(
		(chip): chip is string => Boolean(chip),
	);
	const windowsDownload = downloads.find((d) => d.platform === "Windows");
	const heroDownloadUrl = windowsDownload?.url ?? `${GITHUB_REPO}/releases/latest`;
	const methodsByPlatform = {
		windows: methods.filter((m) => m.platform === "windows"),
		linux: methods.filter((m) => m.platform === "linux"),
	};

	return (
		<div className={styles.page}>
			<Navbar />

			{/* ── Hero ─────────────────────────────────────── */}
			<section className={styles.hero}>
				<div className={styles.heroOrb} aria-hidden="true" />
				<div className={styles.heroInner}>
					<div className={styles.heroContent}>
						<h1 className={styles.heroTitle}>The Developer Cockpit</h1>
						<p className={styles.heroSubtitle}>
							Database, GitHub, runtimes and processes. One native window, one
							keypress away.
						</p>
						<div className={styles.heroCtas}>
							<a
								className={styles.btnPrimary}
								href={heroDownloadUrl}
							>
								Download for Windows
							</a>
							<a
								className={styles.btnSecondary}
								href={GITHUB_REPO}
								target="_blank"
								rel="noopener noreferrer"
							>
								View on GitHub
							</a>
						</div>
						<p className={styles.heroPlatforms}>
							Also available for Debian, Ubuntu and Kali Linux.
						</p>
						<p className={styles.heroTrust}>No account. Your AI, if you want it.</p>
						{heroChipList.length > 0 && (
							<>
								<ul className={styles.heroChips} aria-label="Highlights">
									{heroChipList.map((chip) => (
										<li key={chip} className={styles.heroChip}>
											{chip}
										</li>
									))}
								</ul>
								{heroChips.memory && (
									<p className={styles.heroChipsNote}>{heroChipsNote}</p>
								)}
							</>
						)}
					</div>
					<HeroMedia />
					<div className={styles.heroEngines}>
						<p className={styles.heroEnginesLabel}>Works with</p>
						<ul className={styles.heroEngineList}>
							{heroEngines.map((engine) => (
								<li key={engine}>{engine}</li>
							))}
						</ul>
					</div>
				</div>
			</section>

			{/* ── Getting started ──────────────────────────── */}
			<section id="get-started" className="section">
				<div className="container">
					<h2 className="section-title">Getting Started</h2>
					<p className="section-subtitle">
						From download to your first result in a few minutes.
					</p>
					<ol className={styles.steps}>
						{GETTING_STARTED.map((step, index) => (
							<li key={step.title} className={styles.step}>
								<span className={styles.stepNumber} aria-hidden="true">
									{index + 1}
								</span>
								<h3 className={styles.stepTitle}>{step.title}</h3>
								<p className={styles.stepText}>{step.text}</p>
								<Link href={step.href} className={styles.stepLink}>
									{step.linkLabel} &rarr;
								</Link>
							</li>
						))}
					</ol>
					<p className={styles.stepsNote}>
						No account, no sign-in and no usage data:{" "}
						<Link href="/docs/privacy">see what it contacts</Link>. Built on
						Zed: <Link href="/docs/different-from-zed">see what is different</Link>.
					</p>
				</div>
			</section>

			{/* ── Features ─────────────────────────────────── */}
			<section id="features" className="section">
				<div className="container">
					<h2 className="section-title">Everything You Need</h2>
					<p className="section-subtitle">
						One app. No bloat. Every tool a developer needs.
					</p>
					<div className={styles.featureGrid}>
						{FEATURES.map((f) => (
							<FeatureCard
								key={f.title}
								icon={f.icon}
								title={f.title}
								description={f.description}
							/>
						))}
					</div>
				</div>
			</section>

			{/* ── Stats Bar ────────────────────────────────── */}
			<section className={styles.statsBar}>
				<div className={styles.statsInner}>
					{stats.map((s) => (
						<StatCard key={s.label} value={s.value} label={s.label} />
					))}
				</div>
			</section>

			{/* ── Downloads ────────────────────────────────── */}
			<section id="download" className="section">
				<div className="container">
					<h2 className="section-title">Download Forge Super</h2>
					<p className="section-subtitle">
						Free. Available for Windows and Linux.
					</p>
					{downloads.length > 0 && (
						<div className={styles.downloadRow}>
							{downloads.map((d) => (
								<DownloadButton
									key={d.filename}
									icon={d.icon}
									platform={d.platform}
									filename={d.filename}
									href={d.url}
								/>
							))}
						</div>
					)}
					{(["linux", "windows"] as const).map((platform) =>
						methodsByPlatform[platform].length > 0 ? (
							<div key={platform} className={styles.methods}>
								<h3 className={styles.methodsTitle}>
									{platform === "linux" ? "Linux" : "Windows"}
								</h3>
								{methodsByPlatform[platform].map((m) => (
									<div key={m.command} className={styles.method}>
										<span className={styles.methodLabel}>{m.label}</span>
										<pre className={styles.methodCommand}>
											<code>{m.command}</code>
										</pre>
										{m.note && <span className={styles.methodNote}>{m.note}</span>}
									</div>
								))}
							</div>
						) : null,
					)}
					<p className={styles.versionNote}>
						{latest
							? `${latest.version} · Released ${new Date(latest.release_date).toLocaleDateString("en-GB", { year: "numeric", month: "long", timeZone: "UTC" })}`
							: "See the releases page for the latest version."}
						{" · "}
						<Link href="/docs/releases">Release notes</Link>
						{" · "}
						<Link href="/legacy">Previous version (Forge, Tauri)</Link>
					</p>
				</div>
			</section>

			{/* ── Footer ───────────────────────────────────── */}
			<Footer />
		</div>
	);
}
