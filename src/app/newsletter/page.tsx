"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

const newsletterSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(100, "Name must be under 100 characters"),
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export default function NewsletterPage() {
	const [status, setStatus] = useState<"idle" | "success">("idle");

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<NewsletterFormData>({
		resolver: zodResolver(newsletterSchema),
	});

	const onSubmit = async (data: NewsletterFormData) => {
		const res = await fetch("/api/newsletter", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		if (!res.ok) throw new Error("Signup failed");
		setStatus("success");
	};

	return (
		<div className={styles.page}>
			<Navbar />

			<main className={styles.main}>
				<div className={styles.card}>
					<div className={styles.header}>
						<h1 className={styles.title}>Stay in the Loop</h1>
						<p className={styles.subtitle}>
							Get notified about new releases, features, and updates.
						</p>
					</div>

					{status === "success" ? (
						<div className={styles.success}>
							You&apos;re on the list! We&apos;ll keep you updated.
						</div>
					) : (
						<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
							<div className={styles.field}>
								<label className={styles.label} htmlFor="name">
									Name
								</label>
								<input
									id="name"
									className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
									type="text"
									placeholder="Your name"
									autoFocus
									{...register("name")}
								/>
								{errors.name && (
									<span className={styles.fieldError}>{errors.name.message}</span>
								)}
							</div>

							<div className={styles.field}>
								<label className={styles.label} htmlFor="email">
									Email
								</label>
								<input
									id="email"
									className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
									type="email"
									placeholder="you@example.com"
									{...register("email")}
								/>
								{errors.email && (
									<span className={styles.fieldError}>{errors.email.message}</span>
								)}
							</div>

							<button
								className={styles.submitBtn}
								type="submit"
								disabled={isSubmitting}
							>
								{isSubmitting ? "Signing up..." : "Subscribe"}
							</button>
						</form>
					)}

					<p className={styles.footer}>
						<Link href="/">Back to home</Link>
					</p>
				</div>
			</main>

			<Footer />
		</div>
	);
}
