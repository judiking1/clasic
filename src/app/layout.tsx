import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: SITE_CONFIG.name,
              description: SITE_CONFIG.description,
              telephone: SITE_CONFIG.phone,
              address: {
                "@type": "PostalAddress",
                streetAddress: SITE_CONFIG.address,
                addressCountry: "KR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: SITE_CONFIG.latitude,
                longitude: SITE_CONFIG.longitude,
              },
              openingHours: "Mo-Fr 09:00-18:00, Sa 09:00-13:00",
            }),
          }}
        />
      </body>
    </html>
  );
}
