"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function SparkleIcon() {
  return (
    <motion.div
      animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <Sparkles className="h-5 w-5 text-primary" />
    </motion.div>
  );
}
