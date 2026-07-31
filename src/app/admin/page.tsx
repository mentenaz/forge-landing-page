"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, getCachedSession } from "@/lib/twin-auth";
import { supabase } from "@/lib/supabase";
import { twin } from "@/lib/twin";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

type Tab = "stats" | "newsletter" | "extensions" | "users";

interface Subscriber {
	id: string;
	email: string;
	name: string | null;
	status: string;
	subscribed_at: string;
}

interface Submission {
	id: string;
	name: string;
	author: string;
	email: string;
	description: string;
	extension_id: string;
	tier: number;
	status: string;
	created_at: string;
}

interface Profile {
	id: string;
	email: string;
	name: string | null;
	status: string;
	plan: string;
	is_admin: string | boolean;
	messages_this_month: string;
	created_at: string;
}

interface SiteStat {
	key: string;
	value: number;
}

export default function AdminPage() {
	const router = useRouter();
	const [user] = useState<{ id: string; email: string } | null>(() => getUser());
	const [isAdmin, setIsAdmin] = useState(false);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<Tab>("stats");

	// Stats
	const [stats, setStats] = useState<SiteStat[]>([]);
	const [subscriberCount, setSubscriberCount] = useState(0);
	const [submissionCount, setSubmissionCount] = useState(0);

	// Newsletter
	const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
	const [newsletterSubject, setNewsletterSubject] = useState("");
	const [newsletterContent, setNewsletterContent] = useState("");
	const [sending, setSending] = useState(false);
	const [sendResult, setSendResult] = useState("");

	// Extensions
	const [submissions, setSubmissions] = useState<Submission[]>([]);

	// Users
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [updatingId, setUpdatingId] = useState<string | null>(null);
	const [userUpdateError, setUserUpdateError] = useState("");

	useEffect(() => {
		if (!user) {
			router.push("/login");
			return;
		}

		async function checkAdmin() {
			const session = getCachedSession();
			if (!session) return;

			await twin.auth.setSession({
				access_token: session.access_token,
				refresh_token: session.refresh_token,
			});

			const { data } = await twin
				.from("profiles")
				.select("is_admin")
				.eq("id", user!.id)
				.single();

			if (data?.is_admin !== "true" && data?.is_admin !== true) {
				router.push("/dashboard");
				return;
			}
			setIsAdmin(true);
			loadStats();
		}

		checkAdmin();
	}, [user, router]);

	const loadStats = async () => {
		const [statsRes, subsRes, submRes] = await Promise.all([
			supabase.from("site_stats").select("*"),
			supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
			supabase.from("extension_submissions").select("id", { count: "exact", head: true }),
		]);

		if (statsRes.data) setStats(statsRes.data);
		setSubscriberCount(subsRes.count || 0);
		setSubmissionCount(submRes.count || 0);
		setLoading(false);
	};

	const loadSubscribers = async () => {
		const { data } = await supabase
			.from("newsletter_subscribers")
			.select("*")
			.order("subscribed_at", { ascending: false });
		if (data) setSubscribers(data);
	};

	const handleDeleteSubscriber = async (sub: Subscriber) => {
		if (!window.confirm(`Delete subscriber ${sub.email}?`)) return;
		const { error } = await supabase
			.from("newsletter_subscribers")
			.delete()
			.eq("id", sub.id);
		if (error) {
			setUserUpdateError(error.message);
			return;
		}
		setSubscribers((prev) => prev.filter((s) => s.id !== sub.id));
		setSubscriberCount((c) => Math.max(0, c - 1));
	};

	const loadSubmissions = async () => {
		const { data } = await supabase
			.from("extension_submissions")
			.select("*")
			.order("created_at", { ascending: false });
		if (data) setSubmissions(data);
	};

	const loadProfiles = async () => {
		const { data } = await twin
			.from("profiles")
			.select("*")
			.order("created_at", { ascending: false });
		if (data) setProfiles(data);
	};

	const handlePlanChange = async (profile: Profile, plan: string) => {
		setUpdatingId(profile.id);
		setUserUpdateError("");
		const { error } = await twin.from("profiles").update({ plan }).eq("id", profile.id);
		setUpdatingId(null);
		if (error) {
			setUserUpdateError(error.message);
			return;
		}
		setProfiles((prev) =>
			prev.map((p) => (p.id === profile.id ? { ...p, plan } : p))
		);
	};

	const handleAdminToggle = async (profile: Profile) => {
		const next = profile.is_admin === "true" || profile.is_admin === true ? "false" : "true";
		setUpdatingId(profile.id);
		setUserUpdateError("");
		const { error } = await twin
			.from("profiles")
			.update({ is_admin: next })
			.eq("id", profile.id);
		setUpdatingId(null);
		if (error) {
			setUserUpdateError(error.message);
			return;
		}
		setProfiles((prev) =>
			prev.map((p) => (p.id === profile.id ? { ...p, is_admin: next } : p))
		);
	};

	const handleDeleteUser = async (profile: Profile) => {
		if (!window.confirm(`Delete user ${profile.email}? This cannot be undone.`)) return;
		setUpdatingId(profile.id);
		setUserUpdateError("");

		try {
			const token = getCachedSession()?.access_token;
			if (!token) {
				setUserUpdateError("No active session");
				return;
			}

			const res = await fetch("/api/admin/delete-user", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ userId: profile.id }),
			});
			const data = await res.json();
			if (!res.ok) {
				setUserUpdateError(data.error || "Failed to delete user");
				return;
			}
			setProfiles((prev) => prev.filter((p) => p.id !== profile.id));
		} catch {
			setUserUpdateError("Failed to delete user");
		} finally {
			setUpdatingId(null);
		}
	};

	useEffect(() => {
		if (!isAdmin) return;
		if (activeTab === "newsletter") loadSubscribers();
		if (activeTab === "extensions") loadSubmissions();
		if (activeTab === "users") loadProfiles();
	}, [activeTab, isAdmin]);

	const handleSendNewsletter = async () => {
		if (!newsletterSubject.trim() || !newsletterContent.trim()) return;
		setSending(true);
		setSendResult("");

		try {
			const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/newsletter-email`;
			const res = await fetch(functionUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
				},
				body: JSON.stringify({
					type: "batch",
					subject: newsletterSubject,
					content: newsletterContent,
				}),
			});
			const data = await res.json();
			setSendResult(data.message || "Newsletter sent!");
			setNewsletterSubject("");
			setNewsletterContent("");
		} catch {
			setSendResult("Failed to send newsletter");
		}
		setSending(false);
	};

	const handleApproveSubmission = async (id: string) => {
		await supabase
			.from("extension_submissions")
			.update({ status: "approved" })
			.eq("id", id);
		loadSubmissions();
	};

	const handleRejectSubmission = async (id: string) => {
		await supabase
			.from("extension_submissions")
			.update({ status: "rejected" })
			.eq("id", id);
		loadSubmissions();
	};

	if (loading) {
		return (
			<div className={styles.page}>
				<Navbar />
				<main className={styles.main}>
					<div className={styles.container}>
						<div className={styles.empty}>Loading...</div>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	if (!isAdmin) {
		return (
			<div className={styles.page}>
				<Navbar />
				<main className={styles.main}>
					<div className={styles.container}>
						<div className={styles.empty}>
							<p>Access denied.</p>
							<Link href="/dashboard">Go to Dashboard</Link>
						</div>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	return (
		<div className={styles.page}>
			<Navbar />
			<main className={styles.main}>
				<div className={styles.container}>
					<div className={styles.header}>
						<h1 className={styles.title}>Admin Panel</h1>
						<p className={styles.subtitle}>Manage your platform</p>
					</div>

					<div className={styles.tabs}>
						<button
							className={`${styles.tab} ${activeTab === "stats" ? styles.tabActive : ""}`}
							onClick={() => setActiveTab("stats")}
						>
							Stats
						</button>
						<button
							className={`${styles.tab} ${activeTab === "newsletter" ? styles.tabActive : ""}`}
							onClick={() => setActiveTab("newsletter")}
						>
							Newsletter
						</button>
						<button
							className={`${styles.tab} ${activeTab === "extensions" ? styles.tabActive : ""}`}
							onClick={() => setActiveTab("extensions")}
						>
							Extensions
						</button>
						<button
							className={`${styles.tab} ${activeTab === "users" ? styles.tabActive : ""}`}
							onClick={() => setActiveTab("users")}
						>
							Users
						</button>
					</div>

					{/* Stats Tab */}
					{activeTab === "stats" && (
						<>
							<div className={styles.statsGrid}>
								<div className={styles.statCard}>
									<div className={styles.statValue}>{subscriberCount}</div>
									<div className={styles.statLabel}>Newsletter Subscribers</div>
								</div>
								<div className={styles.statCard}>
									<div className={styles.statValue}>{submissionCount}</div>
									<div className={styles.statLabel}>Extension Submissions</div>
								</div>
								{stats.map((stat) => (
									<div key={stat.key} className={styles.statCard}>
										<div className={styles.statValue}>{stat.value.toLocaleString()}</div>
										<div className={styles.statLabel}>
											{stat.key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
										</div>
									</div>
								))}
							</div>
						</>
					)}

					{/* Newsletter Tab */}
					{activeTab === "newsletter" && (
						<>
							<div className={styles.card}>
								<div className={styles.cardHeader}>
									<h2 className={styles.cardTitle}>Send Newsletter</h2>
								</div>
								{sendResult && (
									<div className={sendResult.includes("Failed") ? styles.error : styles.success}>
										{sendResult}
									</div>
								)}
								<div className={styles.form}>
									<div className={styles.field}>
										<label className={styles.label}>Subject</label>
										<input
											className={styles.input}
											value={newsletterSubject}
											onChange={(e) => setNewsletterSubject(e.target.value)}
											placeholder="Newsletter subject..."
										/>
									</div>
									<div className={styles.field}>
										<label className={styles.label}>Content (HTML)</label>
										<textarea
											className={`${styles.input} ${styles.textarea}`}
											value={newsletterContent}
											onChange={(e) => setNewsletterContent(e.target.value)}
											placeholder="<p>Your newsletter content here...</p>"
										/>
									</div>
									<button
										className={`${styles.btn} ${styles.btnPrimary}`}
										onClick={handleSendNewsletter}
										disabled={sending || !newsletterSubject.trim() || !newsletterContent.trim()}
									>
										{sending ? "Sending..." : "Send to All Subscribers"}
									</button>
								</div>
							</div>

							<div className={styles.card}>
								<div className={styles.cardHeader}>
									<h2 className={styles.cardTitle}>Subscribers ({subscribers.length})</h2>
								</div>
								{subscribers.length === 0 ? (
									<div className={styles.empty}>No subscribers yet.</div>
								) : (
									<div style={{ overflowX: "auto" }}>
										<table className={styles.table}>
										<thead>
											<tr>
												<th>Email</th>
												<th>Name</th>
												<th>Status</th>
												<th>Subscribed</th>
												<th></th>
											</tr>
										</thead>
										<tbody>
											{subscribers.map((sub) => (
												<tr key={sub.id}>
													<td>{sub.email}</td>
													<td>{sub.name || "—"}</td>
													<td>
														<span
															className={`${styles.badge} ${sub.status === "active" ? styles.badgeActive : styles.badgeRejected}`}
														>
															{sub.status}
														</span>
													</td>
													<td>{new Date(sub.subscribed_at).toLocaleDateString()}</td>
													<td>
														<button
															className={`${styles.btn} ${styles.btnDanger}`}
															onClick={() => handleDeleteSubscriber(sub)}
														>
															Delete
														</button>
													</td>
												</tr>
											))}
										</tbody>
										</table>
									</div>
								)}
							</div>
						</>
					)}

					{/* Extensions Tab */}
					{activeTab === "extensions" && (
						<div className={styles.card}>
							<div className={styles.cardHeader}>
								<h2 className={styles.cardTitle}>Extension Submissions ({submissions.length})</h2>
							</div>
							{submissions.length === 0 ? (
								<div className={styles.empty}>No submissions yet.</div>
							) : (
								<div style={{ overflowX: "auto" }}>
									<table className={styles.table}>
										<thead>
											<tr>
												<th>Name</th>
												<th>Author</th>
												<th>Tier</th>
												<th>Status</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody>
											{submissions.map((sub) => (
												<tr key={sub.id}>
													<td>{sub.name}</td>
													<td>{sub.author}</td>
													<td>{sub.tier}</td>
													<td>
														<span
															className={`${styles.badge} ${
																sub.status === "approved"
																	? styles.badgeActive
																	: sub.status === "rejected"
																		? styles.badgeRejected
																		: styles.badgePending
															}`}
														>
															{sub.status}
														</span>
													</td>
													<td>
														{sub.status === "pending" && (
															<div style={{ display: "flex", gap: "0.5rem" }}>
																<button
																	className={`${styles.btn} ${styles.btnPrimary}`}
																	onClick={() => handleApproveSubmission(sub.id)}
																>
																	Approve
																</button>
																<button
																	className={`${styles.btn} ${styles.btnDanger}`}
																	onClick={() => handleRejectSubmission(sub.id)}
																>
																	Reject
																</button>
															</div>
														)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</div>
					)}

					{/* Users Tab */}
					{activeTab === "users" && (
						<div className={styles.card}>
							<div className={styles.cardHeader}>
								<h2 className={styles.cardTitle}>Users ({profiles.length})</h2>
							</div>
							{userUpdateError && <div className={styles.error}>{userUpdateError}</div>}
							{profiles.length === 0 ? (
								<div className={styles.empty}>No users yet.</div>
							) : (
								<div style={{ overflowX: "auto" }}>
									<table className={styles.table}>
										<thead>
											<tr>
												<th>Email</th>
												<th>Name</th>
												<th>Plan</th>
												<th>Admin</th>
												<th>Messages</th>
												<th>Joined</th>
												<th></th>
											</tr>
										</thead>
										<tbody>
											{profiles.map((p) => (
												<tr key={p.id}>
													<td>{p.email}</td>
													<td>{p.name || "—"}</td>
													<td>
														<select
															className={styles.input}
															style={{ width: "auto", padding: "0.3rem 0.5rem" }}
															value={p.plan}
															disabled={updatingId === p.id}
															onChange={(e) => handlePlanChange(p, e.target.value)}
														>
															<option value="free">Free</option>
															<option value="pro">Pro</option>
														</select>
													</td>
													<td>
														<button
															className={`${styles.btn} ${
																p.is_admin === "true" || p.is_admin === true
																	? styles.btnPrimary
																	: styles.btnSecondary
															}`}
															disabled={updatingId === p.id}
															onClick={() => handleAdminToggle(p)}
														>
															{p.is_admin === "true" || p.is_admin === true ? "Yes" : "No"}
														</button>
													</td>
													<td>{p.messages_this_month}</td>
													<td>{new Date(p.created_at).toLocaleDateString()}</td>
													<td>
														<button
															className={`${styles.btn} ${styles.btnDanger}`}
															disabled={updatingId === p.id}
															onClick={() => handleDeleteUser(p)}
														>
															Delete
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</div>
					)}
				</div>
			</main>
			<Footer />
		</div>
	);
}
