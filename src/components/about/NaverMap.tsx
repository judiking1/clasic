"use client";

import { useRef, useEffect, useState } from "react";
import Script from "next/script";
import { SITE_CONFIG } from "@/lib/constants";

declare global {
  interface Window {
    naver: {
      maps: {
        Map: new (
          element: HTMLElement,
          options: Record<string, unknown>
        ) => Record<string, unknown>;
        LatLng: new (lat: number, lng: number) => unknown;
        Marker: new (options: Record<string, unknown>) => Record<string, unknown>;
        InfoWindow: new (options: Record<string, unknown>) => {
          open: (map: unknown, marker: unknown) => void;
        };
        Event: {
          addListener: (
            target: unknown,
            event: string,
            callback: () => void
          ) => void;
        };
      };
    };
  }
}

const NAVER_MAP_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID;

export function NaverMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (!isScriptLoaded || !mapRef.current || !window.naver) return;

    const location = new window.naver.maps.LatLng(
      SITE_CONFIG.latitude,
      SITE_CONFIG.longitude
    );

    const map = new window.naver.maps.Map(mapRef.current, {
      center: location,
      zoom: 17,
      zoomControl: true,
    });

    const marker = new window.naver.maps.Marker({
      position: location,
      map,
    });

    const infoWindow = new window.naver.maps.InfoWindow({
      content: `
        <div style="padding:12px 16px;min-width:200px;font-family:sans-serif;">
          <strong style="font-size:14px;color:#1a1a1a;">${SITE_CONFIG.name}</strong>
          <p style="margin:4px 0 8px;font-size:12px;color:#666;">${SITE_CONFIG.address}</p>
          <a href="${SITE_CONFIG.naverMapUrl}" target="_blank" rel="noopener noreferrer"
             style="display:inline-block;padding:4px 12px;background:#03C75A;color:white;border-radius:4px;font-size:12px;text-decoration:none;">
            네이버 지도에서 보기
          </a>
        </div>
      `,
      borderColor: "#e5e7eb",
      borderWidth: 1,
    });

    infoWindow.open(map, marker);

    window.naver.maps.Event.addListener(marker, "click", () => {
      infoWindow.open(map, marker);
    });
  }, [isScriptLoaded]);

  if (!NAVER_MAP_CLIENT_ID) {
    return (
      <div className="flex h-80 w-full flex-col items-center justify-center rounded-2xl bg-linear-to-br from-stone-100 to-stone-200 p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        </div>
        <p className="mb-1 text-lg font-bold text-stone-900">{SITE_CONFIG.name}</p>
        <p className="mb-6 text-sm text-stone-600">{SITE_CONFIG.address}</p>
        <a
          href={SITE_CONFIG.naverMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#03C75A] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#02b351] hover:shadow-lg"
        >
          네이버 지도에서 보기
        </a>
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => setIsScriptLoaded(true)}
      />
      <div ref={mapRef} className="h-80 w-full" />
    </>
  );
}
