import "leaflet/dist/leaflet.css";
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata = {
  metadataBase: new URL("https://deccanheritage.org"),
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
    url: "https://deccanheritage.org",
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
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c2603a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 3l3 5-3 2-3-2z M12 10v8 M8 21h8 M9 18h6'/></svg>",
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://deccanheritage.org/#website",
        "url": "https://deccanheritage.org",
        "name": "Deccan Heritage Map",
        "description": "Interactive map of Hyderabad's built heritage, monuments, and weekend getaways.",
        "inLanguage": "en-IN",
      },
      {
        "@type": "Organization",
        "@id": "https://deccanheritage.org/#organization",
        "name": "Deccan Heritage Map",
        "url": "https://deccanheritage.org",
        "logo": "https://deccanheritage.org/photos/charminar.jpg",
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,500;9..144,0,600;9..144,0,700;9..144,1,500&family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
