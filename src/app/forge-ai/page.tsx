import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
	title: "Forge AI — Meet Your AI Twin",
	description: "A personal AI assistant that knows your codebase, your style, and your workflow. Powered by 5 providers with automatic fallback.",
};

const modes = [
	{
		icon: <img src="/icons/AITwin.png" alt="" />,
		title: "Chat",
		desc: "Natural conversation about your code. Ask questions, get explanations, brainstorm solutions.",
	},
	{
		icon: <img src="/icons/AITwin.png" alt="" />,
		title: "Brainstorm",
		desc: "Structured ideation sessions. Think through architecture decisions and design patterns with AI.",
	},
	{
		icon: <img src="/icons/Code.png" alt="" />,
		title: "Code Assist",
		desc: "Context-aware code suggestions. The AI sees your open files, LSP diagnostics, and git status.",
	},
];

const providers = ["Gemini", "Groq", "HuggingFace", "Mistral", "OpenRouter"];

const features = [
	{
		icon: <img src="/icons/SettingsGear.png" alt="" />,
		title: "Local Context",
		desc: "AI only sees what you share. Your code stays on your machine.",
	},
	{
		icon: <img src="/icons/Forge_Cockpit.png" alt="" />,
		title: "Usage Tracking",
		desc: "Monitor token usage across sessions. Know where your tokens go.",
	},
	{
		icon: <img src="/icons/Successimg.png" alt="" />,
		title: "Fix It Mode",
		desc: "Select an error, and AI Twin gathers context to suggest a fix.",
	},
	{
		icon: <img src="/icons/ProblemsNBG.png" alt="" />,
		title: "Context-Aware",
		desc: "Builds context from your editor, git status, LSP diagnostics, and scripts.",
	},
	{
		icon: <img src="/icons/AITwin.png" alt="" />,
		title: "Persistent Memory",
		desc: "Conversations and decisions saved to Supabase for future reference.",
	},
	{
		icon: <img src="/icons/Terminal.png" alt="" />,
		title: "Streaming Responses",
		desc: "Real-time token-by-token streaming. See the AI think.",
	},
];

export default function ForgeAIPage() {
	return (
		<div className={styles.page}>
			<Navbar />

			{/* Hero */}
			<section className={styles.hero}>
				<div className={styles.heroOrb} />
				<h1 className={styles.heroTitle}>Meet Your AI Twin</h1>
				<p className={styles.heroSubtitle}>
					A personal AI assistant that knows your codebase, your style, and your
					workflow.
				</p>
				<Link href="/#download" className={styles.heroCta}>
					Try Forge
				</Link>
			</section>

			{/* Modes Grid */}
			<section className={styles.section}>
				<div className={styles.container}>
					<h2 className={styles.sectionTitle}>Three Modes, One Assistant</h2>
					<div className={styles.modesGrid}>
						{modes.map((m) => (
							<div key={m.title} className={styles.modeCard}>
								<span className={styles.modeIcon}>{m.icon}</span>
								<h3 className={styles.modeTitle}>{m.title}</h3>
								<p className={styles.modeDesc}>{m.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Providers */}
			<section className={styles.sectionAlt}>
				<div className={styles.container}>
					<h2 className={styles.sectionTitle}>
						Powered by 5 AI Providers
					</h2>
					<p className={styles.sectionSubtitle}>
						Automatic fallback ensures you&apos;re never down.
					</p>
					<div className={styles.providersRow}>
						{providers.map((p) => (
							<div key={p} className={styles.providerCard}>
								{p}
							</div>
						))}
					</div>
					<div className={styles.fallbackChain}>
						<code className={styles.fallbackCode}>
							{"Gemini \u2192 Groq \u2192 HuggingFace \u2192 Mistral \u2192 OpenRouter"}
						</code>
					</div>
				</div>
			</section>

			{/* Features List */}
			<section className={styles.section}>
				<div className={styles.container}>
					<div className={styles.featuresGrid}>
						{features.map((f) => (
							<div key={f.title} className={styles.featureItem}>
								<span className={styles.featureIcon}>{f.icon}</span>
								<div>
									<h3 className={styles.featureTitle}>{f.title}</h3>
									<p className={styles.featureDesc}>{f.desc}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className={styles.ctaSection}>
				<h2 className={styles.ctaTitle}>Ready to meet your AI Twin?</h2>
				<Link href="/#download" className={styles.ctaButton}>
					Download Forge
				</Link>
				<p className={styles.ctaNote}>Free and open source.</p>
			</section>

			<Footer />
		</div>
	);
}
