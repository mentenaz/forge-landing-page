import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./DocMarkdown.module.css";

/**
 * Markdown for the docs and release notes. remark-gfm adds tables (and
 * strikethrough, task lists and bare links); each table gets a wrapper so a
 * wide one scrolls sideways on a phone instead of breaking the page.
 */
export default function DocMarkdown({ children }: { children: string }) {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={{
				table: ({ children: rows }) => (
					<div className={styles.tableWrap}>
						<table>{rows}</table>
					</div>
				),
			}}
		>
			{children}
		</ReactMarkdown>
	);
}
