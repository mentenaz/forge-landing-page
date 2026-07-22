"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUp } from "@/lib/twin-auth";
import styles from "../login/page.module.css";

const signupSchema = z
	.object({
		email: z
			.string()
			.min(1, "Email is required")
			.email("Please enter a valid email address"),
		password: z
			.string()
			.min(1, "Password is required")
			.min(6, "Password must be at least 6 characters"),
		confirm: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirm, {
		message: "Passwords do not match",
		path: ["confirm"],
	});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
	const router = useRouter();
	const [serverError, setServerError] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
	});

	const onSubmit = async (data: SignupFormData) => {
		setServerError("");
		try {
			await signUp(data.email, data.password);
			router.push("/signup/interview");
		} catch (err: any) {
			setServerError(err.message || "Signup failed");
		}
	};

	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<div className={styles.header}>
					<img src="/forge-logo.png" alt="" className={styles.logo} />
					<h1 className={styles.title}>Create your account</h1>
					<p className={styles.subtitle}>Build your AI Twin in a few minutes</p>
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
							placeholder="At least 6 characters"
							{...register("password")}
						/>
						{errors.password && (
							<span className={styles.fieldError}>{errors.password.message}</span>
						)}
					</div>
					<div className={styles.field}>
						<label className={styles.label}>Confirm Password</label>
						<input
							className={`${styles.input} ${errors.confirm ? styles.inputError : ""}`}
							type="password"
							placeholder="Repeat password"
							{...register("confirm")}
						/>
						{errors.confirm && (
							<span className={styles.fieldError}>{errors.confirm.message}</span>
						)}
					</div>
					<button className={styles.submitBtn} type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Creating account..." : "Create Account"}
					</button>
				</form>

				<div className={styles.footer}>
					Already have an account? <Link href="/login">Sign in</Link>
				</div>
			</div>
		</div>
	);
}
