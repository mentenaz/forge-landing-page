"use client";

import styles from "./page.module.css";

const versions = [
	{
		version: "v0.1.0 \u2014 July 2026",
		items: [
			{ text: "Full editor with 7-language LSP", done: true },
			{ text: "Multi-database workbench (SQLite, PostgreSQL, MySQL, MSSQL)", done: true },
			{ text: "GitHub desktop client", done: true },
			{ text: "AI Twin (Chat, Brainstorm, Code Assist, Fix It)", done: true },
			{ text: "GitOps with AI commit messages", done: true },
			{ text: "PTY terminal + Script Runner", done: true },
			{ text: "System monitor (Cockpit)", done: true },
			{ text: "Task Chain builder", done: true },
			{ text: "Process manager", done: true },
			{ text: "JSONL file logging", done: true },
			{ text: "Python environment picker", done: true },
		],
	},
	{
		version: "v0.2.0 \u2014 Coming Soon",
		items: [
			{ text: "Helm completion (PRs, Issues, CI, Security)", done: false },
			{ text: "Python venv creation + pip management", done: false },
			{ text: "roslyn-language-server for C#", done: false },
			{ text: "Command palette improvements", done: false },
		],
	},
	{
		version: "v0.3.0 \u2014 Planned",
		items: [
			{ text: "Extension Forge authoring window", done: false },
			{ text: "Extension marketplace", done: false },
			{ text: "Tier 1 schema-based extensions", done: false },
		],
	},
];

export default function WhatsNewPage() {
	return (
		<div className={styles.page}>
			<h1 className={styles.heading}>What&apos;s New</h1>

			<div className={styles.timeline}>
				{versions.map((v) => (
					<div key={v.version} className={styles.versionBlock}>
						<h2 className={styles.versionTitle}>{v.version}</h2>
						<ul className={styles.list}>
							{v.items.map((item) => (
								<li
									key={item.text}
									className={`${styles.item} ${item.done ? styles.done : styles.planned}`}
								>
									<span className={styles.icon}>
										{item.done ? "\u2705" : "\uD83D\uDD04"}
									</span>
									{item.text}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
}
