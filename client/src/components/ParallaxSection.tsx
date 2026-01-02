import { ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsMobile } from "@/hooks/useMobile";

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export default function ParallaxSection({ children, speed = 0.5, className = "" }: ParallaxSectionProps) {
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${(1 - speed) * 100}%`]);

  // Deaktiviere Parallax auf Mobile für bessere Performance
  if (isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div style={{ y }} className={`${className} overflow-hidden`}>
      {children}
    </motion.div>
  );
}

