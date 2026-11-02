import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocMarkdown from "@/components/DocMarkdown";
import styles from "../page.module.css";

export const metadata: Metadata = {
	title: "Releases",
	description: "What changed in each version of Mentenaz Forge Super.",
};

// Re-fetched at most this often, so a new tag shows up without a redeploy and
// the GitHub API is not hit on every visit.
export const revalidate = 600;

const REPO = "mentenaz/mentenaz.Forge.Super";

type GitHubRelease = {
	id: number;
	name: string | null;
	tag_name: string;
	body: string | null;
	html_url: string;
	published_at: string | null;
	draft: boolean;
	prerelease: boolean;
};

async function loadReleases(): Promise<GitHubRelease[] | null> {
	const headers: Record<string, string> = {
		Accept: "application/vnd.github+json",
		"User-Agent": "forge-landing-page",
	};
	// Optional: unauthenticated requests share a rate limit per IP address.
	if (process.env.GITHUB_TOKEN) {
		headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
	}

	try {
		const response = await fetch(
			`https://api.github.com/repos/${REPO}/releases?per_page=30`,
			{ headers, next: { revalidate } },
		);
		if (!response.ok) return null;
		const releases = (await response.json()) as GitHubRelease[];
		// Manual test builds are published as a "dev-build" pre-release.
		return releases.filter((release) => !release.draft && !release.prerelease);
	} catch {
		return null;
	}
}

function formatDate(iso: string | null): string {
	if (!iso) return "";
	return new Date(iso).toLocaleDateString("en-GB", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "UTC",
	});
}

export default async function ReleasesPage() {
	const releases = await loadReleases();

	return (
		<div className={styles.page}>
			<Navbar />
			<main className={styles.main}>
				<Link href="/docs" className={styles.back}>
					&larr; Docs
				</Link>
				<h1 className={styles.heading}>Releases</h1>
				<p className={styles.lede}>
					Every release of Mentenaz Forge Super, newest first. To install or update, see{" "}
					<Link href="/docs/install">Install</Link> and{" "}
					<Link href="/docs/updating">Updating</Link>.
				</p>

				{releases === null && (
					<p className={styles.empty}>
						The release list could not be loaded right now. The full list is on{" "}
						<a href={`https://github.com/${REPO}/releases`}>GitHub</a>.
					</p>
				)}
				{releases?.length === 0 && <p className={styles.empty}>No releases yet.</p>}

				{releases?.map((release) => (
					<article key={release.id} className={styles.release}>
						<div className={styles.releaseHead}>
							<a href={release.html_url} className={styles.releaseTitle}>
								{release.name || release.tag_name}
							</a>
							<span className={styles.releaseDate}>
								{release.tag_name} &middot; {formatDate(release.published_at)}
							</span>
						</div>
						<div className={styles.prose}>
							{release.body?.trim() ? (
								<DocMarkdown>{release.body}</DocMarkdown>
							) : (
								<p className={styles.empty}>No notes for this release.</p>
							)}
						</div>
					</article>
				))}
			</main>
			<Footer />
		</div>
	);
}
