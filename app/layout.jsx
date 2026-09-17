import "leaflet/dist/leaflet.css";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata = {
  metadataBase: new URL("https://heritage.mapmyhyd.com"),
  title: {
    default: "Best Places to Visit in Hyderabad — Deccan Heritage Map",
    template: "%s | Deccan Heritage Map",
  },
  description:
    "Discover the best places to visit in Hyderabad through 500 years of history. Explore Charminar, Golconda Fort, Falaknuma Palace, Qutb Shahi Tombs and 48 more heritage sites on an interactive map.",
  keywords: [
    "places to visit in Hyderabad",
    "best places to visit in Hyderabad",
    "Charminar",
    "Golconda Fort",
    "Deccan Heritage Map",
    "Hyderabad monuments map",
    "Qutb Shahi Tombs",
    "Chowmahalla Palace",
    "Falaknuma Palace",
    "weekend getaways from Hyderabad",
    "Hyderabad heritage sites",
    "Hyderabad history",
  ],
  authors: [{ name: "Deccan Heritage Project" }],
  creator: "Deccan Heritage Project",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Best Places to Visit in Hyderabad — Charminar, Golconda Fort & More",
    description:
      "Discover the best places to visit in Hyderabad. Interactive heritage map covering Charminar, Golconda Fort, Falaknuma Palace, Salar Jung Museum and every major monument by era.",
    url: "https://heritage.mapmyhyd.com",
    siteName: "Deccan Heritage Map",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/photos/charminar.jpg",
        width: 1200,
        height: 630,
        alt: "Charminar Hyderabad Deccan Heritage Map",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Places to Visit in Hyderabad — Deccan Heritage Map",
    description:
      "Explore Charminar, Golconda Fort, and 48 more of the best places to visit in Hyderabad — sorted by era, protection status, and walking routes.",
    images: ["/photos/charminar.jpg"],
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "64x64" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://heritage.mapmyhyd.com/#website",
        "url": "https://heritage.mapmyhyd.com",
        "name": "Deccan Heritage Map",
        "description": "Interactive map of Hyderabad's built heritage, monuments, and weekend getaways.",
        "inLanguage": "en-IN",
      },
      {
        "@type": "Organization",
        "@id": "https://heritage.mapmyhyd.com/#organization",
        "name": "Deccan Heritage Map",
        "url": "https://heritage.mapmyhyd.com",
        "logo": "https://heritage.mapmyhyd.com/brand/charminar-logo.png",
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Outfit:wght@400;500;600;700;800&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
