"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import type { Extension } from "@/types/database";
import styles from "./page.module.css";

function formatDownloads(n: number): string {
	return n.toLocaleString();
}

function ExtensionDetailInner() {
	const searchParams = useSearchParams();
	const id = searchParams.get("id");
	const [extension, setExtension] = useState<Extension | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!id) {
			setLoading(false);
			return;
		}
		supabase
			.from("extensions")
			.select("*")
			.eq("id", id)
			.single()
			.then(({ data }) => {
				setExtension(data as Extension | null);
				setLoading(false);
			});
	}, [id]);

	if (loading) {
		return (
			<div className={styles.page}>
				<Navbar />
				<div className={styles.content}>
					<div className={styles.container}>
						<p className={styles.notFound}>Loading...</p>
					</div>
				</div>
				<Footer />
			</div>
		);
	}

	if (!extension) {
		return (
			<div className={styles.page}>
				<Navbar />
				<div className={styles.content}>
					<div className={styles.container}>
						<h1 className={styles.notFound}>Extension not found</h1>
						<Link href="/extensions" className={styles.backLink}>
							&larr; Back to marketplace
						</Link>
					</div>
				</div>
				<Footer />
			</div>
		);
	}

	return (
		<div className={styles.page}>
			<Navbar />

			<div className={styles.content}>
				<div className={styles.container}>
					<nav className={styles.breadcrumbs}>
						<Link href="/extensions" className={styles.breadcrumbLink}>
							Extensions
						</Link>
						<span className={styles.breadcrumbSep}>/</span>
						<span className={styles.breadcrumbCurrent}>{extension.name}</span>
					</nav>

					<div className={styles.header}>
						<div className={styles.headerIcon}>
							<img src={extension.icon_url ?? "/icons/extentionsIcon.png"} alt="" />
						</div>
						<div className={styles.headerInfo}>
							<h1 className={styles.headerName}>{extension.name}</h1>
							<p className={styles.headerAuthor}>by {extension.author}</p>
							<div className={styles.headerBadges}>
								<span
									className={`${styles.badge} ${extension.official ? styles.badgeOfficial : styles.badgeCommunity}`}
								>
									{extension.official ? "Official" : "Community"}
								</span>
								<span
									className={`${styles.badge} ${extension.tier === 2 ? styles.badgeCode : styles.badgeSchema}`}
								>
									{extension.tier === 2 ? "Code" : "Schema"}
								</span>
								<span className={styles.downloadCount}>
									&#8595; {formatDownloads(extension.downloads)}
								</span>
							</div>
						</div>
					</div>

					<div className={styles.installBox}>
						<h3 className={styles.installTitle}>How to install</h3>
						<ol className={styles.installSteps}>
							<li>Open Forge &rarr; Extensions panel</li>
							<li>
								Search for{" "}
								<code className={styles.installId}>{extension.id}</code>
							</li>
							<li>Click Install</li>
						</ol>
					</div>

					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>Description</h2>
						<p className={styles.descText}>{extension.description}</p>
					</section>

					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>Details</h2>
						<div className={styles.detailsTable}>
							<div className={styles.detailRow}>
								<span className={styles.detailLabel}>Version</span>
								<span className={styles.detailValue}>{extension.version}</span>
							</div>
							<div className={styles.detailRow}>
								<span className={styles.detailLabel}>Tier</span>
								<span className={styles.detailValue}>
									{extension.tier === 2 ? "Code" : "Schema"}
								</span>
							</div>
							<div className={styles.detailRow}>
								<span className={styles.detailLabel}>Downloads</span>
								<span className={styles.detailValue}>
									{formatDownloads(extension.downloads)}
								</span>
							</div>
							<div className={styles.detailRow}>
								<span className={styles.detailLabel}>Last updated</span>
								<span className={styles.detailValue}>
									{new Date(extension.updated_at).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
									})}
								</span>
							</div>
							<div className={styles.detailRow}>
								<span className={styles.detailLabel}>License</span>
								<span className={styles.detailValue}>{extension.license}</span>
							</div>
						</div>
					</section>
				</div>
			</div>

			<Footer />
		</div>
	);
}

export default function ExtensionDetailPage() {
	return (
		<Suspense fallback={
			<div className={styles.page}>
				<Navbar />
				<div className={styles.content}>
					<div className={styles.container}>
						<p className={styles.notFound}>Loading...</p>
					</div>
				</div>
				<Footer />
			</div>
		}>
			<ExtensionDetailInner />
		</Suspense>
	);
}
