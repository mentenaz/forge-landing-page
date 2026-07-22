import type { ReactNode } from "react";
import Image, { type ImageProps } from "next/image";
import styles from "./FeatureCard.module.css";

interface FeatureCardProps {
	icon: ReactNode;
	title: string;
	description: string;
}

export function ForgeIcon(props: ImageProps) {
	return (
		<Image
			{...props}
			unoptimized
			className={`${styles.iconImg} ${props.className ?? ""}`}
		/>
	);
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
	return (
		<div className={styles.card}>
			<span className={styles.icon}>{icon}</span>
			<h3 className={styles.title}>{title}</h3>
			<p className={styles.description}>{description}</p>
		</div>
	);
}
