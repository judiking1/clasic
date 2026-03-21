"use client";

import { useEffect, useState } from "react";

export function VisitorCounter() {
  const [stats, setStats] = useState<{ today: number; total: number } | null>(null);

  useEffect(() => {
    fetch("/api/views?summary=true")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats || stats.today == null || stats.total == null) return null;

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/40">
      <span>
        Today <strong className="text-white/70">{stats.today.toLocaleString()}</strong>
      </span>
      <span className="h-3 w-px bg-white/10" />
      <span>
        Total <strong className="text-white/70">{stats.total.toLocaleString()}</strong>
      </span>
    </div>
  );
}
