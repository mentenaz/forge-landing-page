import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocMarkdown from "@/components/DocMarkdown";
import DocMedia from "@/components/DocMedia";
import { docPages, findDoc, readDocBody } from "@/lib/docs";
import { getDocMedia } from "@/lib/docMedia";
import { splitSections } from "@/lib/docSteps";
import styles from "../page.module.css";

type Params = { slug: string };

// Media is added without a deploy, so the page is rebuilt now and then to pick
// it up (see src/lib/docMedia.ts).
export const revalidate = 300;

export function generateStaticParams(): Params[] {
	return docPages.map((page) => ({ slug: page.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
	params,
}: {
	params: Promise<Params>;
}): Promise<Metadata> {
	const page = findDoc((await params).slug);
	return page ? { title: page.title, description: page.description } : {};
}

export default async function DocPage({ params }: { params: Promise<Params> }) {
	const page = findDoc((await params).slug);
	if (!page) notFound();

	const [body, media] = await Promise.all([readDocBody(page.slug), getDocMedia(page.slug)]);
	// A page with no media is rendered whole, so Markdown that refers across
	// sections (reference links, footnotes) keeps working.
	const sections = media.size > 0 ? splitSections(body) : null;

	return (
		<div className={styles.page}>
			<Navbar />
			<main className={styles.main}>
				<Link href="/docs" className={styles.back}>
					&larr; Docs
				</Link>
				<h1 className={styles.heading}>{page.title}</h1>
				<div className={styles.prose}>
					{sections ? (
						sections.map((section, index) => (
							<Fragment key={index}>
								<DocMarkdown>{section.markdown}</DocMarkdown>
								{section.step !== null && <DocMedia items={media.get(section.step) ?? []} />}
							</Fragment>
						))
					) : (
						<DocMarkdown>{body}</DocMarkdown>
					)}
				</div>
			</main>
			<Footer />
		</div>
	);
}
