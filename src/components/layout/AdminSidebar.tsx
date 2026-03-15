"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/auth";

const adminNavItems = [
  { label: "대시보드", href: "/admin", icon: "&#128202;" },
  { label: "시공사례 관리", href: "/admin/portfolio", icon: "&#128247;" },
  { label: "샘플 관리", href: "/admin/samples", icon: "&#127912;" },
  { label: "문의 관리", href: "/admin/inquiries", icon: "&#128172;" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col bg-primary text-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <Link href="/admin" className="text-lg font-bold text-accent">
          관리자 패널
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {adminNavItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/10 text-accent"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <span dangerouslySetInnerHTML={{ __html: item.icon }} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          className="mb-2 block text-center text-xs text-white/50 hover:text-white/70"
        >
          사이트 보기
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full rounded-lg bg-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          >
            로그아웃
          </button>
        </form>
      </div>
    </aside>
  );
}
