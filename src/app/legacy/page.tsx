import Link from "next/link";
import type { Metadata } from "next";
import FeatureCard, { ForgeIcon } from "@/components/FeatureCard";
import StatCard from "@/components/StatCard";
import DownloadButton from "@/components/DownloadButton";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import type { SiteStat, LatestRelease } from "@/types/database";
import styles from "../page.module.css";

export const metadata: Metadata = {
	title: "Forge (previous version)",
	description:
		"The original Mentenaz Forge, built with Tauri: its features, downloads and AI pages.",
};

// The downloads, stats and install methods come from the database. Without
// this the page is built once and keeps showing what existed at that moment,
// so a new release would not appear until the next deploy.
export const revalidate = 300;

// What the original (Tauri) Forge said about itself, kept here as it was.
const FEATURES = [
	{
		icon: <ForgeIcon src="/icons/Code.png" alt="Code editor" width={40} height={21} />,
		title: "Multi-Engine Editor",
		description:
			"Monaco, CodeMirror, or Minimal. Syntax highlighting for 80+ languages with full LSP integration.",
	},
	{
		icon: <ForgeIcon src="/icons/ProblemsNBG.png" alt="LSP diagnostics" width={40} height={36} />,
		title: "7-Language LSP",
		description:
			"TypeScript, C#, Rust, Python, Deno, and more. Hover, autocomplete, go-to-definition, and diagnostics.",
	},
	{
		icon: <ForgeIcon src="/icons/SQLWorkBenchNDG.png" alt="Database workbench" width={40} height={35} />,
		title: "Database Workbench",
		description:
			"SQLite, PostgreSQL, MySQL, and MSSQL. Query editor, schema graph, and export tools.",
	},
	{
		icon: <ForgeIcon src="/icons/GitOps_NBG.png" alt="Git operations" width={40} height={40} />,
		title: "Mentenaz Helm",
		description:
			"Clone, create PRs, manage repos, track issues, view deployments — all without leaving Forge.",
	},
	{
		icon: <ForgeIcon src="/icons/AITwin.png" alt="AI Twin assistant" width={40} height={40} />,
		title: "Mentenaz AI",
		description:
			"Personal AI assistant powered by 5 providers. Chat, brainstorm, code assist, and AI-powered error fixing.",
	},
	{
		icon: <ForgeIcon src="/icons/Forge_Cockpit.png" alt="System monitor cockpit" width={40} height={40} />,
		title: "System Monitor",
		description:
			"Real-time CPU, RAM, disk, and network metrics with per-process breakdowns.",
	},
	{
		icon: <ForgeIcon src="/icons/TaskRunner.png" alt="Task chain runner" width={40} height={29} />,
		title: "Task Chains",
		description:
			"Visual pipeline builder. Chain scripts, wait for ports, run migrations, and validate with AI.",
	},
	{
		icon: <ForgeIcon src="/icons/Terminal.png" alt="Terminal" width={27} height={40} />,
		title: "Terminal + Script Runner",
		description:
			"Full PTY terminal with xterm.js. Script runner with ANSI colors and real-time streaming.",
	},
];

const PLATFORM_LABEL: Record<string, string> = {
	windows: "Windows",
	"linux-deb": "Linux (Debian/Ubuntu)",
	"linux-appimage": "Linux (AppImage)",
	"linux-rpm": "Linux (RPM)",
	macos: "macOS",
};

const LEGACY_RELEASES = "https://github.com/mentenaz/forge-landing-page/releases";

function formatStat(value: number): string {
	if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
	return String(value);
}

export default async function LegacyPage() {
	const [statsResult, releaseCount, releaseResult] = await Promise.all([
		supabase.from("site_stats").select("key, value"),
		supabase
			.from("releases")
			.select("id", { count: "exact", head: true })
			.eq("product", "forge-legacy"),
		supabase
			.from("releases")
			.select("version, release_date, release_assets(platform, filename, download_url)")
			.eq("product", "forge-legacy")
			.order("release_date", { ascending: false })
			.limit(1)
			.maybeSingle(),
	]);

	const statsRows = (statsResult.data as SiteStat[]) ?? [];
	const statsMap = Object.fromEntries(statsRows.map((s) => [s.key, s.value]));

	const stats = [
		{ value: formatStat(statsMap["total_extensions"] ?? 0), label: "Extensions" },
		{ value: "28MB", label: "RAM Usage" },
		{ value: "7", label: "LSP Languages" },
		{ value: formatStat(releaseCount.count ?? 0), label: "Releases" },
	];

	const latest = (releaseResult.data as LatestRelease | null) ?? null;
	const downloads = (latest?.release_assets ?? []).map((a) => ({
		platform: PLATFORM_LABEL[a.platform] ?? a.platform,
		filename: a.filename,
		url: a.download_url,
	}));

	return (
		<div className={styles.page}>
			<Navbar />

			<section className={styles.hero}>
				<div className={styles.heroOrb} aria-hidden="true" />
				<div className={styles.heroContent}>
					<h1 className={styles.heroTitle}>Forge, the previous version</h1>
					<p className={styles.heroSubtitle}>
						System monitoring, multi-engine editor, LSP, Git/GitHub, databases, terminal,
						AI assistant, and task automation — all in ~28MB RAM.
					</p>
					<p className={styles.heroPlatforms}>
						This is the original Mentenaz Forge, built with Tauri. The current version is{" "}
						<Link href="/">Mentenaz Forge Super</Link>, and you can read{" "}
						<Link href="/story">how it got here</Link>.
					</p>
				</div>
			</section>

			<section className="section">
				<div className="container">
					<h2 className="section-title">What it does</h2>
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

			<section className={styles.statsBar}>
				<div className={styles.statsInner}>
					{stats.map((s) => (
						<StatCard key={s.label} value={s.value} label={s.label} />
					))}
				</div>
			</section>

			<section className="section">
				<div className="container">
					<h2 className="section-title">Download the previous version</h2>
					<p className="section-subtitle">Free. Windows and Linux.</p>
					{downloads.length > 0 ? (
						<div className={styles.downloadRow}>
							{downloads.map((d) => (
								<DownloadButton
									key={d.filename}
									icon={
										<ForgeIcon
											src="/icons/Forge_Cockpit.png"
											alt={d.platform}
											width={48}
											height={48}
										/>
									}
									platform={d.platform}
									filename={d.filename}
									href={d.url}
								/>
							))}
						</div>
					) : null}
					<p className={styles.versionNote}>
						{latest ? `${latest.version} · ` : ""}
						<a href={LEGACY_RELEASES}>All releases of the previous version</a>
					</p>
				</div>
			</section>

			<section className="section">
				<div className="container">
					<h2 className="section-title">Its AI</h2>
					<p className="section-subtitle">
						The hosted AI that came with the previous version.
					</p>
					<p className={styles.versionNote}>
						<Link href="/ai">Mentenaz AI</Link>
						{" · "}
						<Link href="/forge-ai">Forge AI</Link>
					</p>
				</div>
			</section>

			<Footer />
		</div>
	);
}
