import { motion } from 'framer-motion';

const ScrollIndicator = () => {
  return (
    <motion.div
      className="scroll-indicator"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.5 }}
    >
      <span className="font-body text-xs tracking-[0.2em] text-primary-foreground/70 uppercase">
        Scroll
      </span>
      <motion.div
        className="w-px h-16 bg-gradient-to-b from-primary-foreground to-transparent"
        animate={{ 
          scaleY: [1, 1.3, 1],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};

export default ScrollIndicator;
