import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://superdeal.com"),
  title: {
    default: "SuperDeal | Ultimate Shopping & Inventory Platform",
    template: "%s | SuperDeal Ecommerce"
  },
  description: "Shop top quality electronics, gaming gear, and accessories at SuperDeal with best prices, fast delivery, and authentic warranty.",
  keywords: ["Ecommerce", "Online Shopping", "Gaming Gear", "Electronics", "SuperDeal Bangladesh"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SuperDeal | Ultimate Shopping Platform",
    description: "Shop top quality electronics and accessories at SuperDeal.",
    url: "https://superdeal.com",
    siteName: "SuperDeal",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SuperDeal Ltd.",
    "url": "https://superdeal.com",
    "logo": "https://superdeal.com/logo.png",
    "sameAs": [
      "https://facebook.com/superdeal",
      "https://twitter.com/superdeal"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+880-1700-000000",
      "contactType": "customer service",
      "areaServed": "BD",
      "availableLanguage": ["en", "bn"]
    }
  };

  return (
    <html lang="en" data-theme="light" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen bg-base-100 text-base-content antialiased">
        {children}
      </body>
    </html>
  );
}
