"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { heroMedia } from "@/config/hero";
import styles from "./HeroMedia.module.css";

/** `navigator.connection` is not in TypeScript's own types yet. */
interface NetworkInformationLike {
	saveData?: boolean;
}

/** Safari does not have `requestIdleCallback`, so the page has to ask. */
type IdleWindow = Window & {
	requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
	cancelIdleCallback?: (handle: number) => void;
};

/**
 * The framed "app window" under the hero copy: a muted, looping clip of the
 * product, with its first frame as the poster.
 *
 * The poster is part of the page and is the picture the page is measured on,
 * so it is loaded first and its 16:9 box is reserved: nothing moves when it
 * arrives. The clip is only added once the page is idle, and not at all for
 * someone who has asked for reduced motion or for less data. Then the poster
 * stays, and nothing autoplays. Once it plays there is a button to pause it.
 */
export default function HeroMedia() {
	const [showVideo, setShowVideo] = useState(false);
	const [paused, setPaused] = useState(false);
	const videoRef = useRef<HTMLVideoElement | null>(null);

	useEffect(() => {
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
		const connection = (navigator as Navigator & { connection?: NetworkInformationLike })
			.connection;
		const savesData = connection?.saveData === true;

		let timer: number | undefined;
		let idle: number | undefined;
		const start = () => setShowVideo(true);
		const idleWindow: IdleWindow = window;
		if (!reduced.matches && !savesData) {
			if (idleWindow.requestIdleCallback) {
				idle = idleWindow.requestIdleCallback(start, { timeout: 2500 });
			} else {
				timer = window.setTimeout(start, 1200);
			}
		}

		// Asking for reduced motion while the page is open takes the clip away.
		const onChange = () => {
			if (reduced.matches) setShowVideo(false);
		};
		reduced.addEventListener("change", onChange);
		return () => {
			reduced.removeEventListener("change", onChange);
			if (idle !== undefined) idleWindow.cancelIdleCallback?.(idle);
			if (timer !== undefined) window.clearTimeout(timer);
		};
	}, []);

	// React does not put `muted` on the element in time for autoplay, and a
	// clip that is not muted at that moment is not allowed to start.
	useEffect(() => {
		const video = videoRef.current;
		if (!showVideo || !video) return;
		video.muted = true;
		video.play().catch(() => {
			// Autoplay refused: the poster behind it simply stays.
		});
	}, [showVideo]);

	const togglePause = () => {
		const video = videoRef.current;
		if (!video) return;
		if (video.paused) {
			void video.play();
			setPaused(false);
		} else {
			video.pause();
			setPaused(true);
		}
	};

	return (
		<figure className={styles.frame}>
			<div className={styles.window}>
				<Image
					src={heroMedia.poster}
					// The clip below carries the description once it is there.
					alt={showVideo ? "" : heroMedia.description}
					width={heroMedia.width}
					height={heroMedia.height}
					sizes="(max-width: 1040px) 100vw, 960px"
					priority
					fetchPriority="high"
					className={styles.picture}
				/>
				{showVideo && (
					<>
						<video
							ref={videoRef}
							className={styles.video}
							width={heroMedia.width}
							height={heroMedia.height}
							poster={heroMedia.poster}
							aria-label={heroMedia.description}
							autoPlay
							muted
							loop
							playsInline
							preload="metadata"
						>
							<source src={heroMedia.webm} type="video/webm" />
							<source src={heroMedia.mp4} type="video/mp4" />
						</video>
						<button
							type="button"
							className={styles.pause}
							onClick={togglePause}
							aria-pressed={paused}
						>
							{paused ? "Play the demo" : "Pause the demo"}
						</button>
					</>
				)}
			</div>
		</figure>
	);
}
