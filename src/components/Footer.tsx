import styles from "./Footer.module.css";

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.inner}>
				<span className={styles.brand}>Mentenaz Forge</span>
				<span className={styles.copy}>
					&copy; {new Date().getFullYear()} Mentenaz.
				</span>
				<div className={styles.links}>
					<a
						className={styles.link}
						href="https://github.com/mentenaz/forge-landing-page"
						target="_blank"
						rel="noopener noreferrer"
					>
						GitHub
					</a>
					<a
						className={styles.link}
						href="https://github.com/mentenaz/forge-landing-page/issues"
						target="_blank"
						rel="noopener noreferrer"
					>
						Issues
					</a>
				</div>
			</div>
		</footer>
	);
}
