import type { Metadata } from "next";
import { Noto_Sans_KR, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_CONFIG } from "@/lib/constants";
import SmoothScroll from "@/components/ui/SmoothScroll";
import ScrollProgress from "@/components/ui/ScrollProgress";
import GrainOverlay from "@/components/ui/GrainOverlay";
import MouseGlow from "@/components/ui/MouseGlow";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: `${SITE_CONFIG.name} | 인조대리석 싱크대·세면대·카운터 맞춤 제작 및 시공`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "인조대리석",
    "싱크대",
    "세면대",
    "카운터",
    "대리석 시공",
    "인조대리석 가공",
    "주방 상판",
    "세면대 상판",
    "카운터 상판",
    "맞춤 제작",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} | 인조대리석 전문 시공`,
    description: SITE_CONFIG.description,
  },
  verification: {
    other: {
      "naver-site-verification":
        process.env.NAVER_SITE_VERIFICATION || "",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} | 인조대리석 전문 시공`,
    description: SITE_CONFIG.description,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} ${playfairDisplay.variable} font-sans antialiased`}>
        <SmoothScroll>
          <ScrollProgress />
          <GrainOverlay />
          <MouseGlow />
          {children}
        </SmoothScroll>
        <Analytics />
        <SpeedInsights />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": process.env.NEXT_PUBLIC_SITE_URL || "https://clasic.kr",
              name: SITE_CONFIG.name,
              description: SITE_CONFIG.description,
              telephone: SITE_CONFIG.phone,
              email: SITE_CONFIG.email,
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://clasic.kr",
              address: {
                "@type": "PostalAddress",
                streetAddress: SITE_CONFIG.address,
                addressLocality: "남양주시",
                addressRegion: "경기도",
                addressCountry: "KR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: SITE_CONFIG.latitude,
                longitude: SITE_CONFIG.longitude,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "09:00",
                  closes: "18:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "09:00",
                  closes: "13:00",
                },
              ],
              priceRange: "$$",
              image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://clasic.kr"}/og-image.jpg`,
              sameAs: [SITE_CONFIG.naverMapUrl],
            }),
          }}
        />
      </body>
    </html>
  );
}
