"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { checkIsAdmin } from "@/actions/auth";
import CLSLogo from "@/components/ui/CLSLogo";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const scrollIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHome = pathname === "/";
  const useDarkText = !isHome || isScrolled;

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastScrollY.current;
    setIsScrolled(latest > 50);

    // Hide on scroll down past 100px
    if (latest > 100) {
      setIsHidden(diff > 0);
    } else {
      setIsHidden(false);
    }
    lastScrollY.current = latest;

    // Auto-show header after scroll stops (1.5s idle)
    if (scrollIdleTimer.current) clearTimeout(scrollIdleTimer.current);
    scrollIdleTimer.current = setTimeout(() => {
      setIsHidden(false);
    }, 1500);
  });

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  useEffect(() => {
    checkIsAdmin().then(setIsAdmin);
  }, [pathname]);

  // Show header when drag/pointer interaction ends
  useEffect(() => {
    const handlePointerUp = () => {
      if (lastScrollY.current > 100) {
        // Small delay to let scroll settle, then show header
        setTimeout(() => setIsHidden(false), 300);
      }
    };
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
      if (scrollIdleTimer.current) clearTimeout(scrollIdleTimer.current);
    };
  }, []);

  return (
    <>
      <motion.header
        animate={{
          y: isHidden && !isMobileOpen ? "-100%" : "0%",
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          useDarkText
            ? "bg-background/90 backdrop-blur-2xl border-b border-border/30"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2">
              <CLSLogo
                size="sm"
                variant={useDarkText ? "dark" : "light"}
              />
              <span
                className={cn(
                  "text-lg font-bold tracking-tight transition-colors duration-300 lg:text-xl",
                  useDarkText ? "text-primary" : "text-white"
                )}
              >
                클래식
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
                          : "text-primary/60 hover:text-primary"
                        : isActive
                          ? "text-accent"
                          : "text-white/60 hover:text-white"
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* CTA */}
              <Link
                href="/contact"
                className={cn(
                  "ml-4 rounded-full px-5 py-2 text-xs font-semibold transition-all duration-500",
                  useDarkText
                    ? "bg-accent text-white hover:shadow-lg hover:shadow-accent/20"
                    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                )}
              >
                견적 문의
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className={cn(
                    "ml-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300",
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
      </motion.header>

      {/* Mobile Navigation - OUTSIDE header to avoid backdrop-filter containing block issue */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-16 z-60 bg-background lg:hidden"
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: NAV_ITEMS.length * 0.05, duration: 0.3 }}
                className="mt-8"
              >
                <Link
                  href="/contact"
                  className="inline-flex rounded-full bg-accent px-10 py-4 text-sm font-semibold text-white"
                >
                  무료 견적 문의
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
