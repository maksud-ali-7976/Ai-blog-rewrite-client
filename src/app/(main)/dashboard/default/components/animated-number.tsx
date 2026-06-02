"use client";

import { useSpring, useTransform } from "framer-motion";
import { useState } from "react";

export default function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));
  const [displayVal, setDisplayVal] = useState(0);

  // Drive the spring to the target value
  spring.set(value);
  display.on("change", (v) => setDisplayVal(v));

  return <span>{displayVal}</span>;
}
