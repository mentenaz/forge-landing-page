import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import type { Extension } from "@/types/database";
import styles from "./page.module.css";

export const metadata: Metadata = {
	title: "Extension Marketplace",
	description: "Extend Forge with community-built integrations and tools. Browse schema and code extensions.",
};

const filters = ["All", "Schema", "Code", "Official"] as const;

function formatDownloads(n: number): string {
	if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
	return String(n);
}

export default async function ExtensionsPage() {
	const { data: extensions } = await supabase
		.from("extensions")
		.select("*")
		.order("downloads", { ascending: false });

	const exts: Extension[] = (extensions as Extension[]) ?? [];

	return (
		<div className={styles.page}>
			<Navbar />

			<section className={styles.hero}>
				<h1 className={styles.heroTitle}>Extension Marketplace</h1>
				<p className={styles.heroSubtitle}>
					Extend Forge with community-built integrations and tools.
				</p>
				<div className={styles.notice}>
					Coming soon in the official release. Stay tuned!
				</div>
			</section>

			<section className={styles.content}>
				<div className={styles.container}>
					<div className={styles.filterBar}>
						{filters.map((f) => (
							<button
								key={f}
								className={`${styles.filterBtn} ${f === "All" ? styles.filterActive : ""}`}
							>
								{f}
							</button>
						))}
					</div>

					<div className={styles.grid}>
						{exts.map((ext) => (
							<Link
								key={ext.id}
								href={`/extensions/detail?id=${ext.id}`}
								className={styles.card}
							>
								<div className={styles.cardIcon}>
									<img src={ext.icon_url ?? "/icons/extentionsIcon.png"} alt="" />
								</div>
								<h3 className={styles.cardName}>{ext.name}</h3>
								<p className={styles.cardAuthor}>{ext.author}</p>
								<p className={styles.cardDesc}>{ext.description}</p>
								<div className={styles.cardMeta}>
									<span
										className={`${styles.tierBadge} ${ext.tier === 2 ? styles.tierCode : styles.tierSchema}`}
									>
										{ext.tier === 2 ? "Code" : "Schema"}
									</span>
									{ext.official && (
										<span className={styles.tierBadge} style={{ background: "var(--accent)", color: "#fff" }}>
											Official
										</span>
									)}
									<span className={styles.downloadCount}>
										&#8595; {formatDownloads(ext.downloads)}
									</span>
								</div>
							</Link>
						))}
					</div>

					{exts.length === 0 && (
						<p className={styles.emptyState}>No extensions found. Be the first to submit one!</p>
					)}

					<div className={styles.submitCta}>
						<span className={styles.ctaText}>Want to build an extension?</span>
						<Link href="/extensions/submit" className={styles.ctaLink}>
							Submit yours &rarr;
						</Link>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
