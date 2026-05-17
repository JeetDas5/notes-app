"use client";

import { motion } from "framer-motion";

export function LandingBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-linear-to-b from-[#faf9ff] via-[#ffffff] to-[#faf9ff] dark:from-[#030014] dark:via-[#080711] dark:to-[#030014] overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 bg-grid-black/[0.015] dark:bg-grid-white/[0.015] bg-size-[40px_40px] pointer-events-none -z-20 mask-[radial-gradient(ellipse_at_center,white,transparent_80%)]" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.06),transparent_50%)] pointer-events-none -z-10" />

      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-5%] left-[10%] w-[450px] h-[450px] sm:w-[600px] sm:h-[600px] rounded-full bg-linear-to-tr from-violet-600/12 to-indigo-600/12 dark:from-violet-500/4 dark:to-indigo-500/4 blur-[90px] sm:blur-[130px] pointer-events-none -z-10"
      />

      <motion.div
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 50, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[25%] right-[-5%] w-[400px] h-[400px] sm:w-[550px] sm:h-[550px] rounded-full bg-linear-to-br from-fuchsia-600/12 to-pink-600/12 dark:from-fuchsia-500/4 dark:to-pink-500/4 blur-[80px] sm:blur-[120px] pointer-events-none -z-10"
      />

      <motion.div
        animate={{
          x: [0, 30, -40, 0],
          y: [0, 40, -50, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[55%] left-[-5%] w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] rounded-full bg-linear-to-tr from-cyan-600/10 to-blue-600/10 dark:from-cyan-500/3 dark:to-blue-500/3 blur-[90px] sm:blur-[140px] pointer-events-none -z-10"
      />

      <motion.div
        animate={{
          x: [0, -30, 20, 0],
          y: [0, -40, 40, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[5%] right-[15%] w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] rounded-full bg-linear-to-br from-violet-600/12 to-pink-600/12 dark:from-violet-500/4 dark:to-pink-500/4 blur-[80px] sm:blur-[110px] pointer-events-none -z-10"
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
