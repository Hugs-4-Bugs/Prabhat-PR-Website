import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  splitBy?: 'word' | 'letter';
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

const AnimatedText = ({
  text,
  className = '',
  delay = 0,
  splitBy = 'word',
  tag = 'span',
}: AnimatedTextProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const items = splitBy === 'word' ? text.split(' ') : text.split('');
  const Tag = tag;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: splitBy === 'word' ? 0.1 : 0.03,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={`overflow-hidden ${className}`}
    >
      <Tag className="inline-block">
        {items.map((item, index) => (
          <motion.span
            key={index}
            variants={itemVariants}
            className="inline-block"
            style={{ marginRight: splitBy === 'word' ? '0.25em' : undefined }}
          >
            {item === ' ' ? '\u00A0' : item}
          </motion.span>
        ))}
      </Tag>
    </motion.div>
  );
};

export default AnimatedText;
