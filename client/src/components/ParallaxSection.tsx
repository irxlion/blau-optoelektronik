import { ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export default function ParallaxSection({ children, speed = 0.5, className = "" }: ParallaxSectionProps) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${(1 - speed) * 100}%`]);

  return (
    <motion.div style={{ y }} className={`${className} overflow-hidden`}>
      {children}
    </motion.div>
  );
}

