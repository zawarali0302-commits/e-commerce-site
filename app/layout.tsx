import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/home/navbar";
import { Announcement } from "@/components/home/announcement";
import { Footer } from "@/components/home/footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-outfit",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://eclat.pk";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Éclat — Refined Pakistani Fashion",
    template: "%s — Éclat",
  },
  description:
    "Premium unstitched and ready-to-wear Pakistani fashion. Shop the latest collections from Éclat.",
  keywords: [
    "Pakistani fashion",
    "unstitched",
    "ready to wear",
    "lawn",
    "eid collection",
    "women clothing Pakistan",
  ],
  authors: [{ name: "Éclat" }],
  creator: "Éclat",
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: BASE_URL,
    siteName: "Éclat",
    title: "Éclat — Refined Pakistani Fashion",
    description:
      "Premium unstitched and ready-to-wear Pakistani fashion. Shop the latest collections.",
    images: [
      {
        url: `${BASE_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "Éclat — Refined Pakistani Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Éclat — Refined Pakistani Fashion",
    description: "Premium unstitched and ready-to-wear Pakistani fashion.",
    images: [`${BASE_URL}/og-default.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#f0ebe3",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Éclat",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "Urdu"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${cormorant.variable} ${outfit.variable}`}>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationJsonLd),
            }}
          />
        </head>
        <body className="font-sans antialiased">
          <Announcement />
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}