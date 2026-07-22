"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

export default function SubmitExtensionPage() {
	const [name, setName] = useState("");
	const [author, setAuthor] = useState("");
	const [email, setEmail] = useState("");
	const [description, setDescription] = useState("");
	const [extensionId, setExtensionId] = useState("");
	const [tier, setTier] = useState("1");
	const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setStatus("submitting");

		const { error } = await supabase.from("extension_submissions").insert({
			name,
			author,
			email,
			description,
			extension_id: extensionId,
			tier: Number(tier),
		});

		if (error) {
			setStatus("error");
		} else {
			setStatus("success");
			setName("");
			setAuthor("");
			setEmail("");
			setDescription("");
			setExtensionId("");
			setTier("1");
		}
	}

	return (
		<div className={styles.page}>
			<Navbar />

			<div className={styles.content}>
				<div className={styles.container}>
					<h1 className={styles.title}>Submit an Extension</h1>
					<p className={styles.subtitle}>
						Share your extension with the Forge community.
					</p>

					{status === "success" && (
						<div className={styles.successMsg}>
							Extension submitted! We&apos;ll review it and get back to you via email.
						</div>
					)}

					{status === "error" && (
						<div className={styles.errorMsg}>
							Something went wrong. Please try again.
						</div>
					)}

					<form onSubmit={handleSubmit} className={styles.form}>
						<div className={styles.field}>
							<label className={styles.label}>Extension Name</label>
							<input
								type="text"
								className={styles.input}
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="My Awesome Extension"
								required
							/>
						</div>

						<div className={styles.field}>
							<label className={styles.label}>Author</label>
							<input
								type="text"
								className={styles.input}
								value={author}
								onChange={(e) => setAuthor(e.target.value)}
								placeholder="your-name"
								required
							/>
						</div>

						<div className={styles.field}>
							<label className={styles.label}>Email</label>
							<input
								type="email"
								className={styles.input}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								required
							/>
						</div>

						<div className={styles.field}>
							<label className={styles.label}>Description</label>
							<div className={styles.textareaWrap}>
								<textarea
									className={styles.textarea}
									value={description}
									onChange={(e) =>
										setDescription(e.target.value.slice(0, 255))
									}
									placeholder="What does your extension do?"
									rows={4}
									required
								/>
								<span className={styles.charCount}>{description.length}/255</span>
							</div>
						</div>

						<div className={styles.field}>
							<label className={styles.label}>Extension ID</label>
							<input
								type="text"
								className={`${styles.input} ${styles.mono}`}
								value={extensionId}
								onChange={(e) => setExtensionId(e.target.value)}
								placeholder="yourname.extension-name"
								required
							/>
							<span className={styles.hint}>
								e.g. yourname.extension-name
							</span>
						</div>

						<div className={styles.field}>
							<label className={styles.label}>Tier</label>
							<select
								className={styles.select}
								value={tier}
								onChange={(e) => setTier(e.target.value)}
							>
								<option value="1">Schema-only (Tier 1)</option>
								<option value="2">Code extension (Tier 2)</option>
							</select>
						</div>

						<button
							type="submit"
							className={styles.submitBtn}
							disabled={status === "submitting"}
						>
							{status === "submitting" ? "Submitting..." : "Submit for Review"}
						</button>
					</form>

					<p className={styles.note}>
						Extensions are reviewed before being published. You&apos;ll receive
						an email at the address provided with the review status.
					</p>
				</div>
			</div>

			<Footer />
		</div>
	);
}
