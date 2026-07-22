import type { ReactNode } from "react";
import styles from "./DownloadButton.module.css";

interface DownloadButtonProps {
	icon: ReactNode;
	platform: string;
	filename: string;
	href?: string;
}

export default function DownloadButton({ icon, platform, filename, href }: DownloadButtonProps) {
	const downloadUrl = href ?? `https://github.com/mentenaz/mentenaz-forge/releases/latest/download/${filename}`;

	return (
		<a
			className={styles.card}
			href={downloadUrl}
			download
		>
			<span className={styles.icon}>{icon}</span>
			<span className={styles.platform}>{platform}</span>
			<span className={styles.filename}>{filename}</span>
		</a>
	);
}
