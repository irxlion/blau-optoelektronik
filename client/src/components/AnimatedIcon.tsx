import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AnimatedIconProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
  animationType?: "pulse" | "rotate" | "bounce" | "float";
}

export default function AnimatedIcon({
  icon: Icon,
  className = "",
  size = 24,
  animationType = "pulse",
}: AnimatedIconProps) {
  const animations = {
    pulse: {
      animate: { scale: [1, 1.1, 1] },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
    rotate: {
      animate: { rotate: 360 },
      transition: { duration: 3, repeat: Infinity, ease: "linear" },
    },
    bounce: {
      animate: { y: [0, -10, 0] },
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
    },
    float: {
      animate: { y: [0, -8, 0] },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <motion.div {...animations[animationType]} className={className}>
      <Icon size={size} />
    </motion.div>
  );
}




