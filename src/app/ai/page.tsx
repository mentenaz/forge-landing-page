import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
	title: "Mentenaz AI",
	description:
		"The intelligence layer behind Forge, Helm, and Twin. 5-provider fallback chain that's always on.",
};

const POWERS = [
	{
		title: "Forge AI",
		subtitle: "The developer cockpit's built-in assistant.",
		items: ["Fix It", "SQL suggestions", "AI commit messages", "Code review"],
	},
	{
		title: "Helm AI",
		subtitle: "GitHub intelligence for the Helm panel.",
		items: ["PR explain", "Release summaries", "Risk alerts", "Issue triage"],
	},
	{
		title: "Twin",
		subtitle: "Your personal AI coding companion.",
		items: ["Chat", "Brainstorm", "Code assist", "Persistent memory"],
	},
];

const STACK = [
	{ layer: "Inference", value: "5-provider fallback (Gemini → Groq → HuggingFace → Mistral → OpenRouter)" },
	{ layer: "Embeddings", value: "Voyage AI" },
	{ layer: "Vector search", value: "pgvector on Supabase" },
	{ layer: "Transport", value: "SSE streaming via Supabase Edge Functions" },
	{ layer: "Runtime", value: "Deno on Supabase" },
];

export default function AiPage() {
	return (
		<div className={styles.page}>
			<Navbar />

			{/* ── Hero ─────────────────────────────────────── */}
			<section className={styles.hero}>
				<div className={styles.heroOrb} aria-hidden="true" />
				<div className={styles.heroContent}>
					<span className={styles.badge}>⚡ Mentenaz AI</span>
					<h1 className={styles.heroTitle}>
						The intelligence layer behind Forge.
					</h1>
					<p className={styles.heroSubtitle}>
						Built on a 5-provider fallback chain — Gemini, Groq,
						HuggingFace, Mistral, OpenRouter. Always on. Never
						rate-limited.
					</p>
					<div className={styles.heroCtas}>
						<a className={styles.btnPrimary} href="/ai/chat">
							Try it →
						</a>
						<a className={styles.btnSecondary} href="/ai/docs">
							Read the docs →
						</a>
					</div>
				</div>
			</section>

			{/* ── What It Powers ───────────────────────────── */}
			<section className="section">
				<div className="container">
					<h2 className="section-title">What It Powers</h2>
					<div className={styles.cardRow}>
						{POWERS.map((card) => (
							<div key={card.title} className={styles.card}>
								<h3 className={styles.cardTitle}>{card.title}</h3>
								<p className={styles.cardSubtitle}>{card.subtitle}</p>
								<ul className={styles.cardList}>
									{card.items.map((item) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── The Stack ────────────────────────────────── */}
			<section className={styles.stackSection}>
				<div className="container">
					<h2 className="section-title">The Stack</h2>
					<table className={styles.table}>
						<tbody>
							{STACK.map((row) => (
								<tr key={row.layer}>
									<td className={styles.tableLabel}>{row.layer}</td>
									<td className={styles.tableValue}>{row.value}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* ── CTA ──────────────────────────────────────── */}
			<section className={styles.ctaSection}>
				<div className={styles.ctaInner}>
					<h2 className={styles.ctaTitle}>
						Ready to experience Mentenaz AI?
					</h2>
					<div className={styles.heroCtas}>
						<a className={styles.btnPrimary} href="/ai/chat">
							Try Web Chat →
						</a>
						<a className={styles.btnSecondary} href="/#download">
							Get Forge →
						</a>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
