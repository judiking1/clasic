"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { PortfolioWithImages } from "@/types";
import { PortfolioCard } from "./PortfolioCard";
import { checkIsAdmin } from "@/actions/auth";

interface PortfolioGridProps {
  portfolios: PortfolioWithImages[];
}

export function PortfolioGrid({ portfolios }: PortfolioGridProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkIsAdmin().then(setIsAdmin);
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.08 },
        },
      }}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {portfolios.map((portfolio, index) => (
        <motion.div
          key={portfolio.id}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.7,
                ease: [0.25, 0.4, 0.25, 1],
              },
            },
          }}
        >
          <PortfolioCard portfolio={portfolio} isAdmin={isAdmin} />
        </motion.div>
      ))}
    </motion.div>
  );
}
