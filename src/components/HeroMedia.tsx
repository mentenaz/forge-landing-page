import Image from "next/image";
import { heroMedia } from "@/config/hero";
import styles from "./HeroMedia.module.css";

/**
 * The framed "app window" under the hero copy. For now it shows the poster; the
 * clip is added on top of it separately. The frame keeps a 16:9 box, so nothing
 * moves when the picture arrives.
 */
export default function HeroMedia() {
	return (
		<figure className={styles.frame}>
			<div className={styles.window}>
				<Image
					src={heroMedia.poster}
					alt={heroMedia.description}
					width={heroMedia.width}
					height={heroMedia.height}
					sizes="(max-width: 1040px) 100vw, 960px"
					priority
					className={styles.picture}
				/>
			</div>
		</figure>
	);
}
