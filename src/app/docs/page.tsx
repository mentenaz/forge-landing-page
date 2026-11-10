import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { guidePages, tutorialPages } from "@/lib/docs";
import styles from "./page.module.css";

export const metadata: Metadata = {
	title: "Docs",
	description: "Install, update and troubleshoot Mentenaz Forge Super.",
};

export default function DocsPage() {
	const tutorialCount = tutorialPages().length;
	return (
		<div className={styles.page}>
			<Navbar />
			<main className={styles.main}>
				<h1 className={styles.heading}>Docs</h1>
				<p className={styles.lede}>
					How to install, update and troubleshoot Mentenaz Forge Super, and step-by-step tutorials.
				</p>
				<div className={styles.cards}>
					{guidePages().map((page) => (
						<Link key={page.slug} href={`/docs/${page.slug}`} className={styles.card}>
							<span className={styles.cardTitle}>{page.title}</span>
							<span className={styles.cardText}>{page.description}</span>
						</Link>
					))}
					{tutorialCount > 0 && (
						<Link href="/docs/tutorials" className={styles.card}>
							<span className={styles.cardTitle}>Tutorials</span>
							<span className={styles.cardText}>
								Step-by-step guides for each feature, one at a time.
							</span>
						</Link>
					)}
					<Link href="/docs/releases" className={styles.card}>
						<span className={styles.cardTitle}>Releases</span>
						<span className={styles.cardText}>
							What changed in each version, straight from the GitHub releases.
						</span>
					</Link>
				</div>
			</main>
			<Footer />
		</div>
	);
}
