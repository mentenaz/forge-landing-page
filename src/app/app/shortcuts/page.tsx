"use client";

import styles from "./page.module.css";

const groups = [
	{
		title: "General",
		shortcuts: [
			{ keys: ["Ctrl", "P"], desc: "File palette" },
			{ keys: ["Ctrl", "Shift", "P"], desc: "Command palette" },
			{ keys: ["Ctrl", "O"], desc: "Open file" },
			{ keys: ["Ctrl", "Shift", "E"], desc: "Open folder" },
			{ keys: ["Ctrl", "S"], desc: "Save" },
			{ keys: ["Ctrl", "Shift", "S"], desc: "Save all" },
			{ keys: ["Ctrl", "W"], desc: "Close tab" },
		],
	},
	{
		title: "Navigation",
		shortcuts: [
			{ keys: ["Ctrl", "B"], desc: "Toggle sidebar" },
			{ keys: ["Ctrl", "="], desc: "Zoom in" },
			{ keys: ["Ctrl", "-"], desc: "Zoom out" },
			{ keys: ["Ctrl", "0"], desc: "Reset zoom" },
			{ keys: ["Ctrl", "Shift", "K"], desc: "Toggle AI Overlay" },
			{ keys: ["Ctrl", "Shift", "F"], desc: "Focus mode" },
			{ keys: ["Ctrl", "/"], desc: "Shortcuts reference" },
		],
	},
	{
		title: "Run",
		shortcuts: [
			{ keys: ["F5"], desc: "Run script" },
			{ keys: ["Shift", "F5"], desc: "Stop script" },
			{ keys: ["Ctrl", "Shift", "F5"], desc: "Run task chain" },
		],
	},
	{
		title: "Panels",
		shortcuts: [
			{ keys: ["Ctrl", "1\u20136"], desc: "Navigate panels" },
		],
	},
];

export default function ShortcutsPage() {
	return (
		<div className={styles.page}>
			<h1 className={styles.heading}>Keyboard Shortcuts</h1>

			<div className={styles.grid}>
				{groups.map((g) => (
					<div key={g.title} className={styles.group}>
						<h2 className={styles.groupTitle}>{g.title}</h2>
						<div className={styles.rows}>
							{g.shortcuts.map((s) => (
								<div key={s.desc} className={styles.row}>
									<div className={styles.keys}>
										{s.keys.map((k) => (
											<kbd key={k} className={styles.kbd}>
												{k}
											</kbd>
										))}
									</div>
									<span className={styles.desc}>{s.desc}</span>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
