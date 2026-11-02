import styles from "./Footer.module.css";

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.inner}>
				<span className={styles.brand}>Mentenaz Forge</span>
				<span className={styles.copy}>
					&copy; {new Date().getFullYear()} Mentenaz. Built on{" "}
					<a href="https://zed.dev" target="_blank" rel="noopener noreferrer">
						Zed
					</a>
					, which is not affiliated with this project.
				</span>
				<div className={styles.links}>
					<a
						className={styles.link}
						href="https://github.com/mentenaz/mentenaz.Forge.Super"
						target="_blank"
						rel="noopener noreferrer"
					>
						GitHub
					</a>
					<a
						className={styles.link}
						href="https://github.com/mentenaz/mentenaz.Forge.Super/issues"
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
