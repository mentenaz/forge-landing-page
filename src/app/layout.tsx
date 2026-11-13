import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Served from this site (see src/fonts/README.md), not fetched from Google by
// every visitor's browser, so the page is not held up waiting for a stylesheet
// from another host.
const oxanium = localFont({
  src: "../fonts/oxanium-latin.woff2",
  weight: "200 800",
  display: "swap",
  variable: "--font-oxanium",
});
const outfit = localFont({
  src: "../fonts/outfit-latin.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-outfit",
});
const cascadia = localFont({
  src: "../fonts/cascadia-code-latin.woff2",
  weight: "200 700",
  display: "swap",
  // Only code uses it, so it is not worth a download before the first paint.
  preload: false,
  variable: "--font-cascadia",
});

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
    <html lang="en" className={`${oxanium.variable} ${outfit.variable} ${cascadia.variable}`}>
      <body suppressHydrationWarning>
        {" "}
        {/* ← add this */}
        {children}
      </body>
    </html>
  );
}
