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
      <head>
        {/* Google Analytics Script */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.MEASUREMENT_ID}');
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NH229SJ7');
          `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NH229SJ7"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {children}
      </body>
    </html>
  );
}
