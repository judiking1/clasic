"use client";

import { motion } from "framer-motion";
import type { PortfolioWithImages } from "@/types";
import { PortfolioCard } from "./PortfolioCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

interface PortfolioGridProps {
  portfolios: PortfolioWithImages[];
}

export function PortfolioGrid({ portfolios }: PortfolioGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {portfolios.map((portfolio) => (
        <motion.div key={portfolio.id} variants={itemVariants}>
          <PortfolioCard portfolio={portfolio} />
        </motion.div>
      ))}
    </motion.div>
  );
}
