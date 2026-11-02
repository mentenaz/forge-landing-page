import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { docPages, findDoc, readDocBody } from "@/lib/docs";
import styles from "../page.module.css";

type Params = { slug: string };

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

	const body = await readDocBody(page.slug);

	return (
		<div className={styles.page}>
			<Navbar />
			<main className={styles.main}>
				<Link href="/docs" className={styles.back}>
					&larr; Docs
				</Link>
				<h1 className={styles.heading}>{page.title}</h1>
				<div className={styles.prose}>
					<ReactMarkdown>{body}</ReactMarkdown>
				</div>
			</main>
			<Footer />
		</div>
	);
}
