"use client";

import styles from "./ForgeLoader.module.css";

interface Props {
	message?: string;
	size?: "full" | "inline";
}

export function ForgeLoader({ message, size = "full" }: Props) {
	const inline = size === "inline";
	return (
		<div className={inline ? styles.wrapInline : styles.wrap}>
			<img
				src="/forge-logo.png"
				className={inline ? styles.logoInline : styles.logo}
				alt=""
				aria-hidden="true"
			/>
			{message && <span className={styles.msg}>{message}</span>}
		</div>
	);
}
