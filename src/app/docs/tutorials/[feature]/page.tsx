import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { featuresWithTutorials, findFeature, tutorialsFor } from "@/lib/docs";
import styles from "../../page.module.css";

type Params = { feature: string };

export function generateStaticParams(): Params[] {
	return featuresWithTutorials().map((feature) => ({ feature: feature.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
	params,
}: {
	params: Promise<Params>;
}): Promise<Metadata> {
	const feature = findFeature((await params).feature);
	return feature
		? { title: `${feature.title} tutorials`, description: feature.description }
		: {};
}

export default async function FeatureTutorialsPage({ params }: { params: Promise<Params> }) {
	const feature = findFeature((await params).feature);
	const tutorials = feature ? tutorialsFor(feature.slug) : [];
	if (!feature || tutorials.length === 0) notFound();

	return (
		<div className={styles.page}>
			<Navbar />
			<main className={styles.main}>
				<nav className={styles.crumbs} aria-label="Breadcrumb">
					<Link href="/docs">Docs</Link>
					<span aria-hidden="true">&rsaquo;</span>
					<Link href="/docs/tutorials">Tutorials</Link>
					<span aria-hidden="true">&rsaquo;</span>
					<span>{feature.title}</span>
				</nav>
				<h1 className={styles.heading}>{feature.title}</h1>
				<p className={styles.lede}>{feature.description}</p>
				<div className={styles.cards}>
					{tutorials.map((tutorial) => (
						<Link key={tutorial.slug} href={`/docs/${tutorial.slug}`} className={styles.card}>
							<span className={styles.cardTitle}>{tutorial.title}</span>
							<span className={styles.cardText}>{tutorial.description}</span>
							{tutorial.minutes && (
								<span className={styles.cardMeta}>About {tutorial.minutes} minutes</span>
							)}
						</Link>
					))}
				</div>
			</main>
			<Footer />
		</div>
	);
}
