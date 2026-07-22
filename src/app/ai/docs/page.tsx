import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./docs.module.css";

export const metadata: Metadata = {
	title: "Capabilities",
	description: "Mentenaz AI capabilities — Forge AI, Helm AI, and AI Twin. The intelligence layer behind every Mentenaz product.",
};

const forgeFeatures = [
	{ title: "Fix It", desc: "Reads the LSP error, generates a corrected file, and shows a diff you can accept." },
	{ title: "AI Commit Message", desc: "Summarises your staged diff into a conventional commit message." },
	{ title: "SQL Suggestions", desc: "Schema-aware query suggestions from your connected database." },
	{ title: "File Explain", desc: "Explains what a changed file does and why it changed." },
	{ title: "Risk Alerts", desc: "Flags dangerous changes (rm -rf, secret leaks, breaking imports) before you commit." },
	{ title: "Code Assist", desc: "Generates code from a natural language description in your editor." },
];

const helmFeatures = [
	{ title: "PR Explain", desc: "Summarises what a pull request does in plain English." },
	{ title: "Release Notes", desc: "Generates changelogs from commits between tags." },
	{ title: "Issue Triage", desc: "Suggests labels and priority for new issues." },
	{ title: "Repo Describe", desc: "Generates a repository description from the codebase." },
];

const twinFeatures = [
	{ title: "Chat", desc: "General conversation with workspace context. Ask questions about your code." },
	{ title: "Brainstorm", desc: "Structured ideation. Think through architecture decisions and design patterns." },
	{ title: "Code Assist", desc: "Code generation with open file context. The AI sees what you're working on." },
	{ title: "Insight", desc: "Proactive suggestions about your current file based on LSP diagnostics." },
];

const stackRows = [
	{ label: "Inference", value: "5-provider fallback (Gemini → Groq → HuggingFace → Mistral → OpenRouter)" },
	{ label: "Embeddings", value: "Voyage AI" },
	{ label: "Vector search", value: "pgvector on Supabase" },
	{ label: "Transport", value: "SSE streaming via Supabase Edge Functions" },
	{ label: "Runtime", value: "Deno on Supabase" },
];

export default function ForgeAIDocs() {
	return (
		<div className={styles.page}>
			<Navbar />

			<main className={styles.main}>
				<h1 className={styles.title}>Mentenaz AI — Capabilities</h1>
				<p className={styles.subtitle}>
					The intelligence layer behind Forge, Helm, and Twin.
				</p>

				{/* Forge AI */}
				<section className={styles.section}>
					<h2 className={styles.sectionHeading}>🔥 Forge AI</h2>
					<p className={styles.sectionDesc}>Inside the Forge desktop application.</p>
					<div className={styles.featureGrid}>
						{forgeFeatures.map((f) => (
							<div key={f.title} className={styles.featureCard}>
								<h3 className={styles.featureTitle}>{f.title}</h3>
								<p className={styles.featureDesc}>{f.desc}</p>
							</div>
						))}
					</div>
				</section>

				{/* Helm AI */}
				<section className={styles.section}>
					<h2 className={styles.sectionHeading}>🐙 Helm AI</h2>
					<p className={styles.sectionDesc}>GitHub intelligence inside the Helm panel.</p>
					<div className={styles.featureGrid}>
						{helmFeatures.map((f) => (
							<div key={f.title} className={styles.featureCard}>
								<h3 className={styles.featureTitle}>{f.title}</h3>
								<p className={styles.featureDesc}>{f.desc}</p>
							</div>
						))}
					</div>
				</section>

				{/* AI Twin */}
				<section className={styles.section}>
					<h2 className={styles.sectionHeading}>🤖 AI Twin</h2>
					<p className={styles.sectionDesc}>The conversational AI inside Forge.</p>
					<div className={styles.featureGrid}>
						{twinFeatures.map((f) => (
							<div key={f.title} className={styles.featureCard}>
								<h3 className={styles.featureTitle}>{f.title}</h3>
								<p className={styles.featureDesc}>{f.desc}</p>
							</div>
						))}
					</div>
				</section>

				{/* The Stack */}
				<section className={styles.stackSection}>
					<h2 className={styles.sectionHeading}>⚙ The Stack</h2>
					<div className={styles.tableWrap}>
						<table className={styles.table}>
							<thead>
								<tr>
									<th className={styles.th}>Layer</th>
									<th className={styles.th}>Technology</th>
								</tr>
							</thead>
							<tbody>
								{stackRows.map((r) => (
									<tr key={r.label} className={styles.tr}>
										<td className={styles.tdLabel}>{r.label}</td>
										<td className={styles.tdValue}>{r.value}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>

				{/* CTA */}
				<div className={styles.ctaRow}>
					<Link href="/ai/chat" className={styles.ctaPrimary}>
						Try Web Chat →
					</Link>
					<Link href="/#download" className={styles.ctaSecondary}>
						Get Forge →
					</Link>
				</div>
			</main>

			<Footer />
		</div>
	);
}
