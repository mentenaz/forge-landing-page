"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { twin } from "@/lib/twin";
import { getCachedSession, signOut } from "@/lib/twin-auth";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

const notesSchema = z.object({
	notes: z
		.string()
		.max(1000, "Notes must be under 1000 characters")
		.optional()
		.or(z.literal("")),
});

type NotesFormData = z.infer<typeof notesSchema>;

interface Profile {
	id: string;
	email: string;
	status: string;
	plan: string;
	is_admin: string;
	messages_this_month: string;
	created_at: string;
	last_active_at: string | null;
	notes: string | null;
	avatar_url: string | null;
}

const planLabels: Record<string, string> = {
	free: "Free",
	pro: "Pro",
	enterprise: "Enterprise",
};

const statusLabels: Record<string, string> = {
	active: "Active",
	inactive: "Inactive",
	suspended: "Suspended",
};

export default function ProfilePage() {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [saved, setSaved] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [preview, setPreview] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<NotesFormData>({
		resolver: zodResolver(notesSchema),
	});

	useEffect(() => {
		const session = getCachedSession();
		if (!session) {
			router.push("/login");
			return;
		}

		async function loadProfile() {
			try {
				const { data, error: fetchError } = await twin
					.from("profiles")
					.select("*")
					.eq("id", session!.user.id)
					.single();

				if (fetchError || !data) {
					setError("No profile found. Please sign up first.");
				} else {
					setProfile(data);
				}
			} catch {
				setError("Failed to load profile.");
			} finally {
				setLoading(false);
			}
		}

		loadProfile();
	}, [router]);

	useEffect(() => {
		if (profile) {
			reset({ notes: profile.notes || "" });
		}
	}, [profile, reset]);

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !profile) return;

		setError("");
		setUploading(true);

		const ext = file.name.split(".").pop() || "jpg";
		const filePath = `${profile.id}.${ext}`;

		const { error: uploadError } = await twin.storage
			.from("avatars")
			.upload(filePath, file, { upsert: true });

		if (uploadError) {
			setError(uploadError.message);
			setUploading(false);
			return;
		}

		const { data: urlData } = twin.storage
			.from("avatars")
			.getPublicUrl(filePath);

		const avatarUrl = urlData.publicUrl;

		const { error: updateError } = await twin
			.from("profiles")
			.update({ avatar_url: avatarUrl })
			.eq("id", profile.id);

		if (updateError) {
			setError(updateError.message);
			setUploading(false);
			return;
		}

		setProfile((prev) =>
			prev ? { ...prev, avatar_url: avatarUrl } : prev,
		);
		setPreview(null);
		setUploading(false);
	};

	const handleRemoveAvatar = async () => {
		if (!profile) return;

		setError("");
		setUploading(true);

		const ext = profile.avatar_url?.split(".").pop() || "jpg";
		const filePath = `${profile.id}.${ext}`;

		await twin.storage.from("avatars").remove([filePath]);

		const { error: updateError } = await twin
			.from("profiles")
			.update({ avatar_url: null })
			.eq("id", profile.id);

		if (updateError) {
			setError(updateError.message);
			setUploading(false);
			return;
		}

		setProfile((prev) =>
			prev ? { ...prev, avatar_url: null } : prev,
		);
		setUploading(false);
	};

	const onSubmitNotes = async (data: NotesFormData) => {
		if (!profile) return;
		setError("");
		setSaved(false);

		const { error: updateError } = await twin
			.from("profiles")
			.update({ notes: data.notes || null })
			.eq("id", profile.id);

		if (updateError) {
			setError(updateError.message);
			return;
		}

		setProfile((prev) =>
			prev ? { ...prev, notes: data.notes || null } : prev,
		);
		setSaved(true);
		setTimeout(() => setSaved(false), 3000);
	};

	const handleSignOut = async () => {
		await signOut();
		router.push("/");
	};

	const initials = profile?.email?.[0]?.toUpperCase() || "?";

	const joinDate = profile?.created_at
		? new Date(profile.created_at).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		: "—";

	const lastActive = profile?.last_active_at
		? new Date(profile.last_active_at).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		: "Never";

	if (loading) {
		return (
			<div className={styles.page}>
				<Navbar />
				<main className={styles.main}>
					<div className={styles.loading}>Loading profile...</div>
				</main>
				<Footer />
			</div>
		);
	}

	if (!profile) {
		return (
			<div className={styles.page}>
				<Navbar />
				<main className={styles.main}>
					<div className={styles.noProfile}>
						<p>{error || "Could not load profile."}</p>
						<Link href="/login">Go to login</Link>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	const avatarSrc = preview || profile.avatar_url;

	return (
		<div className={styles.page}>
			<Navbar />

			<main className={styles.main}>
				<div className={styles.card}>
					<div className={styles.header}>
						<div
							className={styles.avatarWrap}
							onClick={handleAvatarClick}
							role="button"
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") handleAvatarClick();
							}}
						>
							{avatarSrc ? (
								<img
									src={avatarSrc}
									alt="Profile"
									className={styles.avatarImg}
								/>
							) : (
								<div className={styles.avatarFallback}>{initials}</div>
							)}
							<div className={styles.avatarOverlay}>
								{uploading ? "Uploading..." : "Change Photo"}
							</div>
						</div>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/jpeg,image/png,image/webp"
							className={styles.fileInput}
							onChange={handleFileChange}
							disabled={uploading}
						/>

						{profile.avatar_url && (
							<button
								className={styles.removePhotoBtn}
								type="button"
								onClick={handleRemoveAvatar}
								disabled={uploading}
							>
								Remove photo
							</button>
						)}

						<div className={styles.email}>{profile.email}</div>
						<div className={styles.badges}>
							<span className={`${styles.badge} ${styles.badgePlan}`}>
								{planLabels[profile.plan] || profile.plan}
							</span>
							<span className={`${styles.badge} ${styles.badgeStatus}`}>
								{statusLabels[profile.status] || profile.status}
							</span>
							{profile.is_admin === "true" && (
								<span className={`${styles.badge} ${styles.badgeAdmin}`}>
									Admin
								</span>
							)}
						</div>
					</div>

					{saved && <div className={styles.saved}>Notes saved.</div>}
					{error && <div className={styles.error}>{error}</div>}

					<div className={styles.section}>
						<div className={styles.sectionTitle}>Account Details</div>
						<div className={styles.metaRow}>
							<span className={styles.metaLabel}>Email</span>
							<span className={styles.metaValue}>{profile.email}</span>
						</div>
						<div className={styles.metaRow}>
							<span className={styles.metaLabel}>Plan</span>
							<span className={styles.metaValue}>
								{planLabels[profile.plan] || profile.plan}
							</span>
						</div>
						<div className={styles.metaRow}>
							<span className={styles.metaLabel}>Status</span>
							<span className={styles.metaValue}>
								{statusLabels[profile.status] || profile.status}
							</span>
						</div>
						<div className={styles.metaRow}>
							<span className={styles.metaLabel}>Role</span>
							<span className={styles.metaValue}>
								{profile.is_admin === "true" ? "Admin" : "User"}
							</span>
						</div>
						<div className={styles.metaRow}>
							<span className={styles.metaLabel}>Messages this month</span>
							<span className={styles.metaValue}>
								{profile.messages_this_month}
							</span>
						</div>
						<div className={styles.metaRow}>
							<span className={styles.metaLabel}>Joined</span>
							<span className={styles.metaValue}>{joinDate}</span>
						</div>
						<div className={styles.metaRow}>
							<span className={styles.metaLabel}>Last active</span>
							<span className={styles.metaValue}>{lastActive}</span>
						</div>
					</div>

					<div className={styles.section}>
						<div className={styles.sectionTitle}>Notes</div>
						<form onSubmit={handleSubmit(onSubmitNotes)}>
							<div className={styles.field}>
								<textarea
									id="notes"
									className={`${styles.input} ${styles.textarea} ${errors.notes ? styles.inputError : ""}`}
									placeholder="Add personal notes..."
									{...register("notes")}
								/>
								{errors.notes && (
									<span className={styles.fieldError}>{errors.notes.message}</span>
								)}
							</div>

							<div className={styles.actions}>
								<button
									className={`${styles.btn} ${styles.btnSecondary}`}
									type="button"
									onClick={() => reset()}
									disabled={!isDirty || isSubmitting}
								>
									Reset
								</button>
								<button
									className={`${styles.btn} ${styles.btnPrimary}`}
									type="submit"
									disabled={!isDirty || isSubmitting}
								>
									{isSubmitting ? "Saving..." : "Save Notes"}
								</button>
							</div>
						</form>
					</div>

					<div className={styles.deleteSection}>
						<button
							className={`${styles.btn} ${styles.btnDanger}`}
							type="button"
							onClick={handleSignOut}
						>
							Sign Out
						</button>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
