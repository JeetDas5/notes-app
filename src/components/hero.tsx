"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)] opacity-[0.03] dark:opacity-[0.05]" />

      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-500"></span>
            </span>
            <p className="text-sm text-gray-500 font-semibold tracking-wide uppercase">
              Intelligent Notes for Teams
            </p>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-balance text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70"
        >
          Elevate Your Team&apos;s Productivity
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-balance mt-8 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
        >
          Experience the future of note-taking with AI-powered formatting,
          real-time collaboration, and seamless organization.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="xl"
            asChild
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-95"
          >
            <Link href="/signup" className="flex items-center gap-2">
              Start Free Trial <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            size="xl"
            variant="outline"
            asChild
            className="px-8 transition-all hover:bg-accent/5"
          >
            <Link href="#demo" className="flex items-center gap-2">
              <Play className="w-4 h-4 fill-current" /> Watch Demo
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 grid grid-cols-3 gap-8 text-center border-t border-border/40 pt-12 max-w-3xl mx-auto"
        >
          <div className="space-y-1">
            <div className="text-3xl font-bold tracking-tight">10K+</div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              Active Users
            </p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold tracking-tight">99.9%</div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              Uptime
            </p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold tracking-tight">24/7</div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              Support
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
