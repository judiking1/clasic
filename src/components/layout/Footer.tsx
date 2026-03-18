import Link from "next/link";
import { SITE_CONFIG, NAV_ITEMS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-accent">
              {SITE_CONFIG.name}
            </h3>
            <p className="mb-2 text-sm text-white/70">
              인조대리석 가공 및 시공 전문 업체
            </p>
            <p className="text-sm text-white/70">
              대표: {SITE_CONFIG.owner}
            </p>
            <p className="text-sm text-white/70">
              사업자등록번호: {SITE_CONFIG.businessNumber}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold">바로가기</h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-bold">연락처</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">&#128205;</span>
                <span>{SITE_CONFIG.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <span>&#128222;</span>
                <a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="transition-colors hover:text-accent"
                >
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>&#9993;</span>
                <span>{SITE_CONFIG.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8 text-center text-xs text-white/50">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
