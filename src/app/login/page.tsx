"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "@/lib/twin-auth";
import styles from "./page.module.css";

const loginSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const router = useRouter();
	const [serverError, setServerError] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginFormData) => {
		setServerError("");
		try {
			await signIn(data.email, data.password);
			router.push("/ai/chat");
		} catch (err: any) {
			setServerError(err.message || "Invalid credentials");
		}
	};

	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<div className={styles.header}>
					<img src="/forge-logo.png" alt="" className={styles.logo} />
					<h1 className={styles.title}>Welcome back</h1>
					<p className={styles.subtitle}>Sign in to access your AI Twin</p>
				</div>

				{serverError && <div className={styles.error}>{serverError}</div>}

				<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
					<div className={styles.field}>
						<label className={styles.label}>Email</label>
						<input
							className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
							type="email"
							placeholder="you@example.com"
							autoFocus
							{...register("email")}
						/>
						{errors.email && (
							<span className={styles.fieldError}>{errors.email.message}</span>
						)}
					</div>
					<div className={styles.field}>
						<label className={styles.label}>Password</label>
						<input
							className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
							type="password"
							placeholder="••••••••"
							{...register("password")}
						/>
						{errors.password && (
							<span className={styles.fieldError}>{errors.password.message}</span>
						)}
					</div>
					<button className={styles.submitBtn} type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Signing in..." : "Sign In"}
					</button>
				</form>

				<div className={styles.footer}>
					No account? <Link href="/signup">Create one</Link>
				</div>
			</div>
		</div>
	);
}
