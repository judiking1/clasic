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
        ) => unknown;
        LatLng: new (lat: number, lng: number) => unknown;
        Marker: new (options: Record<string, unknown>) => unknown;
      };
    };
  }
}

const NAVER_MAP_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

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
      zoom: 16,
      zoomControl: true,
    });

    new window.naver.maps.Marker({
      position: location,
      map,
    });
  }, [isScriptLoaded]);

  if (!NAVER_MAP_CLIENT_ID) {
    return (
      <div className="flex h-80 w-full items-center justify-center bg-gray-100 text-gray-500">
        <div className="text-center">
          <svg className="mx-auto mb-3 h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm font-medium">지도를 불러올 수 없습니다</p>
          <p className="mt-1 text-xs text-gray-400">
            네이버 지도 클라이언트 ID가 설정되지 않았습니다
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_MAP_CLIENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => setIsScriptLoaded(true)}
      />
      <div ref={mapRef} className="h-80 w-full" />
    </>
  );
}
