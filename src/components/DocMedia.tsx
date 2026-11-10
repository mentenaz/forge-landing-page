import Image from "next/image";
import type { DocMediaItem } from "@/lib/docMedia";
import styles from "./DocMedia.module.css";

/**
 * The screenshots and clips of one docs step. An image with a known size goes
 * through next/image (resized, lazy, with its space reserved); a video does not
 * download until it is played.
 */
export default function DocMedia({ items }: { items: DocMediaItem[] }) {
	if (items.length === 0) return null;
	return (
		<>
			{items.map((item) => (
				<figure className={styles.figure} key={item.url}>
					{item.kind === "video" ? (
						<video
							className={styles.media}
							controls
							preload="none"
							playsInline
							poster={item.posterUrl ?? undefined}
							aria-label={item.alt}
							width={item.width ?? undefined}
							height={item.height ?? undefined}
						>
							<source src={item.url} />
						</video>
					) : item.width && item.height ? (
						<Image
							className={styles.media}
							src={item.url}
							alt={item.alt}
							width={item.width}
							height={item.height}
							sizes="(max-width: 800px) 100vw, 760px"
						/>
					) : (
						// eslint-disable-next-line @next/next/no-img-element
						<img className={styles.media} src={item.url} alt={item.alt} loading="lazy" />
					)}
					{item.caption && <figcaption className={styles.caption}>{item.caption}</figcaption>}
				</figure>
			))}
		</>
	);
}
