import FeatureCard, { ForgeIcon } from "@/components/FeatureCard";
import StatCard from "@/components/StatCard";
import DownloadButton from "@/components/DownloadButton";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import type { SiteStat, ReleaseAsset } from "@/types/database";
import styles from "./page.module.css";

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
		title: "GitHub Desktop",
		description:
			"Clone, create PRs, manage repos, track issues, view deployments — all without leaving Forge.",
	},
	{
		icon: <ForgeIcon src="/icons/AITwin.png" alt="AI Twin assistant" width={40} height={40} />,
		title: "AI Twin",
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

const FALLBACK_STATS = [
	{ value: "161", label: "Rust Commands" },
	{ value: "28MB", label: "RAM Usage" },
	{ value: "7", label: "LSP Languages" },
	{ value: "19", label: "Panels" },
];

const FALLBACK_DOWNLOADS = [
	{ platform: "Windows", filename: "Mentenaz.Forge_x64-setup.exe" },
	{ platform: "Linux (Debian/Ubuntu)", filename: "mentenaz-forge_0.1.0_amd64.deb" },
	{ platform: "Linux (Universal)", filename: "Mentenaz.Forge.AppImage" },
];

function formatStat(value: number): string {
	if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
	return String(value);
}

export default async function Home() {
	const [statsResult, assetsResult] = await Promise.all([
		supabase.from("site_stats").select("key, value"),
		supabase
			.from("release_assets")
			.select("platform, filename, download_url")
			.order("created_at", { ascending: false }),
	]);

	const statsRows = (statsResult.data as SiteStat[]) ?? [];
	const statsMap = Object.fromEntries(statsRows.map((s) => [s.key, s.value]));

	const stats = [
		{ value: formatStat(statsMap["total_extensions"] ?? 0), label: "Extensions" },
		{ value: "28MB", label: "RAM Usage" },
		{ value: "7", label: "LSP Languages" },
		{ value: formatStat(statsMap["total_releases"] ?? 1), label: "Releases" },
	];

	const assets = (assetsResult.data as ReleaseAsset[]) ?? [];

	const platformIcon: Record<string, string> = {
		windows: "/icons/Forge_Cockpit.png",
		"linux-deb": "/icons/Forge_Cockpit.png",
		"linux-appimage": "/icons/Forge_Cockpit.png",
		"linux-rpm": "/icons/Forge_Cockpit.png",
		macos: "/icons/Forge_Cockpit.png",
	};

	const platformLabel: Record<string, string> = {
		windows: "Windows",
		"linux-deb": "Linux (Debian/Ubuntu)",
		"linux-appimage": "Linux (AppImage)",
		"linux-rpm": "Linux (RPM)",
		macos: "macOS",
	};

	const downloads = assets.length > 0
		? assets.map((a) => ({
				icon: <ForgeIcon src={platformIcon[a.platform] ?? "/icons/Forge_Cockpit.png"} alt={platformLabel[a.platform] ?? a.platform} width={48} height={48} />,
				platform: platformLabel[a.platform] ?? a.platform,
				filename: a.filename,
				url: a.download_url,
			}))
		: FALLBACK_DOWNLOADS.map((d) => ({
				icon: <ForgeIcon src="/icons/Forge_Cockpit.png" alt={d.platform} width={48} height={48} />,
				platform: d.platform,
				filename: d.filename,
				url: `https://github.com/mentenaz/forge-landing-page/releases/latest/download/${d.filename}`,
			}));

	return (
		<div className={styles.page}>
			<Navbar />

			{/* ── Hero ─────────────────────────────────────── */}
			<section className={styles.hero}>
				<div className={styles.heroOrb} aria-hidden="true" />
				<div className={styles.heroContent}>
					<h1 className={styles.heroTitle}>The Developer Cockpit</h1>
					<p className={styles.heroSubtitle}>
						System monitoring, multi-engine editor, LSP, Git/GitHub,
						databases, terminal, AI assistant, and task automation —
						all in ~28MB RAM.
					</p>
					<div className={styles.heroCtas}>
						<a
							className={styles.btnPrimary}
							href={downloads[0]?.url ?? "#"}
							download
						>
							Download for Windows
						</a>
						<a
							className={styles.btnSecondary}
							href="https://github.com/mentenaz/forge-landing-page"
							target="_blank"
							rel="noopener noreferrer"
						>
							View on GitHub
						</a>
					</div>
					<p className={styles.heroPlatforms}>
						Also available: Linux (.deb, .rpm, .AppImage) · macOS
						(coming soon)
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
					<h2 className="section-title">Download Forge</h2>
					<p className="section-subtitle">
						Free. Available for Windows and Linux.
					</p>
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
					<p className={styles.versionNote}>
						v0.1.0 · Released July 2026
					</p>
				</div>
			</section>

			{/* ── Footer ───────────────────────────────────── */}
			<Footer />
		</div>
	);
}
