import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import RepoMarkdown from "@/components/RepoMarkdown";
import { displayAuthors, getCatalogEntry, getCatalogReadme, typeLabel } from "@/lib/registryCatalog";
import styles from "./page.module.css";

type Params = { id: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
	const entry = await getCatalogEntry((await params).id);
	if (!entry) return { title: "Extension not found" };
	return {
		title: entry.name,
		description: entry.description ?? `${entry.name}, an extension for Mentenaz Forge Super.`,
	};
}

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("en-GB", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "UTC",
	});
}

export default async function ExtensionDetailPage({ params }: { params: Promise<Params> }) {
	const { id } = await params;
	const [entry, readme] = await Promise.all([getCatalogEntry(id), getCatalogReadme(id)]);
	if (!entry) notFound();

	const labels = entry.provides
		.map((slug) => typeLabel(slug))
		.filter((label): label is string => label !== null);

	// Only link to a source repository that is a plain https address.
	const repository = entry.repository.startsWith("https://") ? entry.repository : null;
	const authors = displayAuthors(entry.authors);

	return (
		<div className={styles.page}>
			<Navbar />
			<main className={styles.main}>
				<Link href="/extensions" className={styles.back}>
					&larr; All extensions
				</Link>

				<h1 className={styles.title}>{entry.name}</h1>
				<p className={styles.meta}>
					v{entry.version}
					{authors.length > 0 && <> &middot; by {authors.join(", ")}</>}
					{" "}&middot; added {formatDate(entry.published_at)}
				</p>

				{entry.description && <p className={styles.description}>{entry.description}</p>}

				{labels.length > 0 && (
					<div className={styles.badges}>
						{labels.map((label) => (
							<span key={label} className={styles.badge}>
								{label}
							</span>
						))}
					</div>
				)}

				<div className={styles.actions}>
					<a className={styles.primary} href={`forgesuper://extension/${encodeURIComponent(entry.id)}`}>
						Install in Forge Super
					</a>
					{repository && (
						<a className={styles.secondary} href={repository} target="_blank" rel="noopener noreferrer">
							View the source
						</a>
					)}
				</div>

				<section className={styles.howto}>
					<h2 className={styles.howtoTitle}>How to install</h2>
					<p>
						With Forge Super installed, the button above opens the app on this extension, where you
						press <strong>Install</strong>. Nothing is installed until you do.
					</p>
					<p>
						You can also open the <strong>Extensions</strong> panel in the app and search for{" "}
						<code>{entry.name}</code>. The extension&apos;s id is <code>{entry.id}</code>.
					</p>
					<p className={styles.note}>
						Don&apos;t have Forge Super yet? <Link href="/#download">Download it here</Link>.
					</p>
				</section>

				{readme && (
					<section className={styles.readmeSection}>
						<h2 className={styles.readmeTitle}>README</h2>
						<p className={styles.readmeNote}>
							From the extension&apos;s repository, written by its authors and not by Mentenaz.
							{repository && (
								<>
									{" "}
									<a href={repository} target="_blank" rel="noopener noreferrer">
										See the source
									</a>
									.
								</>
							)}
						</p>
						<div className={styles.readme}>
							<RepoMarkdown rawBase={readme.rawBase} blobBase={readme.blobBase}>
								{readme.readme}
							</RepoMarkdown>
						</div>
					</section>
				)}
			</main>
			<Footer />
		</div>
	);
}
