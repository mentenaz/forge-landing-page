import Link from "next/link";
import styles from "./LegacyNotice.module.css";

/** Shown on pages that describe the previous (Tauri) Forge, not Forge Super. */
export default function LegacyNotice() {
	return (
		<aside className={styles.notice}>
			This page describes the previous version of Forge, the Tauri app. Mentenaz Forge Super
			works differently: you connect your own AI provider, or none. See{" "}
			<Link href="/docs/ai-setup">AI setup</Link>, or the{" "}
			<Link href="/legacy">previous version overview</Link>.
		</aside>
	);
}
