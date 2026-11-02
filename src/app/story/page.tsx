import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
	title: "Our story",
	description:
		"Where Mentenaz Forge came from, where Forge Super is today, and where it is going.",
};

type Chapter = {
	label: string;
	status: "past" | "now" | "next";
	title: string;
	body: React.ReactNode[];
	points?: string[];
};

const CHAPTERS: Chapter[] = [
	{
		label: "Where we came from",
		status: "past",
		title: "Forge, the first cockpit",
		body: [
			"Forge was built because one developer needed a single place for the work of a day: managing GitHub, working with databases without reaching for pgAdmin or SQL Server Management Studio, running npm and Node from the terminal, and building C# and .NET solutions without being sent back to Visual Studio.",
			"When something is lagging, you should not have to open the Task Manager to find out why or to kill the process, so the cockpit shows what is running and lets you act on it. Multi-step work, such as starting several things in order and waiting for their ports, became Task Chains.",
			"The name is the idea: a blacksmith cannot do his work without all his tools in one place. Let's forge something great. It was built with Tauri, begun in June 2026 and first released on 31 July 2026.",
		],
		points: [
			"Cockpit: live system metrics and a process manager that can kill what is stuck",
			"Database workbench for SQL Server, MySQL, PostgreSQL and SQLite",
			"Helm and Git ops: GitHub management in one place",
			"Node, Python and .NET panels, a terminal and a script runner",
			"Task Chains: parallel, multi-step workflows",
		],
	},
	{
		label: "Where we are",
		status: "now",
		title: "Forge Super, built on Zed",
		body: [
			<>
				Forge Super is a fork of <a href="https://zed.dev">Zed</a>, the open-source,
				GPU-accelerated code editor. We did not want to build a new editor from scratch
				when Zed already does that exceptionally well, and the credit for the editor is
				theirs. The Rust backend carried over, the interface was rebuilt on Zed&apos;s own
				GPUI framework, and then the cockpit moved into a fork of the editor itself.
			</>,
			"On top of it we ported the Forge panels natively, so they are part of the editor and not a second app next to it: the cockpit, database workbench, Helm, script runner, process monitor, task flows, and project panels for Node, .NET, Python and Rust with their package managers.",
			"Then we made it independent. Forge Super has no account and no sign-in. Its extension registry, package repository, documentation and release notes are ours. AI is bring-your-own: you connect the provider you choose, or none. Telemetry is off unless you turn it on.",
		],
		points: [
			"The editor Zed built, plus the Forge panels",
			"Its own extension registry and apt repository",
			"No account, and telemetry off by default",
			"Windows and Debian-based Linux",
		],
	},
	{
		label: "Where we are going",
		status: "next",
		title: "Forge Lite, on the same foundation",
		body: [
			"Next is Forge Lite: a lighter version of Forge built with Slint, running on the same backend as Forge Super. The aim is the same cockpit for people who want something smaller, without giving up what sits underneath it.",
			"Forge Lite is planned, not available yet. We would rather say that plainly than promise a date.",
		],
	},
];

export default function StoryPage() {
	return (
		<div className={styles.page}>
			<Navbar />
			<main className={styles.main}>
				<header className={styles.header}>
					<h1 className={styles.heading}>Our story</h1>
					<p className={styles.lede}>
						From a Tauri app, to a fork of one of the best editors there is, to
						what comes next.
					</p>
				</header>

				<ol className={styles.timeline}>
					{CHAPTERS.map((chapter) => (
						<li key={chapter.title} className={styles.chapter} data-status={chapter.status}>
							<span className={styles.marker} aria-hidden="true" />
							<span className={styles.label}>{chapter.label}</span>
							<h2 className={styles.title}>{chapter.title}</h2>
							{chapter.body.map((paragraph, index) => (
								<p key={index} className={styles.text}>
									{paragraph}
								</p>
							))}
							{chapter.points && (
								<ul className={styles.points}>
									{chapter.points.map((point) => (
										<li key={point}>{point}</li>
									))}
								</ul>
							)}
						</li>
					))}
				</ol>

				<p className={styles.closing}>
					Follow along on the <Link href="/docs/releases">release notes</Link>, read
					the <Link href="/docs">docs</Link> to get started, or look back at{" "}
					<Link href="/legacy">the previous version</Link>.
				</p>
			</main>
			<Footer />
		</div>
	);
}
