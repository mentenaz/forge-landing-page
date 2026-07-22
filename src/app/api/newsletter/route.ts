import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
	try {
		const { name, email } = await request.json();

		if (!email || typeof email !== "string") {
			return NextResponse.json({ error: "Email is required" }, { status: 400 });
		}

		const normalizedEmail = email.toLowerCase().trim();

		// Check if already subscribed
		const { data: existing } = await supabase
			.from("newsletter_subscribers")
			.select("id, status")
			.eq("email", normalizedEmail)
			.single();

		if (existing) {
			if (existing.status === "active") {
				return NextResponse.json(
					{ error: "You're already subscribed!" },
					{ status: 409 },
				);
			}
			// Re-subscribe if previously unsubscribed
			const { error: updateError } = await supabase
				.from("newsletter_subscribers")
				.update({
					status: "active",
					name: name || null,
					subscribed_at: new Date().toISOString(),
					unsubscribed_at: null,
				})
				.eq("id", existing.id);

			if (updateError) throw updateError;

			// Trigger thank-you email
			await triggerThankYouEmail(normalizedEmail, name);

			return NextResponse.json({ message: "Welcome back! You're subscribed." });
		}

		// New subscriber
		const { error: insertError } = await supabase
			.from("newsletter_subscribers")
			.insert({
				email: normalizedEmail,
				name: name || null,
				status: "active",
			});

		if (insertError) throw insertError;

		// Trigger thank-you email
		await triggerThankYouEmail(normalizedEmail, name);

		return NextResponse.json({ message: "You're subscribed!" });
	} catch (err: any) {
		console.error("Newsletter subscribe error:", err);
		return NextResponse.json(
			{ error: "Something went wrong. Please try again." },
			{ status: 500 },
		);
	}
}

async function triggerThankYouEmail(email: string, name: string | null) {
	try {
		const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/newsletter-email`;

		await fetch(functionUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
			},
			body: JSON.stringify({
				type: "thank_you",
				email,
				name,
			}),
		});
	} catch (err) {
		console.error("Failed to trigger thank-you email:", err);
	}
}
