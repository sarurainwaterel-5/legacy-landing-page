import Script from "next/script";
import "./globals.css";
import { SITE } from "@/lib/site";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-E47ET6JEZG";

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Legacy Partners | Life Insurance, Credit Repair & Tax Preparation in Texas", template: "%s | Legacy Partners" },
  description: "Legacy Partners helps Texas families with life insurance, credit repair and tax preparation. Talk to licensed agent Lashanae Johnson — free consultation.",
  openGraph: { type: "website", siteName: SITE.name, locale: "en_US", images: [{ url: "/logo.webp", width: 500, height: 500 }] },
  twitter: { card: "summary" },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon-32x32.png", sizes: "32x32" }], apple: "/apple-touch-icon.png" },
};

export const viewport = { themeColor: "#120304", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        {children}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
        <Script id="ga" strategy="lazyOnload">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`}</Script>
      </body>
    </html>
  );
}
