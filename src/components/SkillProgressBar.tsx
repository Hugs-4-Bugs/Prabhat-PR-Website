import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface SkillProgressBarProps {
  name: string;
  percentage: number;
  delay?: number;
  color?: string;
}

const SkillProgressBar = ({ name, percentage, delay = 0, color }: SkillProgressBarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <div ref={ref} className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="font-body text-sm text-primary-foreground">{name}</span>
        <motion.span
          className="font-body text-sm text-primary-foreground/70"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
        >
          {percentage}%
        </motion.span>
      </div>
      
      <div className="h-2 bg-primary-foreground/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full relative"
          style={{
            background: color || 'linear-gradient(90deg, hsl(var(--accent)) 0%, hsl(var(--accent) / 0.7) 100%)',
          }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
          transition={{ duration: 1, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={isInView ? { x: '100%' } : { x: '-100%' }}
            transition={{ duration: 1.5, delay: delay + 0.5, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SkillProgressBar;
