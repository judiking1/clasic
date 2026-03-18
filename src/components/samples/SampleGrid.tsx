"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Sample } from "@/types";
import { SampleCard } from "./SampleCard";
import { checkIsAdmin } from "@/actions/auth";

interface SampleGridProps {
  samples: Sample[];
}

export function SampleGrid({ samples }: SampleGridProps) {
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
          transition: { staggerChildren: 0.06 },
        },
      }}
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    >
      {samples.map((sample) => (
        <motion.div
          key={sample.id}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.6,
                ease: [0.25, 0.4, 0.25, 1],
              },
            },
          }}
        >
          <SampleCard sample={sample} isAdmin={isAdmin} />
        </motion.div>
      ))}
    </motion.div>
  );
}
