import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { featuresWithTutorials } from "@/lib/docs";
import styles from "../page.module.css";

export const metadata: Metadata = {
	title: "Tutorials",
	description: "Step-by-step tutorials for Mentenaz Forge Super, grouped by feature.",
};

export default function TutorialsPage() {
	const features = featuresWithTutorials();
	return (
		<div className={styles.page}>
			<Navbar />
			<main className={styles.main}>
				<nav className={styles.crumbs} aria-label="Breadcrumb">
					<Link href="/docs">Docs</Link>
					<span aria-hidden="true">&rsaquo;</span>
					<span>Tutorials</span>
				</nav>
				<h1 className={styles.heading}>Tutorials</h1>
				<p className={styles.lede}>
					Step-by-step guides, one task at a time. Pick a feature to see its tutorials.
				</p>
				<div className={styles.badges}>
					{features.map((feature) => (
						<Link key={feature.slug} href={`/docs/tutorials/${feature.slug}`} className={styles.badge}>
							{feature.title}
							<span className={styles.badgeCount}>{feature.count}</span>
						</Link>
					))}
				</div>
			</main>
			<Footer />
		</div>
	);
}
