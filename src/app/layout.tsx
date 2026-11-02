import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mentenaz Forge Super — The Developer Cockpit",
    template: "%s | Mentenaz Forge",
  },
  description:
    "A developer cockpit built on the Zed editor: database, GitHub, runtime and process tools in one native editor. No account required.",
  metadataBase: new URL("https://forge.mentenaz-server.com"),
  openGraph: {
    title: "Mentenaz Forge Super — The Developer Cockpit",
    description:
      "A developer cockpit built on the Zed editor, for Windows and Linux. No account required.",
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
      <body suppressHydrationWarning>
        {" "}
        {/* ← add this */}
        {children}
      </body>
    </html>
  );
}
