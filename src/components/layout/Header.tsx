"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { NAV_ITEMS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { checkIsAdmin } from "@/actions/auth";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const lastScrollY = useRef(0);

  const isHome = pathname === "/";
  const useDarkText = !isHome || isScrolled;

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastScrollY.current;
    setIsScrolled(latest > 50);
    // Hide on scroll down, show on scroll up
    if (latest > 100) {
      setIsHidden(diff > 0);
    } else {
      setIsHidden(false);
    }
    lastScrollY.current = latest;
  });

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    checkIsAdmin().then(setIsAdmin);
  }, [pathname]);

  return (
    <motion.header
      animate={{
        y: isHidden && !isMobileOpen ? "-100%" : "0%",
      }}
      transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        useDarkText
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            {/* Accent dot */}
            <span className="h-2 w-2 rounded-full bg-accent transition-transform duration-300 group-hover:scale-150" />
            <span
              className={cn(
                "text-lg font-bold tracking-tight transition-colors duration-300 lg:text-xl",
                useDarkText ? "text-primary" : "text-white"
              )}
            >
              {SITE_CONFIG.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-[13px] font-medium transition-colors duration-300",
                    useDarkText
                      ? isActive
                        ? "text-accent"
                        : "text-primary/70 hover:text-primary"
                      : isActive
                        ? "text-accent"
                        : "text-white/70 hover:text-white"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-4 right-4 h-[2px] bg-accent"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "ml-4 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300",
                  useDarkText
                    ? "bg-primary text-white hover:bg-primary/80"
                    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                )}
              >
                관리자
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center lg:hidden",
              useDarkText ? "text-primary" : "text-white"
            )}
            aria-label="메뉴"
          >
            <div className="flex h-4 w-5 flex-col justify-between">
              <motion.span
                animate={{
                  rotate: isMobileOpen ? 45 : 0,
                  y: isMobileOpen ? 7 : 0,
                }}
                className={cn(
                  "block h-[1.5px] w-full origin-center transition-colors",
                  useDarkText ? "bg-primary" : "bg-white"
                )}
              />
              <motion.span
                animate={{ opacity: isMobileOpen ? 0 : 1 }}
                className={cn(
                  "block h-[1.5px] w-3/4 transition-colors",
                  useDarkText ? "bg-primary" : "bg-white"
                )}
              />
              <motion.span
                animate={{
                  rotate: isMobileOpen ? -45 : 0,
                  y: isMobileOpen ? -7 : 0,
                }}
                className={cn(
                  "block h-[1.5px] w-full origin-center transition-colors",
                  useDarkText ? "bg-primary" : "bg-white"
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Full screen overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-16 bg-background/98 backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex h-full flex-col items-center justify-center gap-1 px-8">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "block py-4 text-center text-2xl font-bold transition-colors duration-300",
                      pathname === item.href
                        ? "text-accent"
                        : "text-primary hover:text-accent"
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: NAV_ITEMS.length * 0.05, duration: 0.3 }}
                  className="mt-8"
                >
                  <Link
                    href="/admin"
                    className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white"
                  >
                    관리자 대시보드
                  </Link>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
