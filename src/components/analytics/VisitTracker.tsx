"use client";

import { useEffect } from "react";

/**
 * Records a single site visit per browser session.
 * Uses sessionStorage to ensure only 1 record per session.
 */
export function VisitTracker() {
  useEffect(() => {
    if (sessionStorage.getItem("site-visited")) return;
    sessionStorage.setItem("site-visited", "1");

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "visit" }),
    }).catch(() => {});
  }, []);

  return null;
}
