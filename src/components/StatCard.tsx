import styles from "./StatCard.module.css";

interface StatCardProps {
	value: string;
	label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
	return (
		<div className={styles.stat}>
			<span className={styles.value}>{value}</span>
			<span className={styles.label}>{label}</span>
		</div>
	);
}
