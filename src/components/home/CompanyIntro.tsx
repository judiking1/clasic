"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "맞춤 제작",
    description:
      "고객의 공간과 요구에 맞는 정밀한 맞춤 설계와 가공으로 완벽한 인조대리석 제품을 제작합니다.",
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
        />
      </svg>
    ),
  },
  {
    title: "직접 시공",
    description:
      "숙련된 전문 기술자가 직접 시공하여 마감 품질을 보장합니다. 중간 과정 없이 신속하고 정확하게 완성합니다.",
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.42 15.17l-5.384 3.073A1.2 1.2 0 014.2 17.106V4.894a1.2 1.2 0 011.838-1.137l5.384 3.073M11.42 15.17l5.384-3.073A1.2 1.2 0 0018.6 11V4.894a1.2 1.2 0 00-1.838-1.137L11.42 6.83m0 8.34V6.83m0 8.34l5.384 3.073M11.42 6.83L6.036 3.757"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 12a9.75 9.75 0 11-19.5 0 9.75 9.75 0 0119.5 0z"
        />
      </svg>
    ),
  },
  {
    title: "합리적인 가격",
    description:
      "직접 가공과 시공으로 중간 마진을 줄여 합리적인 가격에 최고 품질의 인조대리석을 제공합니다.",
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  },
};

export default function CompanyIntro() {
  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-100/50 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={titleVariants}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-3 inline-block text-sm font-medium tracking-widest text-stone-400">
            WHY CLASSIC
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            클래식을 선택하는 이유
          </h2>
          <p className="text-base leading-relaxed text-stone-500 sm:text-lg">
            최고의 품질과 합리적인 가격, 그리고 전문적인 시공 서비스를 한 곳에서 만나보세요.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
          className="mt-16 grid grid-cols-1 gap-6 sm:mt-20 md:grid-cols-3 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className={cn(
                "group relative overflow-hidden rounded-2xl",
                "border border-stone-200/80 bg-white",
                "p-8 sm:p-10",
                "transition-all duration-500",
                "hover:border-stone-300 hover:shadow-xl hover:shadow-stone-200/40",
                "hover:-translate-y-1"
              )}
            >
              {/* Decorative corner accent */}
              <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-stone-100 transition-transform duration-500 group-hover:scale-150" />

              {/* Icon */}
              <div
                className={cn(
                  "relative mb-6 inline-flex items-center justify-center",
                  "h-14 w-14 rounded-xl",
                  "bg-stone-900 text-white",
                  "shadow-lg shadow-stone-900/20",
                  "transition-transform duration-500 group-hover:scale-110"
                )}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="relative mb-3 text-xl font-bold text-stone-900">
                {feature.title}
              </h3>
              <p className="relative text-sm leading-relaxed text-stone-500 sm:text-base">
                {feature.description}
              </p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-stone-900 transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
