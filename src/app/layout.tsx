import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: {
		default: "Mentenaz Forge — The Developer Cockpit",
		template: "%s | Mentenaz Forge",
	},
	description: "System monitoring, multi-engine editor, LSP, Git/GitHub, databases, terminal, AI assistant, and task automation — all in ~28MB RAM.",
	metadataBase: new URL("https://forge.mentenaz-server.com"),
	openGraph: {
		title: "Mentenaz Forge — The Developer Cockpit",
		description: "~28MB RAM, 161 Rust commands, 7-language LSP. The developer cockpit that fits on your desktop.",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
