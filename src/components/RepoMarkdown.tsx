import type { ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import tableStyles from "./DocMarkdown.module.css";

/**
 * A README written by an extension's authors, shown on that extension's page.
 *
 * It is third-party content, so it is rendered defensively:
 *  - raw HTML in the README is dropped completely (skipHtml), and links with a scheme other
 *    than http(s), mailto or tel are dropped;
 *  - relative links and images are resolved against the extension's repository, at the
 *    commit the registry built, so they point at the right files;
 *  - images are shown only when they are hosted by GitHub; any other image becomes a plain
 *    link, so a visitor's address is not handed to some third-party image host;
 *  - README headings are moved down a level, because the page already has an h1.
 */

const GITHUB_IMAGE_HOSTS = [/^github\.com$/, /^([a-z0-9-]+\.)*githubusercontent\.com$/];

function isGithubImageHost(hostname: string): boolean {
	return GITHUB_IMAGE_HOSTS.some((pattern) => pattern.test(hostname));
}

function resolveUrl(url: string | undefined, base: string | null): URL | null {
	if (!url) return null;
	try {
		return new URL(url, base ?? undefined);
	} catch {
		return null; // a relative address with nothing to resolve it against
	}
}

function isSafeLink(url: URL): boolean {
	return ["https:", "http:", "mailto:", "tel:"].includes(url.protocol);
}

function demote(level: 2 | 3 | 4 | 5 | 6) {
	const Tag = `h${level}` as "h2" | "h3" | "h4" | "h5" | "h6";
	return function Heading({ children }: { children?: ReactNode }) {
		return <Tag>{children}</Tag>;
	};
}

export default function RepoMarkdown({
	children,
	rawBase,
	blobBase,
}: {
	children: string;
	rawBase: string | null;
	blobBase: string | null;
}) {
	const components: Components = {
		h1: demote(2),
		h2: demote(3),
		h3: demote(4),
		h4: demote(5),
		h5: demote(6),
		h6: demote(6),

		a({ href, children: label }) {
			if (href?.startsWith("#")) return <>{label}</>; // in-page anchors do not exist on this page
			const target = resolveUrl(href, blobBase);
			if (!target || !isSafeLink(target)) return <>{label}</>;
			return (
				<a href={target.toString()} target="_blank" rel="noopener noreferrer nofollow ugc">
					{label}
				</a>
			);
		},

		img({ src, alt }) {
			const source = typeof src === "string" ? src : undefined;
			const target = resolveUrl(source, rawBase);
			const label = alt && alt.trim() ? alt : "image";
			if (!target || target.protocol !== "https:") return <span>{label}</span>;
			if (!isGithubImageHost(target.hostname)) {
				return (
					<a href={target.toString()} target="_blank" rel="noopener noreferrer nofollow ugc">
						{label}
					</a>
				);
			}
			return (
				// eslint-disable-next-line @next/next/no-img-element
				<img src={target.toString()} alt={alt ?? ""} loading="lazy" referrerPolicy="no-referrer" />
			);
		},

		table({ children: rows }) {
			return (
				<div className={tableStyles.tableWrap}>
					<table>{rows}</table>
				</div>
			);
		},
	};

	return (
		<ReactMarkdown remarkPlugins={[remarkGfm]} components={components} skipHtml>
			{children}
		</ReactMarkdown>
	);
}
