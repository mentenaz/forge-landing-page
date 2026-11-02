import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { docPages } from "@/lib/docs";
import styles from "./page.module.css";

export const metadata: Metadata = {
	title: "Docs",
	description: "Install, update and troubleshoot Mentenaz Forge Super.",
};

export default function DocsPage() {
	return (
		<div className={styles.page}>
			<Navbar />
			<main className={styles.main}>
				<h1 className={styles.heading}>Docs</h1>
				<p className={styles.lede}>
					How to install, update and troubleshoot Mentenaz Forge Super.
				</p>
				<div className={styles.cards}>
					{docPages.map((page) => (
						<Link key={page.slug} href={`/docs/${page.slug}`} className={styles.card}>
							<span className={styles.cardTitle}>{page.title}</span>
							<span className={styles.cardText}>{page.description}</span>
						</Link>
					))}
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
