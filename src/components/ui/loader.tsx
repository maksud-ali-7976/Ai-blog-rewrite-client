"use client";

import { motion } from "framer-motion";
import { Sparkles, BookOpen, Wand2 } from "lucide-react";

type StoryLoaderProps = {
  text?: string;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  showWand?: boolean;
};

export default function Loader({
  text = "Loading....",
  fullScreen = true,
  size = "md",
  showWand = true,
}: StoryLoaderProps) {
  const sizeMap = {
    sm: {
      ring: "h-16 w-16",
      glow: "h-10 w-10",
      icon: "h-10 w-10",
      iconInner: "h-5 w-5",
    },
    md: {
      ring: "h-24 w-24",
      glow: "h-16 w-16",
      icon: "h-14 w-14",
      iconInner: "h-6 w-6",
    },
    lg: {
      ring: "h-32 w-32",
      glow: "h-20 w-20",
      icon: "h-20 w-20",
      iconInner: "h-8 w-8",
    },
  };

  const s = sizeMap[size];

  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "min-h-screen" : "w-full h-full"
      } bg-background`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated Icon Stack */}
        <div className="relative flex items-center justify-center">
          {/* Rotating Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className={`absolute rounded-full border border-purple-400/30 ${s.ring}`}
          />

          {/* Glow */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`absolute rounded-full bg-purple-500/20 blur-xl ${s.glow}`}
          />

          {/* Center Icon */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`z-10 flex items-center justify-center rounded-xl bg-purple-500 text-white shadow-lg ${s.icon}`}
          >
            <BookOpen className={s.iconInner} />
          </motion.div>

          {/* Sparkles */}
          <motion.div
            animate={{ y: [-10, -30], opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2"
          >
            <Sparkles className="h-4 w-4 text-purple-400" />
          </motion.div>

          <motion.div
            animate={{ y: [-5, -25], opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            className="absolute right-0 top-1/2"
          >
            <Sparkles className="h-3 w-3 text-purple-300" />
          </motion.div>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-1">
          <motion.p
            className="text-lg font-semibold text-foreground text-center"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {text}
          </motion.p>

          {/* Dots */}
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full bg-purple-400"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Wand (optional) */}
        {showWand && (
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-purple-400"
          >
            <Wand2 className="h-5 w-5" />
          </motion.div>
        )}
      </div>
    </div>
  );
}
