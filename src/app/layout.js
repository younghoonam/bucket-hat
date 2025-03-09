import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Patternea - Bucket Hat Pattern Generator",
  description:
    "Interactively create custom bucket hat sewing patterns! Input measurements, preview in 3D, simulate physics and download a printable pattern for free.",
  keywords:
    "bucket hat pattern, sewing pattern generator, free sewing patterns, 3D pattern preview, hat physics simulator, printable sewing patterns",
  authors: [{ name: "Younghoo Nam", url: "https://younghoonam.com" }],
  openGraph: {
    title: "Bucket Hat Sewing Pattern Generator",
    description:
      "Interactively create custom bucket hat sewing patterns! Input measurements, preview in 3D, simulate physics and download a printable pattern for free.",
    url: "https://patternea.com",
    siteName: "Patternea",
    images: [
      {
        url: "/website-preview.jpg",
        width: 1492,
        height: 1039,
        alt: "Bucket Hat Sewing Pattern Preview",
      },
    ],
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/images/favicon.svg",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
