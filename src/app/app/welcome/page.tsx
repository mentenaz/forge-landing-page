"use client";

import styles from "./page.module.css";

const features = [
	{
		icon: "\u26A1",
		title: "Multi-Engine Editor",
		desc: "Monaco, CodeMirror, or Minimal \u2014 your choice.",
	},
	{
		icon: "\uD83D\uDD0D",
		title: "7-Language LSP",
		desc: "TypeScript, C#, Rust, Python, Deno, and more.",
	},
	{
		icon: "\uD83E\uDD16",
		title: "AI Twin",
		desc: "Your personal AI coding assistant.",
	},
];

export default function WelcomePage() {
	return (
		<div className={styles.page}>
			<img
				src="/forge-logo.png"
				alt=""
				className={styles.logo}
				style={{ animation: "forgePulse 2s ease-in-out infinite" }}
			/>
			<h1 className={styles.title}>Welcome to Mentenaz Forge</h1>
			<p className={styles.subtitle}>Your all-in-one developer cockpit</p>

			<div className={styles.features}>
				{features.map((f) => (
					<div key={f.title} className={styles.feature}>
						<span className={styles.featureIcon}>{f.icon}</span>
						<div>
							<div className={styles.featureTitle}>{f.title}</div>
							<div className={styles.featureDesc}>{f.desc}</div>
						</div>
					</div>
				))}
			</div>

			<button
				className={styles.cta}
				onClick={() => {
					window.location.href = "/";
				}}
			>
				Get Started
			</button>
		</div>
	);
}
