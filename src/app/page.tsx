import Link from "next/link";
import FeatureCard, { ForgeIcon } from "@/components/FeatureCard";
import StatCard from "@/components/StatCard";
import DownloadButton from "@/components/DownloadButton";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import type { SiteStat, InstallMethod, LatestRelease } from "@/types/database";
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

// const FALLBACK_STATS = [
// 	{ value: "161", label: "Rust Commands" },
// 	{ value: "28MB", label: "RAM Usage" },
// 	{ value: "7", label: "LSP Languages" },
// 	{ value: "19", label: "Panels" },
// ];

const GITHUB_REPO = "https://github.com/mentenaz/mentenaz.Forge.Super";
const LEGACY_RELEASES = "https://github.com/mentenaz/forge-landing-page/releases";

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

export default async function Home() {
	const [statsResult, releaseResult, methodsResult] = await Promise.all([
		supabase.from("site_stats").select("key, value"),
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
	]);

	const statsRows = (statsResult.data as SiteStat[]) ?? [];
	const statsMap = Object.fromEntries(statsRows.map((s) => [s.key, s.value]));

	const stats = [
		{ value: formatStat(statsMap["total_extensions"] ?? 0), label: "Extensions" },
		{ value: "28MB", label: "RAM Usage" },
		{ value: "7", label: "LSP Languages" },
		{ value: formatStat(statsMap["total_releases"] ?? 1), label: "Releases" },
	];

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
						<a href={LEGACY_RELEASES}>Previous version (Forge, Tauri)</a>
					</p>
				</div>
			</section>

			{/* ── Footer ───────────────────────────────────── */}
			<Footer />
		</div>
	);
}
