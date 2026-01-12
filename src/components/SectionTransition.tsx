import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface SectionTransitionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const SectionTransition = ({ children, className = '', delay = 0 }: SectionTransitionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 60, scale: 0.98 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          duration: 0.8,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
      } : {}}
    >
      {children}
    </motion.div>
  );
};

export default SectionTransition;
