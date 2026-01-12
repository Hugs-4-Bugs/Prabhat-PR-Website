import { useRef, useEffect, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  backgroundImage: string;
  overlayOpacity?: number;
  children: ReactNode;
  id?: string;
  className?: string;
  backgroundSpeed?: number;
  contentSpeed?: number;
  zoomEffect?: boolean;
}

const ParallaxSection = ({
  backgroundImage,
  overlayOpacity = 0.5,
  children,
  id,
  className = '',
  backgroundSpeed = 0.3,
  contentSpeed = 0.8,
  zoomEffect = true,
}: ParallaxSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Background moves slower (parallax effect)
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-backgroundSpeed * 100}%`, `${backgroundSpeed * 100}%`]
  );

  // Content moves faster
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    [`${contentSpeed * 30}px`, `${-contentSpeed * 30}px`]
  );

  // Zoom effect on background
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    zoomEffect ? [1.1, 1, 1.1] : [1, 1, 1]
  );

  // Opacity fade in/out
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`parallax-section ${className}`}
    >
      {/* Background layer with parallax */}
      <motion.div
        className="parallax-bg"
        style={{
          y: backgroundY,
          scale,
          backgroundImage: `url(${backgroundImage})`,
        }}
      />

      {/* Gradient overlay */}
      <div
        className="parallax-overlay"
        style={{
          background: `linear-gradient(180deg, 
            hsl(205 52% 15% / ${overlayOpacity * 0.8}) 0%, 
            hsl(205 52% 20% / ${overlayOpacity}) 50%, 
            hsl(205 52% 15% / ${overlayOpacity * 0.9}) 100%)`,
        }}
      />

      {/* Content layer */}
      <motion.div
        className="parallax-content"
        style={{ y: contentY, opacity }}
      >
        {children}
      </motion.div>
    </section>
  );
};

export default ParallaxSection;
