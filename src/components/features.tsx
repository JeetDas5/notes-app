"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Users,
  Library,
  Lock,
  Globe,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

export function Features() {
  const features = [
    {
      title: "AI-Powered Formatting",
      description:
        "Let NotesAI automatically format your notes, fix grammar, and improve clarity with a single click.",
      icon: Sparkles,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Real-Time Collaboration",
      description:
        "Write together with your team in real-time. See changes instantly and never lose work.",
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Smart Organization",
      description:
        "Automatically tag, categorize, and find notes with AI-powered search and suggestions.",
      icon: Library,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Secure & Private",
      description:
        "End-to-end encryption ensures your notes are always protected. Your data belongs to you.",
      icon: Lock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Works Everywhere",
      description:
        "Access your notes from any device. Full offline support with automatic sync when online.",
      icon: Globe,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      title: "24/7 Support",
      description:
        "Our team is always ready to help. Get instant support via chat, email, or call.",
      icon: MessageSquare,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="features"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide leading-14"
          >
            Everything you need to take better notes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Powerful features designed to help you write, collaborate, and
            organize with unprecedented efficiency.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group relative rounded-2xl border border-border/50 bg-card/50 dark:bg-card/30 backdrop-blur-md p-8 hover:border-accent/50 hover:bg-accent/2 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-accent/5"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bg} ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                {feature.title}
                <CheckCircle2 className="w-4 h-4 text-black dark:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
