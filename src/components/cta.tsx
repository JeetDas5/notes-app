"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-accent/20 bg-card/30 backdrop-blur-md bg-linear-to-br from-accent/20 via-accent/10 to-transparent p-12 sm:p-16 text-center shadow-2xl"
        >
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-gray-500 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3 h-3" />
              Limited Time Offer
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Ready to transform the way you take notes?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
              Join thousands of teams already using NotesAI to write smarter,
              collaborate faster, and stay organized effortlessly.
            </p>

            <div className=" flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-xl shadow-accent/20 group"
              >
                <Link href="/signup">
                  Start for Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <p className="mt-8 text-sm text-muted-foreground font-medium">
              No credit card required • Cancel anytime • 24/7 Priority support
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
