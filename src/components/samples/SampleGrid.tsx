"use client";

import { motion } from "framer-motion";
import type { Sample } from "@/types";
import { SampleCard } from "./SampleCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

interface SampleGridProps {
  samples: Sample[];
}

export function SampleGrid({ samples }: SampleGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    >
      {samples.map((sample) => (
        <motion.div key={sample.id} variants={itemVariants}>
          <SampleCard sample={sample} />
        </motion.div>
      ))}
    </motion.div>
  );
}
