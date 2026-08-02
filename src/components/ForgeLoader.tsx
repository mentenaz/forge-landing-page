"use client";

import Image from "next/image";
import styles from "./ForgeLoader.module.css";

interface Props {
	message?: string;
	size?: "full" | "inline";
}

export function ForgeLoader({ message, size = "full" }: Props) {
	const inline = size === "inline";
	return (
		<div className={inline ? styles.wrapInline : styles.wrap}>
			<Image
				src="/forge-logo.png"
				width={680}
				height={654}
				className={inline ? styles.logoInline : styles.logo}
				alt=""
				aria-hidden="true"
			/>
			{message && <span className={styles.msg}>{message}</span>}
		</div>
	);
}
