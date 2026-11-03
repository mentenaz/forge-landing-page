import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
	EXTENSION_TYPES,
	PAGE_SIZE,
	displayAuthors,
	getCatalogCounts,
	isExtensionType,
	searchCatalog,
	typeLabel,
	type CatalogSort,
	type ExtensionTypeSlug,
} from "@/lib/registryCatalog";
import styles from "./page.module.css";

export const metadata: Metadata = {
	title: "Extensions",
	description:
		"Browse the extensions you can install in Mentenaz Forge Super: themes, languages, language servers, MCP servers and more.",
};

type SearchParams = { q?: string; type?: string; sort?: string; page?: string };

function formatCount(n: number): string {
	return n.toLocaleString("en-US");
}

// A link back to this page with some of the current choices changed. Defaults
// (no search, all types, A to Z, page 1) are left out so the URLs stay short.
function pageHref(state: {
	q: string;
	type: ExtensionTypeSlug | null;
	sort: CatalogSort;
	page: number;
}): string {
	const params = new URLSearchParams();
	if (state.q) params.set("q", state.q);
	if (state.type) params.set("type", state.type);
	if (state.sort !== "name") params.set("sort", state.sort);
	if (state.page > 1) params.set("page", String(state.page));
	const query = params.toString();
	return query ? `/extensions?${query}` : "/extensions";
}

export default async function ExtensionsPage({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const raw = await searchParams;

	const q = (raw.q ?? "").slice(0, 80);
	const type = isExtensionType(raw.type) ? raw.type : null;
	const sort: CatalogSort = raw.sort === "new" ? "new" : "name";
	const requestedPage = Number.parseInt(raw.page ?? "1", 10);
	const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

	const [counts, result] = await Promise.all([
		getCatalogCounts(),
		searchCatalog({ q, type, sort, page }),
	]);

	const pageCount = Math.max(1, Math.ceil(result.total / PAGE_SIZE));
	const firstShown = result.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
	const lastShown = Math.min(page * PAGE_SIZE, result.total);
	const state = { q, type, sort };

	return (
		<div className={styles.page}>
			<Navbar />

			<section className={styles.hero}>
				<h1 className={styles.heroTitle}>Extensions</h1>
				<p className={styles.heroSubtitle}>
					{counts.total > 0 ? (
						<>
							<strong>{formatCount(counts.total)}</strong> extensions for Forge Super: themes,
							languages, language servers and more. This is the same catalogue the app installs from.
						</>
					) : (
						"Themes, languages, language servers and more. This is the same catalogue the app installs from."
					)}
				</p>
			</section>

			<section className={styles.content}>
				<div className={styles.container}>
					<form className={styles.searchRow} action="/extensions" method="get" role="search">
						<input
							className={styles.searchInput}
							type="search"
							name="q"
							defaultValue={q}
							placeholder="Search by name or description"
							aria-label="Search extensions"
						/>
						{type && <input type="hidden" name="type" value={type} />}
						<select className={styles.sortSelect} name="sort" defaultValue={sort} aria-label="Sort by">
							<option value="name">A to Z</option>
							<option value="new">Recently added</option>
						</select>
						<button className={styles.searchButton} type="submit">
							Search
						</button>
					</form>

					<div className={styles.filterBar}>
						<Link
							href={pageHref({ ...state, type: null, page: 1 })}
							className={`${styles.filterBtn} ${type === null ? styles.filterActive : ""}`}
						>
							All ({formatCount(counts.total)})
						</Link>
						{EXTENSION_TYPES.map((t) => (
							<Link
								key={t.slug}
								href={pageHref({ ...state, type: t.slug, page: 1 })}
								className={`${styles.filterBtn} ${type === t.slug ? styles.filterActive : ""}`}
							>
								{t.label} ({formatCount(counts.byType[t.slug] ?? 0)})
							</Link>
						))}
					</div>

					{result.failed ? (
						<p className={styles.emptyState}>
							The extension list could not be loaded right now. Please try again in a moment.
						</p>
					) : result.total === 0 ? (
						<p className={styles.emptyState}>
							No extensions match your search.{" "}
							<Link href="/extensions" className={styles.ctaLink}>
								Clear the search
							</Link>
						</p>
					) : (
						<>
							<p className={styles.resultLine}>
								Showing {formatCount(firstShown)} to {formatCount(lastShown)} of{" "}
								{formatCount(result.total)}
							</p>

							<div className={styles.grid}>
								{result.entries.map((ext) => (
									<Link key={ext.id} href={`/extensions/${ext.id}`} className={styles.card}>
										<div className={styles.cardIcon}>
											<Image
												src="/icons/extentionsIcon.png"
												alt=""
												width={48}
												height={48}
												unoptimized
											/>
										</div>
										<h3 className={styles.cardName}>{ext.name}</h3>
										<p className={styles.cardAuthor}>
											{displayAuthors(ext.authors).slice(0, 2).join(", ")}
											{displayAuthors(ext.authors).length > 2 ? " and others" : ""}
										</p>
										<p className={styles.cardDesc}>{ext.description}</p>
										<div className={styles.cardMeta}>
											{ext.provides
												.map((slug) => typeLabel(slug))
												.filter((label): label is string => label !== null)
												.slice(0, 3)
												.map((label) => (
													<span key={label} className={styles.typeBadge}>
														{label}
													</span>
												))}
											<span className={styles.versionTag}>v{ext.version}</span>
										</div>
									</Link>
								))}
							</div>

							{pageCount > 1 && (
								<nav className={styles.pagination} aria-label="Pages">
									{page > 1 ? (
										<Link className={styles.pageLink} href={pageHref({ ...state, page: page - 1 })}>
											&larr; Previous
										</Link>
									) : (
										<span className={`${styles.pageLink} ${styles.pageLinkOff}`}>&larr; Previous</span>
									)}
									<span className={styles.pageInfo}>
										Page {formatCount(page)} of {formatCount(pageCount)}
									</span>
									{page < pageCount ? (
										<Link className={styles.pageLink} href={pageHref({ ...state, page: page + 1 })}>
											Next &rarr;
										</Link>
									) : (
										<span className={`${styles.pageLink} ${styles.pageLinkOff}`}>Next &rarr;</span>
									)}
								</nav>
							)}
						</>
					)}

					<div className={styles.submitCta}>
						<span className={styles.ctaText}>Want your extension in the catalogue?</span>
						<Link href="/docs/add-an-extension" className={styles.ctaLink}>
							How to add one &rarr;
						</Link>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
